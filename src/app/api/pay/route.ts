import { NextResponse } from 'next/server'

// Shared in-memory store (same singleton as agents/route.ts on warm invocations)
interface Agent {
  agentId: string
  address: string
  label: string
  dailyLimitUSDS: number
  spentToday: number
  txCount: number
}

interface Transaction {
  hash: string
  agentId: string
  from: string
  to: string
  toLabel: string
  amount: number
  timestamp: string
  status: 'confirmed' | 'pending' | 'failed'
}

declare const globalThis: {
  agentStore?: Map<string, Agent>
  txStore?: Map<string, Transaction[]>
}

function getAgentStore() {
  if (!globalThis.agentStore) globalThis.agentStore = new Map()
  return globalThis.agentStore
}

function getTxStore() {
  if (!globalThis.txStore) globalThis.txStore = new Map()
  return globalThis.txStore
}

function generateTxHash(): string {
  const bytes = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  )
  return `0x${bytes.join('')}`
}

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  let body: {
    fromAgentId?: string
    toAddress?: string
    amountUSDS?: number
    memo?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { fromAgentId, toAddress, amountUSDS, memo } = body

  if (!fromAgentId || !toAddress || amountUSDS === undefined) {
    return NextResponse.json(
      { error: 'fromAgentId, toAddress, and amountUSDS are required' },
      { status: 400 }
    )
  }

  if (amountUSDS <= 0) {
    return NextResponse.json({ error: 'amountUSDS must be > 0' }, { status: 400 })
  }

  const agentStore = getAgentStore()
  const key = `${apiKey}:${fromAgentId}`
  const agent = agentStore.get(key)

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Enforce daily limit
  if (agent.spentToday + amountUSDS > agent.dailyLimitUSDS) {
    const remaining = agent.dailyLimitUSDS - agent.spentToday
    return NextResponse.json(
      {
        error: `Daily limit exceeded. Remaining: ${remaining.toFixed(2)} USDC`,
        remaining,
      },
      { status: 402 }
    )
  }

  // Update agent spend tracking
  agent.spentToday += amountUSDS
  agent.txCount += 1
  agentStore.set(key, agent)

  // Record transaction
  const tx: Transaction = {
    hash: generateTxHash(),
    agentId: fromAgentId,
    from: agent.address,
    to: toAddress,
    toLabel: memo ?? toAddress.slice(0, 8) + '...',
    amount: amountUSDS,
    timestamp: new Date().toISOString(),
    status: 'confirmed',
  }

  const txStore = getTxStore()
  const txKey = `${apiKey}:${fromAgentId}`
  const existing = txStore.get(txKey) ?? []
  txStore.set(txKey, [tx, ...existing].slice(0, 100)) // keep last 100

  return NextResponse.json(tx, { status: 201 })
}
