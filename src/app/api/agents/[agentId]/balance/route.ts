import { NextResponse } from 'next/server'
import { createPublicClient, http, formatUnits } from 'viem'
import { base } from 'viem/chains'

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const USDC_DECIMALS = 6
const ERC20_ABI = [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }]

// Re-use the same in-memory store (module-level singleton on warm invocations)
// The store is populated by POST /api/agents — import via shared module in production
// For MVP we duplicate the map reference pattern and read from the global
declare const globalThis: { agentStore?: Map<string, { agentId: string; address: string; label: string; dailyLimitUSDS: number; spentToday: number; txCount: number }> }

function getStore() {
  if (!globalThis.agentStore) {
    globalThis.agentStore = new Map()
  }
  return globalThis.agentStore
}

async function getUSDCBalance(address: string): Promise<number> {
  try {
    const client = createPublicClient({
      chain: base,
      transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    })
    const raw = await client.readContract({
      address: USDC_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })
    return parseFloat(formatUnits(raw as bigint, USDC_DECIMALS))
  } catch {
    return 0
  }
}

export async function GET(
  req: Request,
  { params }: { params: { agentId: string } }
) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const store = getStore()
  const key = `${apiKey}:${params.agentId}`
  const agent = store.get(key)

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  const usdc = await getUSDCBalance(agent.address)

  return NextResponse.json({
    usdc,
    spentToday: agent.spentToday,
    limit: agent.dailyLimitUSDS,
    address: agent.address,
  })
}
