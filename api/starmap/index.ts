import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSnapshot } from '../../lib/starmap/server/store'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const snapshot = await getSnapshot()
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(snapshot)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ error: message })
  }
}
