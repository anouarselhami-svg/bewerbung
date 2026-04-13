import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const trimIfString = (value) => (typeof value === 'string' ? value.trim() : value)

const EnvSchema = z.object({
  NODE_ENV: z.preprocess(trimIfString, z.enum(['development', 'test', 'production'])).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.preprocess(trimIfString, z.string().min(1, 'DATABASE_URL is required')),
  FRONTEND_ORIGIN: z.preprocess(trimIfString, z.string().min(1)).default('http://localhost:5173'),
  PGSSL: z.preprocess(trimIfString, z.enum(['true', 'false'])).default('false'),
  COMMENT_ADMIN_TOKEN: z.preprocess(trimIfString, z.string().trim().min(8)).optional(),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  const formatted = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n')
  throw new Error(`Invalid environment variables:\n${formatted}`)
}

export const env = parsed.data
