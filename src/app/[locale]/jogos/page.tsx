import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JogosSchedule from '@/components/sections/JogosSchedule'

const BASE_URL = 'https://goalfest.pt'

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
      <JogosSchedule />
      <Footer />
    </>
  )
}
