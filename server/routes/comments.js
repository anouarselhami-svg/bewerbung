import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { env } from '../config/env.js'

const router = Router()

const COMMENT_BLOCKED_WORDS = ['insulte', 'arnaque', 'escroc', 'haine']

const CommentSchema = z.object({
  name: z.string().trim().min(1).max(80).default('Anonyme'),
  message: z.string().trim().min(2).max(800),
  rating: z.coerce.number().int().min(1).max(5),
})

const containsBlockedWord = (text) => {
  const normalized = text.toLowerCase()
  return COMMENT_BLOCKED_WORDS.some((word) => normalized.includes(word))
}

router.get('/comments', async (req, res) => {
  const limit = Math.min(Number.parseInt(req.query.limit ?? '20', 10) || 20, 50)
  const offset = Math.max(Number.parseInt(req.query.offset ?? '0', 10) || 0, 0)

  try {
    const result = await pool.query(
      `
      SELECT id, author_name, message, rating, created_at
      FROM comments
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2
      `,
      [limit + 1, offset],
    )

    const rows = result.rows.slice(0, limit)
    const hasMore = result.rows.length > limit

    return res.json({
      comments: rows.map((row) => ({
        id: row.id,
        name: row.author_name,
        message: row.message,
        rating: row.rating,
        createdAt: row.created_at,
      })),
      hasMore,
    })
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return res.status(500).json({ error: 'Server error while loading comments' })
  }
})

router.post('/comments', async (req, res) => {
  const parsed = CommentSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid payload',
      details: parsed.error.flatten(),
    })
  }

  const comment = parsed.data

  if (containsBlockedWord(comment.message)) {
    return res.status(400).json({
      error: 'Comment rejected by moderation filter',
    })
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO comments (author_name, message, rating)
      VALUES ($1, $2, $3)
      RETURNING id, author_name, message, rating, created_at
      `,
      [comment.name, comment.message, comment.rating],
    )

    const created = result.rows[0]

    return res.status(201).json({
      message: 'Comment created',
      comment: {
        id: created.id,
        name: created.author_name,
        message: created.message,
        rating: created.rating,
        createdAt: created.created_at,
      },
    })
  } catch (error) {
    console.error('Failed to save comment:', error)
    return res.status(500).json({ error: 'Server error while saving comment' })
  }
})

router.delete('/comments/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  const providedToken = req.get('x-admin-token')?.trim()

  if (!env.COMMENT_ADMIN_TOKEN) {
    return res.status(503).json({ error: 'Comment deletion is disabled on this server' })
  }

  if (!providedToken || providedToken !== env.COMMENT_ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized deletion request' })
  }

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid comment id' })
  }

  try {
    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING id', [id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    return res.json({ message: 'Comment deleted' })
  } catch (error) {
    console.error('Failed to delete comment:', error)
    return res.status(500).json({ error: 'Server error while deleting comment' })
  }
})

export default router
