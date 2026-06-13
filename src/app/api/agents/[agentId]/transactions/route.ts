import { NextResponse } from 'next/server'
import { redis, txsKey } from '@/lib/redis'

export async function GET(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const { agentId } = params
  const raw = await redis.lrange(txsKey(apiKey, agentId), 0, 99)

  const transactions = raw.map((item: string) => JSON.parse(item))

  return NextResponse.json({ transactions })
}
