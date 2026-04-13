import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { requireHttps } from './middleware/requireHttps.js'
import adminRouter from './routes/admin.js'
import analyticsRouter from './routes/analytics.js'
import commentsRouter from './routes/comments.js'
import leadsRouter from './routes/leads.js'

const app = express()
const allowedOrigins = env.FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)

app.use(helmet())
app.use(requireHttps)
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
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

const leadsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/leads', leadsLimiter)
app.use('/api', apiLimiter, leadsRouter, commentsRouter, analyticsRouter, adminRouter)

export default app
