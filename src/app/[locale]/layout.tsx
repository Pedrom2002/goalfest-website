import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import BackgroundFX from '@/components/ui/BackgroundFX'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'Goalfest Lisboa 2026',
  description: 'A maior fanzone de Lisboa para o Mundial 2026',
  viewport: 'width=device-width, initial-scale=1',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'pt' | 'en')) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${oswald.variable}`}>
      <body className="bg-bg-primary text-text-primary antialiased">
        <NextIntlClientProvider messages={messages}>
          <BackgroundFX />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
