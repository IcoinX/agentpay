import { NextResponse } from 'next/server'
import { createPublicClient, http, formatUnits } from 'viem'
import { base } from 'viem/chains'

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const USDC_DECIMALS = 6
const ERC20_ABI = [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }] as const

// Demo agent wallets — real Base addresses, real on-chain data
const DEMO_AGENTS = [
  { agentId: 'agent-research', address: '0x4200000000000000000000000000000000000006', label: 'Research Agent', dailyLimit: 50 },
  { agentId: 'agent-code', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', label: 'Code Agent', dailyLimit: 100 },
  { agentId: 'agent-data', address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', label: 'Data Pipeline Agent', dailyLimit: 200 },
]

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

async function getRecentTxCount(address: string): Promise<number> {
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

export async function GET() {
  const agents = await Promise.all(
    DEMO_AGENTS.map(async (a) => {
      const [balance, txCount] = await Promise.all([getUSDCBalance(a.address), getRecentTxCount(a.address)])
      return { ...a, balance, spentToday: 0, txCount }
    })
  )
  return NextResponse.json({ agents })
}
