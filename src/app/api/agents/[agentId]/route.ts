import { NextResponse } from 'next/server'

interface Agent {
  agentId: string
  address: string
  label: string
  dailyLimitUSDS: number
  spentToday: number
  txCount: number
}

declare const globalThis: {
  agentStore?: Map<string, Agent>
  txStore?: Map<string, unknown[]>
}

function getAgentStore() {
  if (!globalThis.agentStore) globalThis.agentStore = new Map()
  return globalThis.agentStore
}

function getTxStore() {
  if (!globalThis.txStore) globalThis.txStore = new Map()
  return globalThis.txStore
}

export async function DELETE(
  req: Request,
  { params }: { params: { agentId: string } }
) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const agentStore = getAgentStore()
  const key = `${apiKey}:${params.agentId}`

  if (!agentStore.has(key)) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  agentStore.delete(key)
  getTxStore().delete(key)

  return NextResponse.json({ success: true })
}
