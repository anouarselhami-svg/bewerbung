import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'

const router = Router()
let analyticsTableReady = false

const ensureAnalyticsSchema = async () => {
  if (analyticsTableReady) {
    return
  }

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

  await pool.query('CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events (event_type)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events (created_at DESC)')

  analyticsTableReady = true
}

const AnalyticsEventSchema = z.object({
  eventType: z.enum(['page_view', 'click_whatsapp', 'click_email', 'lead_submit_attempt', 'lead_submit_success']),
  path: z.string().trim().min(1).max(200),
  source: z.string().trim().max(100).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
})

router.post('/analytics/events', async (req, res) => {
  const parsed = AnalyticsEventSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid analytics payload',
      details: parsed.error.flatten(),
    })
  }

  const payload = parsed.data
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || null

  try {
    await ensureAnalyticsSchema()

    await pool.query(
      `
      INSERT INTO analytics_events (event_type, path, source, metadata, user_agent, ip_address)
      VALUES ($1, $2, $3, $4::jsonb, $5, $6)
      `,
      [
        payload.eventType,
        payload.path,
        payload.source ?? null,
        JSON.stringify(payload.metadata ?? {}),
        req.get('user-agent') ?? null,
        ip,
      ],
    )

    return res.status(201).json({ message: 'Event tracked' })
  } catch (error) {
    console.error('Failed to store analytics event:', error)
    return res.status(500).json({ error: 'Server error while tracking event' })
  }
})

export default router
