import type { VercelRequest, VercelResponse } from '@vercel/node'
import { brightenStar } from '../../lib/starmap/server/store.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const id = body?.id
    const result = await brightenStar(id)

    if ('error' in result) {
      const status = result.retryAt ? 403 : result.error === 'Star not found' ? 404 : 400
      return res.status(status).json(result)
    }

    return res.status(200).json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}
