# AgentPay

**Banking infrastructure for AI agent fleets.**
Built on Base · USDC-native · Powered by Privy + Alchemy

## Stack
- **Next.js 14** (App Router)
- **Privy** — agent wallet creation (App ID: cmqa4wqh000380clggpimzsbb)
- **Alchemy** — Base Mainnet RPC + transaction history
- **Viem** — on-chain interactions
- **USDC on Base** — `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Quick start

```bash
# 1. Add your Privy App Secret in .env.local
PRIVY_APP_SECRET=your_secret_here

# 2. Install & run
npm install
npm run dev

# 3. Open http://localhost:3000
```

## Project structure

```
src/
├── lib/
│   ├── agentpay.ts     ← Core SDK (createAgentWallet, getBalance, etc.)
│   └── types.ts        ← TypeScript types
└── app/
    ├── page.tsx         ← Landing page
    └── dashboard/
        └── page.tsx     ← Fleet monitoring dashboard
```

## What's built

- Landing page with hero, features, quickstart code snippet
- Dashboard: agent fleet view, balances, daily budgets, transactions
- SDK core: createAgentWallet, getBalance, setDailyLimit, getTransactions

## Next steps (week 2)

- [ ] Add Privy App Secret → wallets creation goes live
- [ ] Connect dashboard to real on-chain data via Alchemy API
- [ ] Add API route `/api/agents` for SDK consumers
- [ ] Deploy to Vercel
- [ ] Register domain agentpay.xyz / agentpay.io
