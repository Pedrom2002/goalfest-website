import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { BASE_URL } from '@/lib/constants'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FaqAccordion from '@/components/ui/FaqAccordion'
import faqData from '@/data/faq.json'
import type { FaqCategory } from '@/types'

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
    title: 'FAQ',
    description: isPt
      ? 'Respostas às perguntas frequentes sobre o Goalfest: entradas, local, comida, regras e acessibilidade.'
      : 'Answers to frequently asked questions about Goalfest: tickets, venue, food, rules and accessibility.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/faq`,
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/faq`,
    },
  }
}

type FaqTKey = 'category_entradas' | 'category_local' | 'category_comida' | 'category_regras' | 'category_acessibilidade'

const categoryTitleKeys: Record<string, FaqTKey> = {
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
  const nonce = (await headers()).get('x-nonce') ?? undefined
  const t = await getTranslations('faq')
  const categories = faqData as FaqCategory[]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: categories.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: locale === 'pt' ? item.q : item.qEn,
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'pt' ? item.a : item.aEn,
        },
      }))
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl font-black text-gold uppercase tracking-wide mb-16 text-center">
          {t('title')}
        </h1>
        <div className="flex flex-col gap-10">
          {categories.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-text-muted text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                {(() => {
                  const key = categoryTitleKeys[cat.category]
                  return key
                    ? t(key)
                    : (locale === 'pt' ? cat.category : cat.categoryEn)
                })()}
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
