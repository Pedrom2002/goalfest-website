import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { BASE_URL } from '@/lib/constants'
import ConcertosSchedule from '@/components/sections/ConcertosSchedule'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { CONCERTS } from '@/data/concerts'

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
    title: isPt ? 'Concertos' : 'Concerts',
    description: isPt
      ? 'Concertos ao vivo no Goalfest Lisboa durante a FIFA World Cup 2026. Consulta o line-up completo.'
      : 'Live concerts at Goalfest Lisboa during the FIFA World Cup 2026. View the full line-up.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/concertos`,
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/concertos`,
    },
  }
}

export default async function ConcertosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <ConcertosSchedule concerts={CONCERTS} />
      <ScrollToTop />
    </>
  )
}
