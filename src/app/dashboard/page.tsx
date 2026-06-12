'use client'

import { useState, useEffect } from 'react'

interface Agent {
  agentId: string
  address: string
  label: string
  dailyLimit: number
  spentToday: number
  balance: number
  txCount: number
}

const MOCK_AGENTS: Agent[] = [
  { agentId: 'agent-001', address: '0x1a2b3c4d5e6f...', label: 'Research Agent', dailyLimit: 50, spentToday: 12.4, balance: 245.6, txCount: 8 },
  { agentId: 'agent-002', address: '0x7a8b9c0d1e2f...', label: 'Code Agent', dailyLimit: 100, spentToday: 67.2, balance: 89.3, txCount: 23 },
  { agentId: 'agent-003', address: '0x3c4d5e6f7a8b...', label: 'Data Pipeline Agent', dailyLimit: 200, spentToday: 0, balance: 500.0, txCount: 0 },
]

const MOCK_TXS = [
  { hash: '0xabc...', agent: 'Research Agent', to: 'OpenAI API', amount: 4.2, time: '2 min ago', status: 'confirmed' },
  { hash: '0xdef...', agent: 'Code Agent', to: 'Anthropic API', amount: 8.1, time: '5 min ago', status: 'confirmed' },
  { hash: '0x123...', agent: 'Code Agent', to: 'GitHub Copilot', amount: 3.5, time: '12 min ago', status: 'confirmed' },
  { hash: '0x456...', agent: 'Research Agent', to: 'Perplexity API', amount: 2.0, time: '1 hr ago', status: 'confirmed' },
  { hash: '0x789...', agent: 'Code Agent', to: 'Vercel', amount: 12.4, time: '3 hr ago', status: 'confirmed' },
]

function StatusBadge({ pct }: { pct: number }) {
  const color = pct > 80 ? 'bg-red-500/20 text-red-400' : pct > 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {pct.toFixed(0)}% used
    </span>
  )
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS)
  const [showCreate, setShowCreate] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newLimit, setNewLimit] = useState('100')

  const totalBalance = agents.reduce((s, a) => s + a.balance, 0)
  const totalSpent = agents.reduce((s, a) => s + a.spentToday, 0)
  const totalTx = agents.reduce((s, a) => s + a.txCount, 0)

  function createAgent() {
    if (!newLabel) return
    const newAgent: Agent = {
      agentId: `agent-${Date.now()}`,
      address: `0x${Math.random().toString(16).slice(2, 14)}...`,
      label: newLabel,
      dailyLimit: Number(newLimit),
      spentToday: 0,
      balance: 0,
      txCount: 0,
    }
    setAgents(prev => [...prev, newAgent])
    setNewLabel('')
    setNewLimit('100')
    setShowCreate(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">A</div>
          <span className="font-semibold text-lg">AgentPay</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/40">Base Mainnet</span>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + New Agent
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Agents', value: agents.length, sub: 'on Base' },
            { label: 'Total Balance', value: `$${totalBalance.toFixed(2)}`, sub: 'USDC' },
            { label: 'Spent Today', value: `$${totalSpent.toFixed(2)}`, sub: 'across all agents' },
            { label: 'Transactions', value: totalTx, sub: 'last 24h' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/40 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-white/30 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Agent Fleet */}
          <div className="col-span-2">
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Agent Fleet</h2>
            <div className="space-y-3">
              {agents.map(agent => {
                const pct = agent.dailyLimit > 0 ? (agent.spentToday / agent.dailyLimit) * 100 : 0
                return (
                  <div key={agent.agentId} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-indigo-500/40 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-indigo-500/30 flex items-center justify-center text-xs text-indigo-400">
                            {agent.label[0]}
                          </div>
                          <span className="font-medium">{agent.label}</span>
                          <StatusBadge pct={pct} />
                        </div>
                        <p className="text-white/30 text-xs mt-1 font-mono">{agent.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${agent.balance.toFixed(2)}</p>
                        <p className="text-white/40 text-xs">USDC balance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span>${agent.spentToday.toFixed(2)} / ${agent.dailyLimit} today</span>
                      <span>·</span>
                      <span>{agent.txCount} txs</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-400' : pct > 50 ? 'bg-yellow-400' : 'bg-indigo-400'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Recent Transactions</h2>
            <div className="space-y-2">
              {MOCK_TXS.map(tx => (
                <div key={tx.hash} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{tx.to}</p>
                      <p className="text-xs text-white/40">{tx.agent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-400">-${tx.amount}</p>
                      <p className="text-xs text-white/30">{tx.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Create Agent Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#13131f] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Agent Wallet</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Agent Name</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  placeholder="e.g. Data Analyst Agent"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Daily Limit (USDC)</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={newLimit}
                  onChange={e => setNewLimit(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createAgent}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Create Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
