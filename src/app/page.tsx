import Link from 'next/link'

const CODE_SNIPPET = `import { AgentPay } from '@agentpay/sdk'

const pay = new AgentPay({ apiKey: process.env.AGENTPAY_KEY })

// Create a wallet for your agent
const agent = await pay.createAgent('my-agent-001', {
  label: 'Research Agent',
  dailyLimitUSDC: 50,
})

// Agent pays for an API call
await pay.pay({
  fromAgentId: 'my-agent-001',
  toAddress: '0xOpenAI...',
  amountUSDC: 0.04,
})

// Check balance
const balance = await pay.getBalance('my-agent-001')
// → { usdc: 49.96, spentToday: 0.04, limit: 50 }`

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold">A</div>
          <span className="font-semibold text-lg">AgentPay</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/docs" className="text-sm text-white/60 hover:text-white transition-colors">Docs</Link>
          <a href="https://github.com/IcoinX/agentpay" target="_blank" rel="noopener noreferrer" className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors">GitHub</a>
          <Link href="/dashboard" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-1.5 rounded-full mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
          Built on Base · Powered by USDC
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
          Banking for<br />
          <span className="text-indigo-400">AI Agents</span>
        </h1>

        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Give every AI agent its own wallet, budget, and spending rules.
          Track every transaction across your entire agent fleet — in real time.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-xl transition-colors text-lg"
          >
            Open Dashboard
          </Link>
          <a
            href="#quickstart"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-3 rounded-xl transition-colors text-lg"
          >
            View docs →
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 py-8 mb-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '<1s', label: 'Wallet creation' },
            { value: '$0.001', label: 'Per transaction fee' },
            { value: '99.99%', label: 'Uptime on Base' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-white/40 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything your agents need to transact</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: '🤖',
              title: 'One wallet per agent',
              desc: 'Spin up isolated USDC wallets for every agent in one API call. Each agent has its own on-chain identity and balance.',
            },
            {
              icon: '🔒',
              title: 'Programmable budgets',
              desc: 'Set daily spending limits, whitelist approved recipients, and block unauthorized transactions — automatically enforced.',
            },
            {
              icon: '⚡',
              title: 'Agent-to-agent payments',
              desc: 'Orchestrators pay sub-agents. Sub-agents pay external APIs. Full settlement on Base in under 2 seconds.',
            },
            {
              icon: '📊',
              title: 'Real-time fleet dashboard',
              desc: 'See every agent, every wallet, every transaction across your entire fleet — with spend analytics and alerts.',
            },
            {
              icon: '💰',
              title: 'Yield on idle balances',
              desc: 'Agent wallets not actively spending earn yield automatically via on-chain protocols. Your fleet\'s cash works while it waits.',
            },
            {
              icon: '🔗',
              title: 'Works with any AI framework',
              desc: 'Drop-in SDK for LangChain, CrewAI, AutoGen, or any custom agent. 5-minute integration, zero custody risk.',
            },
          ].map(f => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code quickstart */}
      <section id="quickstart" className="max-w-5xl mx-auto px-6 mb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Ship in 5 minutes</h2>
          <p className="text-white/50">One SDK. Your agent has a wallet and a budget.</p>
        </div>
        <div className="bg-[#13131f] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            <span className="ml-3 text-white/40 text-xs font-mono">agent.ts</span>
          </div>
          <pre className="p-6 text-sm font-mono text-white/80 overflow-x-auto leading-relaxed">
            <code>{CODE_SNIPPET}</code>
          </pre>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm text-white/60">
            npm install @agentpay/sdk
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 mb-24 text-center">
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to deploy your first agent wallet?</h2>
          <p className="text-white/50 mb-8">Free tier includes 10 agent wallets and 1,000 transactions/month.</p>
          <Link
            href="/docs"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-10 py-3 rounded-xl transition-colors text-lg"
          >
            Start building →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <p>AgentPay · Built on Base · USDC-native · © 2026</p>
      </footer>
    </div>
  )
}
