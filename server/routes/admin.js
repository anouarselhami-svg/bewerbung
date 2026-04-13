import { Router } from 'express'
import { pool } from '../db/pool.js'
import { env } from '../config/env.js'

const router = Router()
let leadStatusSchemaReady = false

const getAdminToken = () => env.ADMIN_DASHBOARD_TOKEN || env.COMMENT_ADMIN_TOKEN

const requireAdminToken = (req, res, next) => {
  const expectedToken = getAdminToken()

  if (!expectedToken) {
    return res.status(503).json({ error: 'Admin dashboard is disabled on this server' })
  }

  const providedToken = req.get('x-admin-token')?.trim()

  if (!providedToken || providedToken !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized admin request' })
  }

  return next()
}

const escapeCsvValue = (value) => {
  const stringValue = value == null ? '' : String(value)
  return `"${stringValue.replace(/"/g, '""')}"`
}

const isValidDateInput = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value)

const buildLeadFilters = (query) => {
  const clauses = []
  const values = []

  const search = query.search?.toString().trim()
  const domain = query.domain?.toString().trim()
  const status = query.status?.toString().trim().toLowerCase()
  const startDate = query.startDate?.toString().trim()
  const endDate = query.endDate?.toString().trim()

  if (search) {
    values.push(`%${search}%`)
    const index = values.length
    clauses.push(`(full_name ILIKE $${index} OR email ILIKE $${index} OR source ILIKE $${index})`)
  }

  if (domain) {
    values.push(`%${domain}%`)
    clauses.push(`domain ILIKE $${values.length}`)
  }

  if (status && ['pending', 'validated', 'cancelled'].includes(status)) {
    values.push(status)
    clauses.push(`status = $${values.length}`)
  }

  if (startDate && isValidDateInput(startDate)) {
    values.push(startDate)
    clauses.push(`created_at >= $${values.length}::date`)
  }

  if (endDate && isValidDateInput(endDate)) {
    values.push(endDate)
    clauses.push(`created_at < ($${values.length}::date + INTERVAL '1 day')`)
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  }
}

const ensureLeadStatusSchema = async () => {
  if (leadStatusSchemaReady) {
    return
  }

  await pool.query(`
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending'
  `)

  await pool.query(`
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `)

  leadStatusSchemaReady = true
}

const normalizeStatus = (value) => {
  const normalized = String(value ?? '').trim().toLowerCase()

  if (['pending', 'validé', 'valide', 'validated', 'approved'].includes(normalized)) {
    return 'validated'
  }

  if (['en attente', 'pending', 'waiting'].includes(normalized)) {
    return 'pending'
  }

  if (['annulé', 'annule', 'canceled', 'cancelled', 'rejected'].includes(normalized)) {
    return 'cancelled'
  }

  return null
}

router.get('/admin/leads', requireAdminToken, async (req, res) => {
  const limit = Math.min(Number.parseInt(req.query.limit ?? '50', 10) || 50, 200)
  const offset = Math.max(Number.parseInt(req.query.offset ?? '0', 10) || 0, 0)
  const filters = buildLeadFilters(req.query)

  try {
    await ensureLeadStatusSchema()

    const [leadsResult, totalResult] = await Promise.all([
      pool.query(
        `
        SELECT id, full_name, email, domain, language_level, source, recommended_agent, status, status_updated_at, created_at
        FROM leads
        ${filters.whereSql}
        ORDER BY created_at DESC
        LIMIT $${filters.values.length + 1} OFFSET $${filters.values.length + 2}
        `,
        [...filters.values, limit, offset],
      ),
      pool.query(`SELECT COUNT(*)::int AS total FROM leads ${filters.whereSql}`, filters.values),
    ])

    const leads = leadsResult.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      domain: row.domain,
      languageLevel: row.language_level,
      source: row.source,
      recommendedAgent: row.recommended_agent,
      status: row.status,
      statusUpdatedAt: row.status_updated_at,
      createdAt: row.created_at,
    }))

    return res.json({
      leads,
      total: totalResult.rows[0]?.total ?? 0,
      hasMore: offset + leads.length < (totalResult.rows[0]?.total ?? 0),
    })
  } catch (error) {
    console.error('Failed to fetch admin leads:', error)
    return res.status(500).json({ error: 'Server error while loading leads' })
  }
})

router.get('/admin/leads/export.csv', requireAdminToken, async (req, res) => {
  const filters = buildLeadFilters(req.query)

  try {
    await ensureLeadStatusSchema()

    const result = await pool.query(
      `
      SELECT id, full_name, email, domain, language_level, source, recommended_agent, status, status_updated_at, created_at
      FROM leads
      ${filters.whereSql}
      ORDER BY created_at DESC
      `,
      filters.values,
    )

    const header = ['id', 'full_name', 'email', 'domain', 'language_level', 'source', 'recommended_agent', 'status', 'status_updated_at', 'created_at']
    const lines = [header.join(',')]

    for (const row of result.rows) {
      lines.push(
        [
          row.id,
          row.full_name,
          row.email,
          row.domain,
          row.language_level,
          row.source,
          row.recommended_agent,
          row.status,
          row.status_updated_at,
          row.created_at,
        ]
          .map(escapeCsvValue)
          .join(','),
      )
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"')
    return res.status(200).send(lines.join('\n'))
  } catch (error) {
    console.error('Failed to export leads:', error)
    return res.status(500).json({ error: 'Server error while exporting leads' })
  }
})

router.get('/admin/analytics-summary', requireAdminToken, async (_req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id BIGSERIAL PRIMARY KEY,
        event_type VARCHAR(60) NOT NULL,
        path VARCHAR(200) NOT NULL,
        source VARCHAR(100),
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        user_agent TEXT,
        ip_address VARCHAR(80),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const result = await pool.query(
      `
      SELECT event_type, COUNT(*)::int AS total
      FROM analytics_events
      GROUP BY event_type
      ORDER BY total DESC
      `,
    )

    return res.json({
      totals: result.rows.map((row) => ({
        eventType: row.event_type,
        total: row.total,
      })),
    })
  } catch (error) {
    console.error('Failed to load analytics summary:', error)
    return res.status(500).json({ error: 'Server error while loading analytics summary' })
  }
})

router.get('/admin/leads-summary', requireAdminToken, async (_req, res) => {
  try {
    await ensureLeadStatusSchema()

    const result = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'validated')::int AS validated,
        COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled
      FROM leads
      `,
    )

    const row = result.rows[0] || { total: 0, pending: 0, validated: 0, cancelled: 0 }

    return res.json({
      total: row.total,
      pending: row.pending,
      validated: row.validated,
      cancelled: row.cancelled,
    })
  } catch (error) {
    console.error('Failed to load leads summary:', error)
    return res.status(500).json({ error: 'Server error while loading leads summary' })
  }
})

router.patch('/admin/leads/:id/status', requireAdminToken, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  const nextStatus = normalizeStatus(req.body?.status)

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid lead id' })
  }

  if (!nextStatus) {
    return res.status(400).json({ error: 'Invalid lead status' })
  }

  try {
    await ensureLeadStatusSchema()

    const result = await pool.query(
      `
      UPDATE leads
      SET status = $1, status_updated_at = NOW()
      WHERE id = $2
      RETURNING id, status, status_updated_at
      `,
      [nextStatus, id],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    return res.json({
      message: 'Lead status updated',
      lead: {
        id: result.rows[0].id,
        status: result.rows[0].status,
        statusUpdatedAt: result.rows[0].status_updated_at,
      },
    })
  } catch (error) {
    console.error('Failed to update lead status:', error)
    return res.status(500).json({ error: 'Server error while updating lead status' })
  }
})

export default router
