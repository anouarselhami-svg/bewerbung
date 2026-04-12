import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'

const router = Router()

const LeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  domain: z.string().trim().min(2).max(120),
  languageLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  source: z.string().trim().max(80).default('site-web'),
  recommendedAgent: z.string().trim().max(120).optional(),
})

router.post('/leads', async (req, res) => {
  const parsed = LeadSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid payload',
      details: parsed.error.flatten(),
    })
  }

  const lead = parsed.data

  try {
    const query = `
      INSERT INTO leads (full_name, email, domain, language_level, source, recommended_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
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
      message: 'Lead created',
      leadId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    })
  } catch (error) {
    console.error('Failed to save lead:', error)
    return res.status(500).json({
      error: 'Server error while storing lead',
    })
  }
})

export default router
