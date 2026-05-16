import type { Metadata } from 'next'
import { Inter, Oswald, Orbitron } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import BackgroundFXClient from '@/components/ui/BackgroundFXClient'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', display: 'swap' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['500', '600', '700'], display: 'swap' })

const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: isPt ? 'Goalfest Lisboa | Fanzone Oficial do Mundial 2026' : 'Goalfest Lisbon | Official FIFA World Cup 2026 Fanzone',
      template: '%s | Goalfest Lisboa',
    },
    description: isPt
      ? 'A maior fanzone de Lisboa para o Mundial 2026. Ecrãs gigantes, food trucks e bar no Parque das Nações. 11 Jun - 19 Jul 2026.'
      : 'The biggest fanzone in Lisbon for the 2026 FIFA World Cup. Giant screens, food trucks and bar at Parque das Nações. 11 Jun - 19 Jul 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'pt': `${BASE_URL}/pt`,
        'en': `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/pt`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'pt' ? 'pt_PT' : 'en_GB',
      siteName: 'Goalfest Lisboa',
      images: [
        {
          url: '/01_Sofia_ConcertoValeSilencio_0609_16x9.jpg',
          width: 1600,
          height: 900,
          alt: 'Goalfest Lisboa - Fanzone Oficial Mundial 2026',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
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
    <html lang={locale} className={`${inter.variable} ${oswald.variable} ${orbitron.variable}`}>
      <body className="bg-bg-primary text-text-primary antialiased">
        <a
          href="#main-content"
          className="skip-link"
        >
          {locale === 'pt' ? 'Saltar para o conteúdo' : 'Skip to content'}
        </a>
        <NextIntlClientProvider messages={messages}>
          <BackgroundFXClient />
          <div id="main-content">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
