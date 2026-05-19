import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { BASE_URL } from '@/lib/constants'
import Hero from '@/components/sections/Hero'
import Venue from '@/components/sections/Venue'
import Sponsors from '@/components/sections/Sponsors'
import WhatIsGoalfest from '@/components/sections/WhatIsGoalfest'
import FaqSection from '@/components/sections/FaqSection'
import sponsorsData from '@/data/sponsors.json'
import type { SponsorsData } from '@/types'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt
      ? 'Goalfest 2026 | Mais do que uma Fanzone'
      : 'Goalfest 2026 | More than a Fanzone',
    description: isPt
      ? 'A maior fanzone de Lisboa para o Mundial 2026. Ecrãs gigantes, food trucks e bar no Vale do Silêncio. 11 Jun - 19 Jul 2026.'
      : 'The biggest fanzone in Lisbon for the 2026 FIFA World Cup. Giant screens, food trucks and bar at Vale do Silêncio. 11 Jun - 19 Jul 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
    },
    openGraph: {
      title: isPt ? 'Goalfest — Mais do que uma Fanzone' : 'Goalfest — More than a Fanzone',
      description: isPt
        ? 'A maior fanzone de Lisboa para o Mundial 2026.'
        : 'The biggest fanzone in Lisbon for the 2026 World Cup.',
      url: `${BASE_URL}/${locale}`,
    },
  }
}

function Divider() {
  return (
    <div className="flex items-center gap-4 px-8 md:px-24 opacity-30">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-green-pt" />
      <div className="w-1 h-1 rounded-full bg-green-pt" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-green-pt" />
    </div>
  )
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const nonce = (await headers()).get('x-nonce') ?? undefined
  const sponsors = sponsorsData as SponsorsData

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Goalfest Lisboa',
    description: 'Fanzone oficial do Mundial 2026 em Lisboa. Ecrãs gigantes, food trucks, concertos e bar no Vale do Silêncio, Olivais. 11 Jun - 19 Jul 2026.',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: 'https://goalfest.pt/goalfest-og.jpg',
    location: {
      '@type': 'Place',
      name: 'Vale do Silêncio, Olivais',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Cidade de Lourenço Marques',
        addressLocality: 'Lisboa',
        addressRegion: 'Lisboa',
        addressCountry: 'PT',
      },
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: 'https://goalfest.pt',
      validFrom: '2026-01-01',
    },
    organizer: {
      '@type': 'Organization',
      name: 'QUIC NATION',
      url: 'https://goalfest.pt',
    },
    keywords: 'fanzone, mundial 2026, FIFA World Cup, Lisboa, Olivais, goalfest, futebol, concertos',
    url: 'https://goalfest.pt',
    inLanguage: locale === 'pt' ? 'pt-PT' : 'en-GB',
  }

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative z-10">
        <Hero />
        <Divider />
        <WhatIsGoalfest />
        <Divider />
        <Venue />
        <Divider />
        <Sponsors data={sponsors} />
        <Divider />
        <FaqSection />
      </div>
    </>
  )
}
