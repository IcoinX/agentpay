# AgentPay

> Banking for AI Agents — give every agent its own USDC wallet on Base

AgentPay lets you create isolated wallets for your AI agents, set daily spending limits, and send USDC payments programmatically — in 3 lines of code.

```ts
const pay = new AgentPay({ apiKey: 'agp_...' })
await pay.createAgent('researcher', { label: 'Research Agent', dailyLimitUSDS: 50 })
await pay.pay({ fromAgentId: 'researcher', toAddress: '0x...', amountUSDS: 0.04 })
```

**[→ Live demo](https://agentpay-blush.vercel.app)** · **[→ Dashboard](https://agentpay-blush.vercel.app/dashboard)**

---

## Why AgentPay?

AI agents need to pay for things: API calls, compute, data, services. Today you hardcode a shared wallet and hope nothing goes wrong. AgentPay gives each agent its own isolated USDC wallet with:

- **Per-agent wallets** — each agent has its own address on Base
- **Daily spending limits** — cap how much any agent can spend in 24h
- **Full transaction history** — audit exactly what each agent spent
- **One API key** — authenticate all your agents from a single key

---

## Quick Start

### 1. Get your API key

Go to the **[Dashboard](https://agentpay-blush.vercel.app/dashboard)** → click **Generate Key** → copy your `agp_...` key.

### 2. Install the SDK

```bash
npm install @agentpay/sdk
```

### 3. Create an agent and pay

```ts
import AgentPay from '@agentpay/sdk'

const pay = new AgentPay({ apiKey: 'agp_your_key_here' })

// Create a wallet for your agent
const agent = await pay.createAgent('my-agent-001', {
  label: 'Research Agent',
  dailyLimitUSDS: 50,   // max $50/day
})

console.log(agent.address) // 0x...

// Check balance
const balance = await pay.getBalance('my-agent-001')
console.log(balance.usdc)        // 0.00
console.log(balance.spentToday)  // 0.00
console.log(balance.limit)       // 50

// Pay for something
const tx = await pay.pay({
  fromAgentId: 'my-agent-001',
  toAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  amountUSDS: 0.04,
  memo: 'OpenAI API call',
})

console.log(tx.hash)    // 0x...
console.log(tx.status)  // 'confirmed'
```

---

## API Reference

### `new AgentPay(options)`

| Option | Type | Description |
|--------|------|-------------|
| `apiKey` | `string` | Your `agp_...` key from the dashboard |
| `baseUrl` | `string` | Optional — override the API endpoint |

---

### `createAgent(agentId, options)`

Create a new agent wallet.

```ts
const agent = await pay.createAgent('agent-id', {
  label: 'My Agent',       // display name
  dailyLimitUSDS: 100,     // optional, default 100
})
```

Returns: `Agent` — `{ agentId, address, label, dailyLimitUSDS, spentToday, balance, txCount }`

---

### `listAgents()`

List all agents for your API key.

```ts
const { agents } = await pay.listAgents()
```

---

### `getBalance(agentId)`

Get real-time USDC balance from Base.

```ts
const { usdc, spentToday, limit, address } = await pay.getBalance('agent-id')
```

---

### `pay(options)`

Send USDC from an agent wallet. Throws if daily limit would be exceeded.

```ts
const tx = await pay.pay({
  fromAgentId: 'agent-id',
  toAddress: '0x...',
  amountUSDS: 1.50,
  memo: 'optional description',
})
```

Returns: `Transaction` — `{ hash, from, to, amount, timestamp, status }`

Error on limit exceeded:
```ts
// throws: AgentPay API error 402 — Daily limit exceeded. Remaining: 12.50 USDC
```

---

### `getTransactions(agentId)`

Get transaction history for an agent.

```ts
const { transactions } = await pay.getTransactions('agent-id')
```

---

### `deleteAgent(agentId)`

Remove an agent and its transaction history.

```ts
await pay.deleteAgent('agent-id')
```

---

## Use Cases

**LLM tool calling** — give your GPT-4 / Claude agent a spending budget:
```ts
const tools = [{
  name: 'pay_for_api',
  description: 'Pay for an external API call',
  parameters: { toAddress: 'string', amountUSDS: 'number' },
  execute: ({ toAddress, amountUSDS }) =>
    pay.pay({ fromAgentId: agentId, toAddress, amountUSDS })
}]
```

**Multi-agent systems** — one wallet per role:
```ts
await pay.createAgent('planner',   { label: 'Planner',   dailyLimitUSDS: 10 })
await pay.createAgent('executor',  { label: 'Executor',  dailyLimitUSDS: 200 })
await pay.createAgent('validator', { label: 'Validator', dailyLimitUSDS: 5 })
```

**Audit trail** — know exactly what each agent spent:
```ts
const { transactions } = await pay.getTransactions('executor')
const report = transactions.map(tx =>
  `[${tx.timestamp}] ${tx.toLabel}: $${tx.amount} — ${tx.hash}`
)
```

---

## Network

AgentPay runs on **Base** (Coinbase L2) — fast, cheap, EVM-compatible.

- USDC contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Chain ID: `8453`
- Avg tx cost: ~$0.001

---

## Roadmap

- [ ] Persistent storage (replace in-memory store)
- [ ] Webhook notifications on spend events
- [ ] Per-agent spending alerts
- [ ] Multi-token support (ETH, USDT)
- [ ] Team API keys

---

## License

MIT
