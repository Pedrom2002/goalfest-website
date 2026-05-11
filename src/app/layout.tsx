import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fanzone Lisboa 2026',
  description: 'O maior fanzone do Mundial 2026 em Lisboa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
