import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://goalfest.pt'),
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
  colorScheme: 'dark',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const h = await headers()
  const nonce = h.get('x-nonce') ?? undefined
  const lang = h.get('x-locale') ?? 'pt'

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {nonce && <meta name="csp-nonce" content={nonce} />}
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
