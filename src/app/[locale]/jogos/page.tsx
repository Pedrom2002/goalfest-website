import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { BASE_URL } from '@/lib/constants'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JogosSchedule from '@/components/sections/JogosSchedule'
import { SCHEDULE } from '@/data/schedule'

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
    title: isPt ? 'Jogos Transmitidos' : 'Broadcast Matches',
    description: isPt
      ? '+50 jogos da FIFA World Cup 2026 transmitidos ao vivo no Goalfest Lisboa. Consulta a programação completa.'
      : '+50 FIFA World Cup 2026 matches broadcast live at Goalfest Lisboa. View the full schedule.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/jogos`,
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/jogos`,
    },
  }
}

export default async function JogosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Navbar />
      <JogosSchedule schedule={SCHEDULE} />
      <Footer />
    </>
  )
}
