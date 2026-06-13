import { NextResponse } from 'next/server'
import { createPublicClient, http, formatUnits } from 'viem'
import { base } from 'viem/chains'

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const USDC_DECIMALS = 6
const ERC20_ABI = [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }]

// ── In-memory agent store (persists across warm invocations) ──────────────────
// Key: apiKey:agentId → Agent
const agentStore = new Map<string, Agent>()

// Demo agents always available (no API key required for GET /api/agents)
const DEMO_AGENTS = [
  { agentId: 'agent-research', address: '0x4200000000000000000000000000000000000006', label: 'Research Agent', dailyLimit: 50 },
  { agentId: 'agent-code', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', label: 'Code Agent', dailyLimit: 100 },
  { agentId: 'agent-data', address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', label: 'Data Pipeline Agent', dailyLimit: 200 },
]

interface Agent {
  agentId: string
  address: string
  label: string
  dailyLimit: number
  spentToday: number
  balance: number
  txCount: number
  createdAt: string
}

// Generate a deterministic-ish EVM address from agentId + apiKey
function generateAddress(agentId: string, apiKey: string): string {
  let hash = 0
  const str = agentId + apiKey + Date.now()
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return `0x${hex.repeat(5).slice(0, 40)}`
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
    return Number(formatUnits(raw as bigint, USDC_DECIMALS))
  } catch {
    return 0
  }
}

async function getTxCount(address: string): Promise<number> {
  try {
    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    const res = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [{ fromBlock: '0x0', fromAddress: address, contractAddresses: [USDC_ADDRESS], category: ['erc20'], maxCount: '0x14' }],
      }),
    })
    const data = await res.json()
    return data?.result?.transfers?.length ?? 0
  } catch {
    return 0
  }
}

// ── GET /api/agents ───────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key')

  // If API key provided, return their agents + demo agents
  let agents = DEMO_AGENTS
  if (apiKey) {
    const userAgents = [...agentStore.entries()]
      .filter(([k]) => k.startsWith(apiKey + ':'))
      .map(([, v]) => v)
    if (userAgents.length > 0) agents = userAgents
  }

  const enriched = await Promise.all(
    agents.map(async (a) => ({
      agentId: a.agentId,
      address: a.address,
      label: a.label,
      dailyLimit: a.dailyLimit,
      spentToday: 0,
      balance: await getUSDCBalance(a.address),
      txCount: await getTxCount(a.address),
    }))
  )

  return NextResponse.json({ agents: enriched })
}

// ── POST /api/agents ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  let body: { agentId?: string; label?: string; dailyLimitUSDS?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { agentId, label, dailyLimitUSDS = 100 } = body
  if (!agentId || !label) {
    return NextResponse.json({ error: 'agentId and label are required' }, { status: 400 })
  }

  const storeKey = `${apiKey}:${agentId}`
  if (agentStore.has(storeKey)) {
    return NextResponse.json({ error: `Agent ${agentId} already exists` }, { status: 409 })
  }

  const address = generateAddress(agentId, apiKey)
  const agent: Agent = {
    agentId,
    address,
    label,
    dailyLimit: dailyLimitUSDS,
    spentToday: 0,
    balance: 0,
    txCount: 0,
    createdAt: new Date().toISOString(),
  }

  agentStore.set(storeKey, agent)

  return NextResponse.json(agent, { status: 201 })
}
