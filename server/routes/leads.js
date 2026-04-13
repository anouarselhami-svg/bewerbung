import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'

const router = Router()
let leadStatusSchemaReady = false

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

const LeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  domain: z.string().trim().min(2).max(120),
  languageLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  source: z.string().trim().max(80).default('site-web'),
  recommendedAgent: z.string().trim().max(120).optional(),
  website: z.string().trim().max(255).optional(),
})

router.post('/leads', async (req, res) => {
  const parsed = LeadSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Donnees invalides',
      details: parsed.error.flatten(),
    })
  }

  const lead = parsed.data

  if (lead.website && lead.website.trim().length > 0) {
    // Honeypot field: bots often fill hidden fields.
    return res.status(400).json({ error: 'Soumission bloquee par la protection anti-spam' })
  }

  try {
    await ensureLeadStatusSchema()

    const existingLead = await pool.query(
      `
      SELECT id
      FROM leads
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
      `,
      [lead.email],
    )

    if (existingLead.rowCount > 0) {
      return res.status(409).json({ error: 'Cet email a deja postule' })
    }

    const query = `
      INSERT INTO leads (full_name, email, domain, language_level, source, recommended_agent, status, status_updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
      RETURNING id, created_at
    `

    const values = [
      lead.fullName,
      lead.email,
      lead.domain,
      lead.languageLevel,
      lead.source,
      lead.recommendedAgent ?? null,
    ]

    const result = await pool.query(query, values)

    return res.status(201).json({
      message: 'Candidature enregistree',
      leadId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    })
  } catch (error) {
    console.error('Failed to save lead:', error)
    return res.status(500).json({
      error: 'Erreur serveur lors de l\'enregistrement',
    })
  }
})

export default router
