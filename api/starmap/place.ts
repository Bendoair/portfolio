import type { VercelRequest, VercelResponse } from '@vercel/node'
import { placeStar } from '../../lib/starmap/server/store'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const x = body?.x
    const y = body?.y
    const result = await placeStar(x, y)

    if ('error' in result) {
      const status = result.retryAt ? 403 : 400
      return res.status(status).json(result)
    }

    return res.status(201).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}
