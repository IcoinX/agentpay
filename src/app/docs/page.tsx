'use client'

import { useState } from 'react'
import Link from 'next/link'

const SECTIONS = [
  { id: 'installation', label: 'Installation' },
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'create-agent', label: 'createAgent()' },
  { id: 'pay', label: 'pay()' },
  { id: 'get-balance', label: 'getBalance()' },
  { id: 'set-limit', label: 'setDailyLimit()' },
  { id: 'list-agents', label: 'listAgents()' },
  { id: 'transactions', label: 'getTransactions()' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'errors', label: 'Error Handling' },
]

function CodeBlock({ code, lang = 'typescript' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="relative group my-4">
      <div className="bg-[#0d0d1a] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
          <span className="text-xs text-white/40 font-mono">{lang}</span>
          <button
            onClick={copy}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono text-white/80 overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-white/10">{title}</h2>
      {children}
    </section>
  )
}

function Param({ name, type, required, desc }: { name: string; type: string; required?: boolean; desc: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-white/5">
      <div className="w-48 shrink-0">
        <code className="text-sm text-indigo-400">{name}</code>
        {required && <span className="ml-2 text-xs text-red-400/70">required</span>}
      </div>
      <div className="w-32 shrink-0">
        <code className="text-xs text-white/40">{type}</code>
      </div>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  )
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('installation')

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto sticky top-0 bg-[#0a0a0f]/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold">A</div>
            <span className="font-semibold text-lg">AgentPay</span>
          </Link>
          <span className="text-white/20 mx-2">/</span>
          <span className="text-white/60 text-sm">Docs</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">Dashboard</Link>
          <a
            href="https://github.com/IcoinX/agentpay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-4 hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4 px-3">SDK Reference</p>
          <nav className="space-y-0.5">
            {SECTIONS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeSection === s.id
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 px-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Resources</p>
            <div className="space-y-0.5">
              <a href="https://github.com/IcoinX/agentpay" target="_blank" className="block text-sm text-white/50 hover:text-white py-1.5 transition-colors">
                GitHub ↗
              </a>
              <a href="https://base.org" target="_blank" className="block text-sm text-white/50 hover:text-white py-1.5 transition-colors">
                Base Network ↗
              </a>
              <a href="https://pulseprotocol.co" target="_blank" className="block text-sm text-white/50 hover:text-white py-1.5 transition-colors">
                PULSE Protocol ↗
              </a>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-8 py-10 max-w-3xl">
          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full mb-4">
              SDK v0.1 · Base Mainnet
            </div>
            <h1 className="text-4xl font-bold mb-4">AgentPay SDK</h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Banking infrastructure for AI agent fleets. Give every agent its own on-chain wallet, budget, and spending rules — in a single API call.
            </p>
          </div>

          {/* Installation */}
          <Section id="installation" title="Installation">
            <p className="text-white/60 mb-4">Install the AgentPay SDK via npm, yarn, or pnpm.</p>
            <CodeBlock lang="bash" code={`npm install @agentpay/sdk
# or
yarn add @agentpay/sdk
# or
pnpm add @agentpay/sdk`} />
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mt-4">
              <p className="text-sm text-indigo-300/80">
                <strong>Requirements:</strong> Node.js ≥ 18, TypeScript ≥ 5.0 (recommended). The SDK is ESM-first and ships with full type definitions.
              </p>
            </div>
          </Section>

          {/* Quickstart */}
          <Section id="quickstart" title="Quickstart">
            <p className="text-white/60 mb-4">
              Create your first agent wallet and execute a payment in under 5 minutes.
            </p>
            <CodeBlock code={`import { AgentPay } from '@agentpay/sdk'

const pay = new AgentPay({
  apiKey: process.env.AGENTPAY_KEY!,
  network: 'base-mainnet', // or 'base-sepolia' for testnet
})

// 1. Create a wallet for your agent
const agent = await pay.createAgent('research-001', {
  label: 'Research Agent',
  dailyLimitUSDC: 50,
})

console.log(agent.address) // 0x1a2b3c...

// 2. Fund it (send USDC to agent.address from your treasury)

// 3. Agent pays for an API call
const tx = await pay.pay({
  fromAgentId: 'research-001',
  toAddress: '0xYourServiceAddress',
  amountUSDC: 0.04,
  memo: 'GPT-4o call · 1k tokens',
})

console.log(tx.hash) // 0xabc...

// 4. Check remaining budget
const balance = await pay.getBalance('research-001')
// { usdc: 49.96, spentToday: 0.04, remainingToday: 49.96, limit: 50 }`} />
          </Section>

          {/* Authentication */}
          <Section id="authentication" title="Authentication">
            <p className="text-white/60 mb-4">
              All SDK methods are authenticated with an API key. Generate your key from the{' '}
              <Link href="/dashboard" className="text-indigo-400 hover:underline">dashboard</Link>.
            </p>
            <CodeBlock code={`import { AgentPay } from '@agentpay/sdk'

const pay = new AgentPay({
  apiKey: process.env.AGENTPAY_KEY!, // Keep this secret
  network: 'base-mainnet',
})`} />
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium">Constructor options</p>
              </div>
              <div className="px-4 py-2">
                <Param name="apiKey" type="string" required desc="Your AgentPay API key. Never expose this client-side." />
                <Param name="network" type="string" desc={`"base-mainnet" (default) or "base-sepolia" for testnet`} />
                <Param name="rpcUrl" type="string" desc="Optional custom RPC URL. Defaults to Alchemy's Base endpoint." />
                <Param name="timeout" type="number" desc="Request timeout in milliseconds. Default: 30000." />
              </div>
            </div>
          </Section>

          {/* createAgent */}
          <Section id="create-agent" title="createAgent()">
            <p className="text-white/60 mb-2">
              Provisions a new smart wallet on Base for an agent. The wallet is a minimal ERC-4337 account — fully on-chain, non-custodial.
            </p>
            <CodeBlock code={`const agent = await pay.createAgent(agentId: string, options: {
  label?: string
  dailyLimitUSDC?: number
  allowedRecipients?: string[] // whitelist of to-addresses
})

// Returns:
// {
//   agentId: string
//   address: string       // on-chain wallet address
//   label: string
//   dailyLimit: number
//   createdAt: string
// }`} />
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium">Parameters</p>
              </div>
              <div className="px-4 py-2">
                <Param name="agentId" type="string" required desc="Your internal identifier for this agent. Must be unique within your account." />
                <Param name="label" type="string" desc="Human-readable name shown in the dashboard." />
                <Param name="dailyLimitUSDC" type="number" desc="Maximum USDC the agent can spend per 24h window. Enforced on-chain." />
                <Param name="allowedRecipients" type="string[]" desc="If set, the agent can only send to these addresses. Empty = unrestricted." />
              </div>
            </div>
            <CodeBlock code={`// Example: Orchestrator creating sub-agents
const agents = await Promise.all([
  pay.createAgent('scraper-001', { label: 'Web Scraper', dailyLimitUSDC: 10 }),
  pay.createAgent('analyst-001', { label: 'Data Analyst', dailyLimitUSDC: 25 }),
  pay.createAgent('writer-001', { label: 'Content Writer', dailyLimitUSDC: 15 }),
])

console.log(agents.map(a => a.address))
// ['0x1a2b...', '0x3c4d...', '0x5e6f...']`} />
          </Section>

          {/* pay */}
          <Section id="pay" title="pay()">
            <p className="text-white/60 mb-2">
              Executes a USDC transfer from an agent wallet. Checks daily limit before sending; throws <code className="text-red-400 text-sm">LimitExceededError</code> if the spend would exceed the cap.
            </p>
            <CodeBlock code={`const tx = await pay.pay({
  fromAgentId: string
  toAddress: string      // recipient on Base
  amountUSDC: number
  memo?: string          // stored on-chain as calldata
})

// Returns:
// {
//   hash: string         // transaction hash
//   blockNumber: number
//   status: 'confirmed' | 'pending'
//   fee: number          // gas fee in USDC equivalent
// }`} />
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10"><p className="text-sm font-medium">Parameters</p></div>
              <div className="px-4 py-2">
                <Param name="fromAgentId" type="string" required desc="ID of the paying agent. Must have been created with createAgent()." />
                <Param name="toAddress" type="string" required desc="Recipient address. Must be in allowedRecipients if that whitelist is set." />
                <Param name="amountUSDC" type="number" required desc="Amount to transfer. Minimum 0.001 USDC." />
                <Param name="memo" type="string" desc="Optional memo stored as hex calldata on-chain. Useful for billing/audit trails." />
              </div>
            </div>
            <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              <p className="text-sm text-amber-300/80">
                <strong>Latency:</strong> Transactions confirm in ~2s on Base Mainnet. The SDK waits for 1 confirmation before returning. Use <code className="text-amber-400">pay.payAndWait()</code> to wait for finality (12 blocks, ~24s).
              </p>
            </div>
          </Section>

          {/* getBalance */}
          <Section id="get-balance" title="getBalance()">
            <p className="text-white/60 mb-2">Returns the current balance and spend status of an agent wallet.</p>
            <CodeBlock code={`const balance = await pay.getBalance(agentId: string)

// Returns:
// {
//   usdc: number           // current USDC balance
//   spentToday: number     // USDC spent in rolling 24h window
//   remainingToday: number // dailyLimit - spentToday
//   limit: number          // configured daily limit
//   updatedAt: string      // last on-chain update
// }`} />
            <CodeBlock code={`// Monitor a fleet
const fleet = await pay.listAgents()
const overBudget = fleet.filter(a =>
  a.spentToday / a.dailyLimit > 0.9
)

if (overBudget.length > 0) {
  console.warn('Agents near daily limit:', overBudget.map(a => a.label))
}`} />
          </Section>

          {/* setDailyLimit */}
          <Section id="set-limit" title="setDailyLimit()">
            <p className="text-white/60 mb-2">
              Updates the daily spend cap for an agent. Takes effect immediately — if the new limit is lower than today's spend, further payments are blocked until the 24h window resets.
            </p>
            <CodeBlock code={`await pay.setDailyLimit(agentId: string, limitUSDC: number)

// Example: emergency cap a runaway agent
await pay.setDailyLimit('scraper-001', 0)
// → agent is now fully blocked`} />
          </Section>

          {/* listAgents */}
          <Section id="list-agents" title="listAgents()">
            <p className="text-white/60 mb-2">Returns all agents in your account with their current balances and spend status.</p>
            <CodeBlock code={`const agents = await pay.listAgents(options?: {
  includeInactive?: boolean // default: false
})

// Returns Agent[] where each Agent is:
// {
//   agentId: string
//   address: string
//   label: string
//   dailyLimit: number
//   spentToday: number
//   balance: number
//   txCount: number
//   createdAt: string
//   active: boolean
// }`} />
          </Section>

          {/* getTransactions */}
          <Section id="transactions" title="getTransactions()">
            <p className="text-white/60 mb-2">Fetches transaction history for an agent or the entire fleet.</p>
            <CodeBlock code={`const txs = await pay.getTransactions(options?: {
  agentId?: string     // filter by agent (omit for all)
  limit?: number       // default: 50, max: 500
  before?: string      // cursor for pagination
  after?: string       // ISO date filter
})

// Returns:
// {
//   transactions: Transaction[]
//   nextCursor?: string     // for pagination
//   total: number
// }`} />
            <CodeBlock code={`// Example: audit trail for billing
const txs = await pay.getTransactions({
  agentId: 'analyst-001',
  after: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  limit: 500,
})

const totalSpent = txs.transactions
  .reduce((sum, tx) => sum + tx.amountUSDC, 0)

console.log(\`analyst-001 spent $\${totalSpent.toFixed(2)} last 30 days\`)`} />
          </Section>

          {/* Webhooks */}
          <Section id="webhooks" title="Webhooks">
            <p className="text-white/60 mb-4">
              AgentPay can POST events to your endpoint in real time. Configure your webhook URL in the dashboard.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-white/10"><p className="text-sm font-medium">Event types</p></div>
              <div className="divide-y divide-white/5">
                {[
                  { event: 'payment.confirmed', desc: 'A pay() transaction confirmed on-chain.' },
                  { event: 'payment.failed', desc: 'A transaction failed (reverted or gas issue).' },
                  { event: 'limit.exceeded', desc: 'Agent tried to exceed its daily limit.' },
                  { event: 'limit.warning', desc: 'Agent has spent 80% of its daily limit.' },
                  { event: 'balance.low', desc: 'Agent USDC balance below 10 USDC.' },
                  { event: 'agent.created', desc: 'New agent wallet deployed.' },
                ].map(e => (
                  <div key={e.event} className="flex gap-4 px-4 py-3">
                    <code className="text-sm text-indigo-400 w-48 shrink-0">{e.event}</code>
                    <p className="text-sm text-white/60">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <CodeBlock lang="typescript" code={`// Webhook payload shape
interface WebhookEvent {
  id: string
  type: string            // e.g. 'payment.confirmed'
  timestamp: string
  agentId: string
  data: {
    hash?: string         // tx hash (payment events)
    amountUSDC?: number
    toAddress?: string
    spentToday?: number
    limit?: number
    balance?: number
  }
}

// Verify the webhook signature (HMAC-SHA256)
import crypto from 'crypto'

function verifyWebhook(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(\`sha256=\${expected}\`)
  )
}`} />
          </Section>

          {/* Error Handling */}
          <Section id="errors" title="Error Handling">
            <p className="text-white/60 mb-4">All SDK methods throw typed errors. Import them to catch specific cases.</p>
            <CodeBlock code={`import {
  AgentPayError,
  LimitExceededError,
  InsufficientBalanceError,
  AgentNotFoundError,
  UnauthorizedRecipientError,
} from '@agentpay/sdk'

try {
  await pay.pay({
    fromAgentId: 'research-001',
    toAddress: '0xSomeAddress',
    amountUSDC: 100,
  })
} catch (err) {
  if (err instanceof LimitExceededError) {
    // Agent hit its daily cap
    console.log(\`Limit: $\${err.limit}, Spent: $\${err.spentToday}\`)
  } else if (err instanceof InsufficientBalanceError) {
    // Not enough USDC in the wallet
    console.log(\`Balance: $\${err.balance}, Needed: $\${err.required}\`)
  } else if (err instanceof UnauthorizedRecipientError) {
    // toAddress not in allowedRecipients
    console.log('Recipient not whitelisted:', err.address)
  } else {
    throw err
  }
}`} />
            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10"><p className="text-sm font-medium">Error classes</p></div>
              <div className="divide-y divide-white/5">
                {[
                  { name: 'LimitExceededError', desc: 'Daily spend limit would be exceeded. Has .limit and .spentToday.' },
                  { name: 'InsufficientBalanceError', desc: 'Agent wallet has insufficient USDC. Has .balance and .required.' },
                  { name: 'AgentNotFoundError', desc: 'No agent found for the given agentId.' },
                  { name: 'UnauthorizedRecipientError', desc: 'toAddress is not in the agent\'s allowedRecipients list.' },
                  { name: 'NetworkError', desc: 'RPC or network timeout. Safe to retry.' },
                ].map(e => (
                  <div key={e.name} className="flex gap-4 px-4 py-3">
                    <code className="text-sm text-red-400 w-60 shrink-0">{e.name}</code>
                    <p className="text-sm text-white/60">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* CTA */}
          <div className="mt-8 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to ship?</h3>
            <p className="text-white/50 text-sm mb-6">10 agent wallets and 1,000 transactions/month — free forever.</p>
            <Link
              href="/dashboard"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-2.5 rounded-xl transition-colors"
            >
              Open Dashboard →
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
