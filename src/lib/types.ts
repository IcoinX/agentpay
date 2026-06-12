export interface AgentWallet {
  agentId: string
  address: string
  createdAt: Date
  dailyLimit: number      // in USDC (6 decimals)
  spentToday: number
  label?: string
}

export interface Transaction {
  hash: string
  agentId: string
  from: string
  to: string
  amount: number          // USDC amount (human-readable)
  timestamp: Date
  status: 'pending' | 'confirmed' | 'failed'
}

export interface AgentPayConfig {
  privyAppId: string
  alchemyApiKey: string
  network: 'base' | 'base-sepolia'
}

export interface CreateAgentOptions {
  label?: string
  dailyLimitUSDC?: number
}

export interface PayOptions {
  fromAgentId: string
  toAddress: string
  amountUSDC: number
  memo?: string
}
