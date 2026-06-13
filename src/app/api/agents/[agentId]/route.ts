import { NextResponse } from 'next/server'
import { redis, agentKey, agentsSetKey, txsKey } from '@/lib/redis'

export async function DELETE(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const { agentId } = params

  const exists = await redis.get(agentKey(apiKey, agentId))
  if (!exists) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  await redis.del(agentKey(apiKey, agentId))
  await redis.srem(agentsSetKey(apiKey), agentId)
  await redis.del(txsKey(apiKey, agentId))

  return NextResponse.json({ success: true })
}
