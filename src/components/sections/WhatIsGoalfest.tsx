'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'

const FEATURES = {
  pt: [
    { title: 'Jogos do Mundial', body: '64 jogos da FIFA World Cup 2026 transmitidos ao vivo num ecrã gigante de alta definição.' },
    { title: 'Concertos', body: 'Atuações ao vivo de grandes nomes da música portuguesa e internacional nos dias de jogo.' },
    { title: 'Zona Gaming', body: 'Consolas disponíveis para todos. Participa nas competições e mostra quem é o melhor.' },
    { title: 'Football Park', body: 'Competições e torneios de futebol 5vs5 para todos os escalões, com prémios para os melhores.' },
    { title: 'Zona Kids', body: 'Espaço dedicado às crianças com atividades, animação e entretenimento para os mais novos.' },
    { title: 'Food Court', body: 'Food trucks, bar e restaurante gourmet para todos os gostos.' },
    { title: 'Fun Activities', body: 'Roda gigante com vista sobre o recinto e parede de escalada para os mais aventureiros. Diversão para toda a família.' },
    { title: 'Golden Circle', body: 'Área paga com acesso exclusivo à zona reservada mais próxima do ecrã gigante, com bar exclusivo. A melhor vista garantida.' },
    { title: 'VIP Lounge', body: 'Lounge exclusivo por convite. Um espaço reservado para viver o evento de forma única e privilegiada.' },
  ],
  en: [
    { title: 'World Cup Matches', body: '64 FIFA World Cup 2026 matches broadcast live on a giant high-definition screen.' },
    { title: 'Concerts', body: 'Live performances by major Portuguese and international music artists on match days.' },
    { title: 'Gaming Zone', body: 'Consoles available for everyone. Join the competitions and prove who\'s the best.' },
    { title: 'Football Park', body: '5-a-side competitions and tournaments for all age groups, with prizes for the winners.' },
    { title: 'Kids Zone', body: 'A dedicated space for children with activities, entertainment and fun for the little ones.' },
    { title: 'Food Court', body: 'Food trucks, bar and a gourmet restaurant for every taste.' },
    { title: 'Fun Activities', body: 'Ferris wheel overlooking the venue and a climbing wall for the more adventurous. Fun for the whole family.' },
    { title: 'Golden Circle', body: 'Paid access to the exclusive reserved area closest to the giant screen, with an exclusive bar. The best view, guaranteed.' },
    { title: 'VIP Lounge', body: 'Invite-only exclusive lounge. A private space to experience the event in a truly privileged way.' },
  ],
}

const STATS = {
  pt: [
    { value: '64', label: 'jogos transmitidos' },
    { value: '+10', label: 'concertos' },
    { value: '10h–02h', label: 'horário diário' },
  ],
  en: [
    { value: '64', label: 'matches broadcast' },
    { value: '+10', label: 'concerts' },
    { value: '10am–2am', label: 'daily hours' },
  ],
}

const COPY = {
  pt: {
    tag: 'O Evento',
    title: <>O que é o <span className="text-green-pt">Goalfest</span>?</>,
    desc: 'Mais do que uma Fanzone. O Goalfest é o maior evento de celebração do Mundial 2026 em Portugal, um parque no coração de Lisboa onde o futebol, a música e a cultura se encontram.',
  },
  en: {
    tag: 'The Event',
    title: <>What is <span className="text-green-pt">Goalfest</span>?</>,
    desc: 'More than a Fanzone. Goalfest is Portugal\'s biggest FIFA World Cup 2026 celebration event, a park in the heart of Lisbon where football, music and culture come together.',
  },
}

export default function WhatIsGoalfest() {
  const locale = useLocale() as 'pt' | 'en'
  const features = FEATURES[locale] ?? FEATURES.pt
  const stats = STATS[locale] ?? STATS.pt
  const copy = COPY[locale] ?? COPY.pt

  return (
    <section id="goalfest" className="relative py-12 md:py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,200,81,0.06) 0%, transparent 70%)'
      }} />

      <div className="max-w-7xl mx-auto relative">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center gap-3 justify-center mb-5">
            <span className="h-px w-12 bg-green-pt/40" />
            <p className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">{copy.tag}</p>
            <span className="h-px w-12 bg-green-pt/40" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-text-primary uppercase tracking-wide mb-6">
            {copy.title}
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {copy.desc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 my-12 md:my-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-black text-green-pt">{stat.value}</p>
              <p className="text-text-muted text-xs uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl p-6 bg-bg-surface/80 border border-white/12 hover:border-green-pt/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,200,81,0.08)] backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-pt/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
              <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.body}</p>
              {(f.title === 'Jogos do Mundial' || f.title === 'World Cup Matches') && (
                <Link href={`/${locale}/jogos`} className="inline-block mt-3 text-green-pt text-xs font-semibold hover:underline uppercase tracking-widest">
                  {locale === 'pt' ? 'Ver programação ↗' : 'View schedule ↗'}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
