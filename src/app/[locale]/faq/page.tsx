import { getTranslations, setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FaqAccordion from '@/components/ui/FaqAccordion'
import faqData from '@/data/faq.json'
import type { FaqCategory } from '@/types'

const categoryTitleKeys: Record<string, string> = {
  entradas: 'category_entradas',
  local: 'category_local',
  comida: 'category_comida',
  regras: 'category_regras',
  acessibilidade: 'category_acessibilidade',
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('faq')
  const categories = faqData as FaqCategory[]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl font-black text-gold uppercase tracking-wide mb-16 text-center">
          {t('title')}
        </h1>
        <div className="flex flex-col gap-10">
          {categories.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-text-muted text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                {t(categoryTitleKeys[cat.category] as any)}
              </h2>
              <FaqAccordion
                items={cat.items.map((item) => ({
                  q: locale === 'pt' ? item.q : item.qEn,
                  a: locale === 'pt' ? item.a : item.aEn,
                }))}
              />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
