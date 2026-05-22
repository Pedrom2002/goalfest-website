import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://goalfest.pt'),
}

export const viewport: Viewport = {
  themeColor: '#43B02A',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preload" as="image" href="/mundial-poster.jpg" fetchPriority="high" />
        <link rel="preload" as="video" href="/mundial.mp4" type="video/mp4" fetchPriority="high" />
        {/* Runs before first paint — marks weak devices so CSS + Framer Motion skip all animations */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: `(function(){try{var m=navigator.deviceMemory,c=navigator.hardwareConcurrency,w=window.innerWidth,t=('ontouchstart' in window);if((m!==undefined&&m<4)||(c!==undefined&&c<=4)||w<900||t)document.documentElement.setAttribute('data-perf','low')}catch(e){}})()` }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
