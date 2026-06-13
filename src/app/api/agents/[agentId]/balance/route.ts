import { NextResponse } from 'next/server'
import { redis, agentKey } from '@/lib/redis'

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const USDC_DECIMALS = 6
const ERC20_ABI = [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }]

async function getUSDCBalance(address: string): Promise<number> {
  try {
    const { createPublicClient, http, formatUnits } = await import('viem')
    const { base } = await import('viem/chains')
    const client = createPublicClient({ chain: base, transport: http() })
    const balance = await client.readContract({
      address: USDC_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })
    return parseFloat(formatUnits(balance as bigint, USDC_DECIMALS))
  } catch {
    return 0
  }
}

export async function GET(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const { agentId } = params
  // Upstash auto-deserializes — agent is already an object, no JSON.parse needed
  const agent = await redis.get(agentKey(apiKey, agentId)) as any
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Reset spentToday if it's a new day
  const today = new Date().toISOString().split('T')[0]
  if (agent.lastReset !== today) {
    agent.spentToday = 0
    agent.lastReset = today
    // Store object directly — Upstash auto-serializes
    await redis.set(agentKey(apiKey, agentId), agent)
  }

  const usdc = await getUSDCBalance(agent.address)

  return NextResponse.json({
    usdc,
    spentToday: agent.spentToday,
    limit: agent.dailyLimit,
    address: agent.address,
  })
}
