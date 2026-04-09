import { env } from '../config/env.js'

export function requireHttps(req, res, next) {
  if (env.NODE_ENV !== 'production') {
    return next()
  }

  const protoHeader = req.get('x-forwarded-proto')
  const isHttps = req.secure || protoHeader === 'https'

  if (!isHttps) {
    return res.status(426).json({
      error: 'HTTPS is required in production.',
    })
  }

  return next()
}
