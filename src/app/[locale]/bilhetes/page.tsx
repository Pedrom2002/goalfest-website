import { getTranslations, setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TicketsForm from '@/components/ui/TicketsForm'
import matchesData from '@/data/matches.json'
import type { Match } from '@/types'

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
