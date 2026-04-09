import { Pool } from 'pg'
import { env } from '../config/env.js'

const useSsl = env.PGSSL === 'true'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
})
