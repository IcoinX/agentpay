import { NextResponse } from 'next/server'

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

const DEMO_AGENTS: Record<string, string> = {
  'agent-research': '0x4200000000000000000000000000000000000006',
  'agent-code': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'agent-data': '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
}

export async function GET(
  _req: Request,
  { params }: { params: { agentId: string } }
) {
  const address = DEMO_AGENTS[params.agentId]
  if (!address) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  try {
    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    const res = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromBlock: '0x0',
          fromAddress: address,
          contractAddresses: [USDC_ADDRESS],
          category: ['erc20'],
          withMetadata: true,
          maxCount: '0x14',
        }],
      }),
    })
    const data = await res.json()
    const transfers = data?.result?.transfers ?? []
    const txs = transfers.map((t: any) => ({
      hash: t.hash,
      agentId: params.agentId,
      from: t.from,
      to: t.to,
      toLabel: t.to?.slice(0, 6) + '...' + t.to?.slice(-4),
      amount: Number(t.value ?? 0),
      timestamp: t.metadata?.blockTimestamp ?? new Date().toISOString(),
      status: 'confirmed',
    }))
    return NextResponse.json({ transactions: txs })
  } catch (e) {
    return NextResponse.json({ transactions: [] })
  }
      }
