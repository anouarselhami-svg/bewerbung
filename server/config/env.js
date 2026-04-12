import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:5173'),
  PGSSL: z.enum(['true', 'false']).default('false'),
  COMMENT_ADMIN_TOKEN: z.string().trim().min(8).optional(),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  const formatted = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n')
  throw new Error(`Invalid environment variables:\n${formatted}`)
}

export const env = parsed.data
