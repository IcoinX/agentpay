import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgentPay — Banking for AI Agents',
  description: 'The financial operating system for AI agent fleets. Create wallets, set budgets, and track spending for every AI agent you deploy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
