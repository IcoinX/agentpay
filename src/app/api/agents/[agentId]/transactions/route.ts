import { NextResponse } from 'next/server'

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
  txStore?: Map<string, Transaction[]>
}

function getTxStore() {
  if (!globalThis.txStore) globalThis.txStore = new Map()
  return globalThis.txStore
}

export async function GET(
  req: Request,
  { params }: { params: { agentId: string } }
) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const txStore = getTxStore()
  const key = `${apiKey}:${params.agentId}`
  const transactions = txStore.get(key) ?? []

  return NextResponse.json({ transactions })
}
