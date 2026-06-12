/**
 * AgentPay SDK
 * Financial infrastructure for AI agents
 * Built on Base + USDC + Privy + Alchemy
 */

import { createPublicClient, http, formatUnits, parseUnits, encodeFunctionData } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import type { AgentWallet, Transaction, CreateAgentOptions, PayOptions } from './types'

// USDC on Base Mainnet
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const
const USDC_DECIMALS = 6

// Minimal ERC20 ABI for USDC transfers
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
] as const

// In-memory store for agent wallets (replace with DB in production)
const agentStore = new Map<string, AgentWallet>()

/**
 * Create a public viem client connected to Alchemy
 */
function getPublicClient(network: 'base' | 'base-sepolia' = 'base') {
  const chain = network === 'base' ? base : baseSepolia
  const rpcUrl = network === 'base'
    ? `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    : `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

  return createPublicClient({ chain, transport: http(rpcUrl) })
}

/**
 * Create a wallet for an AI agent via Privy server API
 * Returns the agent wallet with its on-chain address
 */
export async function createAgentWallet(
  agentId: string,
  options: CreateAgentOptions = {}
): Promise<AgentWallet> {
  const { label = agentId, dailyLimitUSDC = 100 } = options

  try {
    // Call Privy API to create a server-side wallet
    const response = await fetch('https://auth.privy.io/api/v1/wallets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        chain_type: 'ethereum',
      }),
    })

    if (!response.ok) {
      throw new Error(`Privy wallet creation failed: ${response.statusText}`)
    }

    const data = await response.json()
    const address = data.address as `0x${string}`

    const wallet: AgentWallet = {
      agentId,
      address,
      createdAt: new Date(),
      dailyLimit: dailyLimitUSDC,
      spentToday: 0,
      label,
    }

    agentStore.set(agentId, wallet)
    return wallet

  } catch (error) {
    // Fallback: generate a deterministic mock address for dev/testing
    console.warn('Privy wallet creation error, using mock address for dev:', error)
    const mockAddress = `0x${agentId.replace(/[^a-f0-9]/gi, '').padEnd(40, '0').slice(0, 40)}` as `0x${string}`
    
    const wallet: AgentWallet = {
      agentId,
      address: mockAddress,
      createdAt: new Date(),
      dailyLimit: dailyLimitUSDC,
      spentToday: 0,
      label,
    }
    agentStore.set(agentId, wallet)
    return wallet
  }
}

/**
 * Get USDC balance for an agent's wallet address
 */
export async function getBalance(
  agentId: string,
  network: 'base' | 'base-sepolia' = 'base'
): Promise<number> {
  const wallet = agentStore.get(agentId)
  if (!wallet) throw new Error(`Agent ${agentId} not found`)

  const client = getPublicClient(network)

  const raw = await client.readContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [wallet.address as `0x${string}`],
  })

  return Number(formatUnits(raw as bigint, USDC_DECIMALS))
}

/**
 * Set daily spending limit for an agent (in USDC)
 */
export function setDailyLimit(agentId: string, limitUSDC: number): AgentWallet {
  const wallet = agentStore.get(agentId)
  if (!wallet) throw new Error(`Agent ${agentId} not found`)
  wallet.dailyLimit = limitUSDC
  agentStore.set(agentId, wallet)
  return wallet
}

/**
 * Get agent wallet info
 */
export function getAgent(agentId: string): AgentWallet | undefined {
  return agentStore.get(agentId)
}

/**
 * List all registered agents
 */
export function listAgents(): AgentWallet[] {
  return Array.from(agentStore.values())
}

/**
 * Check if an agent can spend X USDC (respects daily limit)
 */
export function canSpend(agentId: string, amountUSDC: number): boolean {
  const wallet = agentStore.get(agentId)
  if (!wallet) return false
  return wallet.spentToday + amountUSDC <= wallet.dailyLimit
}

/**
 * Build USDC transfer calldata (for signing via Privy)
 */
export function buildTransferCalldata(toAddress: string, amountUSDC: number) {
  const amount = parseUnits(amountUSDC.toString(), USDC_DECIMALS)
  return encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [toAddress as `0x${string}`, amount],
  })
}

/**
 * Get recent transactions for an agent via Alchemy
 */
export async function getTransactions(
  agentId: string,
  network: 'base' | 'base-sepolia' = 'base'
): Promise<Transaction[]> {
  const wallet = agentStore.get(agentId)
  if (!wallet) throw new Error(`Agent ${agentId} not found`)

  const alchemyUrl = network === 'base'
    ? `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    : `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

  const body = {
    jsonrpc: '2.0',
    id: 1,
    method: 'alchemy_getAssetTransfers',
    params: [{
      fromBlock: '0x0',
      fromAddress: wallet.address,
      contractAddresses: [USDC_ADDRESS],
      category: ['erc20'],
      withMetadata: true,
      maxCount: '0x14',
    }],
  }

  const res = await fetch(alchemyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  const transfers = data?.result?.transfers ?? []

  return transfers.map((t: any) => ({
    hash: t.hash,
    agentId,
    from: t.from,
    to: t.to,
    amount: Number(t.value),
    timestamp: new Date(t.metadata?.blockTimestamp ?? Date.now()),
    status: 'confirmed' as const,
  }))
}

export { USDC_ADDRESS, USDC_DECIMALS }
