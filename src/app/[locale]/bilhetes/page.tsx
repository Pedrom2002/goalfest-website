import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TicketsForm from '@/components/ui/TicketsForm'
import matchesData from '@/data/matches.json'
import type { Match } from '@/types'

const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt ? 'Reservar Lugar' : 'Book a Spot',
    description: isPt
      ? 'Reserva o teu lugar no Golden Circle do Goalfest Lisboa para os jogos do Mundial 2026.'
      : 'Book your spot in the Goalfest Lisboa Golden Circle for the 2026 FIFA World Cup matches.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/bilhetes`,
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/bilhetes`,
    },
  }
}

export default async function BilhetesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('bilhetes')
  const matches = matchesData as Match[]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h1 className="font-display text-5xl font-black text-gold uppercase tracking-wide mb-4">
            {t('title')}
          </h1>
          <p className="text-text-muted">{t('subtitle')}</p>
        </div>
        <TicketsForm matches={matches} />
      </main>
      <Footer />
    </>
  )
}
