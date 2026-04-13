import { Router } from 'express'
import { pool } from '../db/pool.js'
import { env } from '../config/env.js'

const router = Router()

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

router.get('/admin/leads', requireAdminToken, async (req, res) => {
  const limit = Math.min(Number.parseInt(req.query.limit ?? '50', 10) || 50, 200)
  const offset = Math.max(Number.parseInt(req.query.offset ?? '0', 10) || 0, 0)
  const filters = buildLeadFilters(req.query)

  try {
    const [leadsResult, totalResult] = await Promise.all([
      pool.query(
        `
        SELECT id, full_name, email, domain, language_level, source, recommended_agent, created_at
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
    const result = await pool.query(
      `
      SELECT id, full_name, email, domain, language_level, source, recommended_agent, created_at
      FROM leads
      ${filters.whereSql}
      ORDER BY created_at DESC
      `,
      filters.values,
    )

    const header = ['id', 'full_name', 'email', 'domain', 'language_level', 'source', 'recommended_agent', 'created_at']
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

export default router
