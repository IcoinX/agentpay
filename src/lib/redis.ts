import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

// Key helpers
export const agentKey = (apiKey: string, agentId: string) => `agent:${apiKey}:${agentId}`
export const agentsSetKey = (apiKey: string) => `agents:${apiKey}`
export const txsKey = (apiKey: string, agentId: string) => `txs:${apiKey}:${agentId}`
