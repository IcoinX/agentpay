import { NextResponse } from 'next/server'
import { redis, agentKey, agentsSetKey } from '@/lib/redis'

function generateAddress(agentId: string): string {
  let hash = 0
  for (let i = 0; i < agentId.length; i++) {
    hash = ((hash << 5) - hash) + agentId.charCodeAt(i)
    hash |= 0
  }
  return '0x' + Math.abs(hash).toString(16).padStart(40, '0')
}

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const body = await request.json()
  const { agentId, name, dailyLimit = 100 } = body

  if (!agentId || !name) {
    return NextResponse.json({ error: 'agentId and name are required' }, { status: 400 })
  }

  const agent = {
    id: agentId,
    name,
    address: generateAddress(agentId),
    dailyLimit,
    spentToday: 0,
    lastReset: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  }

  // Upstash auto-serializes objects — no JSON.stringify needed
  await redis.set(agentKey(apiKey, agentId), agent)
  await redis.sadd(agentsSetKey(apiKey), agentId)

  return NextResponse.json(agent, { status: 201 })
}

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const agentIds = await redis.smembers(agentsSetKey(apiKey))

  if (!agentIds || agentIds.length === 0) {
    return NextResponse.json({ agents: [] })
  }

  // Upstash auto-deserializes — no JSON.parse needed
  const agents = await Promise.all(
    agentIds.map((id: string) => redis.get(agentKey(apiKey, id)))
  )

  return NextResponse.json({ agents: agents.filter(Boolean) })
}
