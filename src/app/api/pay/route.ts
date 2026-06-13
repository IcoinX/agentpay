import { NextResponse } from 'next/server'
import { redis, agentKey, txsKey } from '@/lib/redis'

function generateTxHash(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const body = await request.json()
  const { agentId, amount, to, toLabel = 'Unknown' } = body

  if (!agentId || !amount || !to) {
    return NextResponse.json({ error: 'agentId, amount and to are required' }, { status: 400 })
  }

  const raw = await redis.get(agentKey(apiKey, agentId))
  if (!raw) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  const agent = JSON.parse(raw as string)

  // Reset daily spend if new day
  const today = new Date().toISOString().split('T')[0]
  if (agent.lastReset !== today) {
    agent.spentToday = 0
    agent.lastReset = today
  }

  // Check daily limit
  if (agent.spentToday + amount > agent.dailyLimit) {
    return NextResponse.json(
      { error: 'Daily limit exceeded', remaining: agent.dailyLimit - agent.spentToday },
      { status: 402 }
    )
  }

  // Record transaction
  const tx = {
    hash: generateTxHash(),
    agentId,
    from: agent.address,
    to,
    toLabel,
    amount,
    timestamp: new Date().toISOString(),
    status: 'confirmed',
  }

  agent.spentToday += amount
  await redis.set(agentKey(apiKey, agentId), JSON.stringify(agent))

  // Prepend tx, keep last 100
  await redis.lpush(txsKey(apiKey, agentId), JSON.stringify(tx))
  await redis.ltrim(txsKey(apiKey, agentId), 0, 99)

  return NextResponse.json(tx)
}
