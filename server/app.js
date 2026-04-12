import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { requireHttps } from './middleware/requireHttps.js'
import commentsRouter from './routes/comments.js'
import leadsRouter from './routes/leads.js'

const app = express()

app.use(helmet())
app.use(requireHttps)
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: false,
  }),
)
app.use(express.json({ limit: '200kb' }))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api', apiLimiter, leadsRouter, commentsRouter)

export default app
