# Fanzone Lisboa 2026 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a beautiful, dynamic, bilingual (PT/EN) event website for a Lisbon World Cup 2026 fanzone with a dark+gold aesthetic, animated landing page, match schedule, ticket reservation form, venue map, photo gallery, sponsors, and FAQ.

**Architecture:** Hybrid SPA — the root route (`/`) is a single-page scroll experience with anchored sections (Hero, Jogos, Venue, Galeria, Sponsors); `/bilhetes` and `/faq` are separate Next.js pages. next-intl adds `/pt/` and `/en/` locale prefixes via middleware. All data (matches, FAQ, sponsors) lives in static JSON files.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, next-intl, Mapbox GL JS, Formspree, `next/image`, `next/font`, Vercel deploy.

---

## File Map

```
src/
  app/
    [locale]/
      layout.tsx          ← root layout: fonts, theme, Navbar, Footer
      page.tsx            ← landing SPA (composes all sections)
      bilhetes/page.tsx   ← ticket reservation form page
      faq/page.tsx        ← FAQ accordion page
  components/
    layout/
      Navbar.tsx          ← sticky nav, scroll-aware bg, PT/EN toggle, mobile drawer
      Footer.tsx          ← links, socials, copyright
    sections/
      Hero.tsx            ← full-viewport hero, particles, countdown, CTAs
      Jogos.tsx           ← match grid with filter tabs
      Venue.tsx           ← split layout info + Mapbox map
      Galeria.tsx         ← masonry photo grid
      Sponsors.tsx        ← sponsor tiers with hover colour
    ui/
      CountdownTimer.tsx  ← real-time flip countdown to 2026-06-11
      MatchCard.tsx       ← single match card (flags, date, phase, status)
      PhotoLightbox.tsx   ← full-screen lightbox with swipe
      FaqAccordion.tsx    ← animated accordion item
      TicketsForm.tsx     ← form with Formspree submit + success state
  data/
    matches.json          ← static match data
    faq.json              ← FAQ categories + questions
    sponsors.json         ← sponsor tiers + names
  messages/
    pt.json               ← all PT strings
    en.json               ← all EN strings
  lib/
    utils.ts              ← formatMatchDate helper
  middleware.ts           ← next-intl locale routing
tailwind.config.ts        ← custom colours + fonts
next.config.ts            ← next-intl plugin, image domains
```

---

## Task 1: Project Scaffold + Config

**Files:**
- Create: `package.json` (via `create-next-app`)
- Create: `tailwind.config.ts`
- Create: `next.config.ts`
- Create: `src/middleware.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Bootstrap Next.js project**

```bash
cd "c:\Users\P02\Downloads\Fanzone Website"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

When prompted, accept defaults. This creates the base project.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion next-intl mapbox-gl react-map-gl @types/mapbox-gl react-masonry-css
```

- [ ] **Step 3: Configure Tailwind custom colours**

Replace the contents of `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0d0d0d',
        'bg-surface': '#1a1a1a',
        gold: '#FFD700',
        'red-pt': '#C8102E',
        'green-pt': '#006600',
        'text-primary': '#F5F5F5',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-oswald)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Configure next.config.ts**

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/middleware.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 5: Create next-intl middleware**

Create `src/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 6: Create utils**

Create `src/lib/utils.ts`:

```typescript
export function formatMatchDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Lisbon',
  }).format(new Date(isoDate))
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts on http://localhost:3000 with no errors.

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 project with Tailwind, Framer Motion, next-intl"
```

---

## Task 2: Static Data Files

**Files:**
- Create: `src/data/matches.json`
- Create: `src/data/faq.json`
- Create: `src/data/sponsors.json`

- [ ] **Step 1: Create matches.json**

Create `src/data/matches.json`:

```json
[
  {
    "id": "m1",
    "home": { "name": "Portugal", "nameEn": "Portugal", "flag": "🇵🇹" },
    "away": { "name": "Brasil", "nameEn": "Brazil", "flag": "🇧🇷" },
    "date": "2026-06-17T19:00:00",
    "phase": "grupo",
    "status": "upcoming"
  },
  {
    "id": "m2",
    "home": { "name": "Espanha", "nameEn": "Spain", "flag": "🇪🇸" },
    "away": { "name": "França", "nameEn": "France", "flag": "🇫🇷" },
    "date": "2026-06-20T16:00:00",
    "phase": "grupo",
    "status": "upcoming"
  },
  {
    "id": "m3",
    "home": { "name": "Argentina", "nameEn": "Argentina", "flag": "🇦🇷" },
    "away": { "name": "Alemanha", "nameEn": "Germany", "flag": "🇩🇪" },
    "date": "2026-06-22T19:00:00",
    "phase": "grupo",
    "status": "upcoming"
  },
  {
    "id": "m4",
    "home": { "name": "Portugal", "nameEn": "Portugal", "flag": "🇵🇹" },
    "away": { "name": "Inglaterra", "nameEn": "England", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    "date": "2026-06-25T19:00:00",
    "phase": "grupo",
    "status": "upcoming"
  },
  {
    "id": "m5",
    "home": { "name": "TBD", "nameEn": "TBD", "flag": "🏆" },
    "away": { "name": "TBD", "nameEn": "TBD", "flag": "🏆" },
    "date": "2026-07-04T19:00:00",
    "phase": "oitavos",
    "status": "upcoming"
  },
  {
    "id": "m6",
    "home": { "name": "TBD", "nameEn": "TBD", "flag": "🏆" },
    "away": { "name": "TBD", "nameEn": "TBD", "flag": "🏆" },
    "date": "2026-07-14T19:00:00",
    "phase": "final",
    "status": "upcoming"
  }
]
```

- [ ] **Step 2: Create faq.json**

Create `src/data/faq.json`:

```json
[
  {
    "category": "entradas",
    "categoryEn": "tickets",
    "items": [
      {
        "q": "Como posso reservar um lugar?",
        "qEn": "How do I reserve a spot?",
        "a": "Preenche o formulário na página Bilhetes. Receberás uma confirmação por email.",
        "aEn": "Fill out the form on the Tickets page. You will receive a confirmation by email."
      },
      {
        "q": "A entrada é gratuita?",
        "qEn": "Is entry free?",
        "a": "A entrada é livre mas a reserva é obrigatória para garantir lugar.",
        "aEn": "Entry is free but reservation is required to guarantee your spot."
      }
    ]
  },
  {
    "category": "local",
    "categoryEn": "venue",
    "items": [
      {
        "q": "Onde fica a Fanzone?",
        "qEn": "Where is the Fanzone?",
        "a": "No Parque das Nações, Lisboa. Morada exacta a confirmar.",
        "aEn": "At Parque das Nações, Lisbon. Exact address to be confirmed."
      },
      {
        "q": "Que transportes posso usar?",
        "qEn": "What transport can I use?",
        "a": "Metro linha vermelha, estação Oriente. Autocarros 728 e 759.",
        "aEn": "Red metro line, Oriente station. Buses 728 and 759."
      }
    ]
  },
  {
    "category": "comida",
    "categoryEn": "food",
    "items": [
      {
        "q": "Há comida e bebida disponível?",
        "qEn": "Is food and drink available?",
        "a": "Sim, existem food trucks e bar no local durante todos os jogos.",
        "aEn": "Yes, there are food trucks and a bar on site during all matches."
      }
    ]
  },
  {
    "category": "regras",
    "categoryEn": "rules",
    "items": [
      {
        "q": "Posso entrar com crianças?",
        "qEn": "Can I bring children?",
        "a": "Sim, crianças são bem-vindas. Menores de 16 anos devem ser acompanhados.",
        "aEn": "Yes, children are welcome. Under 16s must be accompanied by an adult."
      }
    ]
  },
  {
    "category": "acessibilidade",
    "categoryEn": "accessibility",
    "items": [
      {
        "q": "O espaço é acessível a cadeiras de rodas?",
        "qEn": "Is the venue wheelchair accessible?",
        "a": "Sim, o espaço tem zonas reservadas e rampas de acesso.",
        "aEn": "Yes, the venue has reserved areas and access ramps."
      }
    ]
  }
]
```

- [ ] **Step 3: Create sponsors.json**

Create `src/data/sponsors.json`:

```json
{
  "principal": [
    { "id": "s1", "name": "Patrocinador Principal", "logo": null }
  ],
  "parceiros": [
    { "id": "s2", "name": "Parceiro A", "logo": null },
    { "id": "s3", "name": "Parceiro B", "logo": null },
    { "id": "s4", "name": "Parceiro C", "logo": null }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "chore: add static data files (matches, faq, sponsors)"
```

---

## Task 3: i18n Messages + Types

**Files:**
- Create: `src/messages/pt.json`
- Create: `src/messages/en.json`
- Create: `src/types/index.ts`

- [ ] **Step 1: Create types**

Create `src/types/index.ts`:

```typescript
export type MatchStatus = 'upcoming' | 'live' | 'finished'
export type MatchPhase = 'grupo' | 'oitavos' | 'quartos' | 'meias' | 'final'

export interface TeamInfo {
  name: string
  nameEn: string
  flag: string
}

export interface Match {
  id: string
  home: TeamInfo
  away: TeamInfo
  date: string
  phase: MatchPhase
  status: MatchStatus
}

export interface FaqItem {
  q: string
  qEn: string
  a: string
  aEn: string
}

export interface FaqCategory {
  category: string
  categoryEn: string
  items: FaqItem[]
}

export interface Sponsor {
  id: string
  name: string
  logo: string | null
}

export interface SponsorsData {
  principal: Sponsor[]
  parceiros: Sponsor[]
}
```

- [ ] **Step 2: Create PT messages**

Create `src/messages/pt.json`:

```json
{
  "nav": {
    "jogos": "Jogos",
    "venue": "Local",
    "galeria": "Galeria",
    "faq": "FAQ",
    "bilhetes": "Bilhetes"
  },
  "hero": {
    "subtitle": "Lisboa · Mundial 2026",
    "cta_tickets": "Reservar Lugar",
    "cta_matches": "Ver Jogos",
    "countdown_days": "Dias",
    "countdown_hours": "Horas",
    "countdown_minutes": "Min",
    "countdown_seconds": "Seg"
  },
  "jogos": {
    "title": "Calendário de Jogos",
    "filter_all": "Todos",
    "filter_grupos": "Grupos",
    "filter_eliminatorias": "Eliminatórias",
    "filter_portugal": "Portugal",
    "live_badge": "AO VIVO",
    "phase_grupo": "Fase de Grupos",
    "phase_oitavos": "Oitavos de Final",
    "phase_quartos": "Quartos de Final",
    "phase_meias": "Meias-Finais",
    "phase_final": "Final"
  },
  "venue": {
    "title": "O Local",
    "address_label": "Morada",
    "address": "Parque das Nações, Lisboa",
    "capacity_label": "Capacidade",
    "capacity": "500 adeptos",
    "includes_label": "Incluído",
    "includes": ["Ecrãs gigantes", "Food trucks", "Bar", "Zonas cobertas"],
    "transport_title": "Transportes",
    "transport": "Metro linha vermelha — Estação Oriente. Autocarros 728 e 759.",
    "parking_title": "Estacionamento",
    "parking": "Parque de estacionamento Vasco da Gama (5 min a pé).",
    "access_title": "Acessibilidade",
    "access": "Espaço totalmente acessível. Zonas reservadas para mobilidade reduzida.",
    "hours_title": "Horários",
    "hours": "Portas abrem 1h antes de cada jogo."
  },
  "galeria": {
    "title": "Galeria"
  },
  "sponsors": {
    "title": "Patrocinadores",
    "principal_label": "Patrocinador Principal",
    "partners_label": "Parceiros"
  },
  "footer": {
    "copyright": "© 2026 Fanzone Lisboa. Todos os direitos reservados."
  },
  "bilhetes": {
    "title": "Reservar Lugar",
    "subtitle": "Garante o teu lugar na maior fanzone de Lisboa",
    "name_label": "Nome completo",
    "email_label": "Email",
    "quantity_label": "Número de bilhetes",
    "matches_label": "Jogo(s) pretendido(s)",
    "message_label": "Mensagem (opcional)",
    "submit": "Reservar",
    "submitting": "A enviar...",
    "success_title": "Reserva recebida!",
    "success_msg": "Receberás uma confirmação por email em breve."
  },
  "faq": {
    "title": "Perguntas Frequentes",
    "category_entradas": "Entradas",
    "category_local": "Local",
    "category_comida": "Comida & Bebida",
    "category_regras": "Regras",
    "category_acessibilidade": "Acessibilidade"
  }
}
```

- [ ] **Step 3: Create EN messages**

Create `src/messages/en.json`:

```json
{
  "nav": {
    "jogos": "Matches",
    "venue": "Venue",
    "galeria": "Gallery",
    "faq": "FAQ",
    "bilhetes": "Tickets"
  },
  "hero": {
    "subtitle": "Lisbon · World Cup 2026",
    "cta_tickets": "Reserve a Spot",
    "cta_matches": "See Matches",
    "countdown_days": "Days",
    "countdown_hours": "Hours",
    "countdown_minutes": "Min",
    "countdown_seconds": "Sec"
  },
  "jogos": {
    "title": "Match Schedule",
    "filter_all": "All",
    "filter_grupos": "Groups",
    "filter_eliminatorias": "Knockouts",
    "filter_portugal": "Portugal",
    "live_badge": "LIVE",
    "phase_grupo": "Group Stage",
    "phase_oitavos": "Round of 16",
    "phase_quartos": "Quarter-Finals",
    "phase_meias": "Semi-Finals",
    "phase_final": "Final"
  },
  "venue": {
    "title": "The Venue",
    "address_label": "Address",
    "address": "Parque das Nações, Lisbon",
    "capacity_label": "Capacity",
    "capacity": "500 fans",
    "includes_label": "Included",
    "includes": ["Giant screens", "Food trucks", "Bar", "Covered areas"],
    "transport_title": "Transport",
    "transport": "Red metro line — Oriente Station. Buses 728 and 759.",
    "parking_title": "Parking",
    "parking": "Vasco da Gama car park (5 min walk).",
    "access_title": "Accessibility",
    "access": "Fully accessible venue. Reserved areas for reduced mobility.",
    "hours_title": "Hours",
    "hours": "Doors open 1h before each match."
  },
  "galeria": {
    "title": "Gallery"
  },
  "sponsors": {
    "title": "Sponsors",
    "principal_label": "Main Sponsor",
    "partners_label": "Partners"
  },
  "footer": {
    "copyright": "© 2026 Fanzone Lisboa. All rights reserved."
  },
  "bilhetes": {
    "title": "Reserve a Spot",
    "subtitle": "Secure your place at Lisbon's biggest fanzone",
    "name_label": "Full name",
    "email_label": "Email",
    "quantity_label": "Number of tickets",
    "matches_label": "Match(es) you want to attend",
    "message_label": "Message (optional)",
    "submit": "Reserve",
    "submitting": "Sending...",
    "success_title": "Reservation received!",
    "success_msg": "You will receive a confirmation email shortly."
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "category_entradas": "Tickets",
    "category_local": "Venue",
    "category_comida": "Food & Drink",
    "category_regras": "Rules",
    "category_acessibilidade": "Accessibility"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/messages/ src/types/
git commit -m "chore: add i18n messages (PT/EN) and TypeScript types"
```

---

## Task 4: Root Layout + Fonts

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create root layout**

Create `src/app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'Fanzone Lisboa 2026',
  description: 'A maior fanzone de Lisboa para o Mundial 2026',
}

const locales = ['pt', 'en']

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${oswald.variable}`}>
      <body className="bg-bg-primary text-text-primary antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update globals.css**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

html {
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 3: Verify build still compiles**

```bash
npm run build
```

Expected: build succeeds (pages may show 404 but no compile errors).

- [ ] **Step 4: Commit**

```bash
git add src/app/
git commit -m "feat: root layout with next-intl, Inter + Oswald fonts, dark theme"
```

---

## Task 5: Navbar Component

**Files:**
- Create: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Create Navbar**

Create `src/components/layout/Navbar.tsx`:

```typescript
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'pt' ? 'en' : 'pt'
  const switchLocale = () => {
    const segments = pathname.split('/')
    segments[1] = otherLocale
    router.push(segments.join('/'))
  }

  const navLinks = [
    { href: `/${locale}/#jogos`, label: t('jogos') },
    { href: `/${locale}/#venue`, label: t('venue') },
    { href: `/${locale}/#galeria`, label: t('galeria') },
    { href: `/${locale}/faq`, label: t('faq') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-primary/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={`/${locale}`} className="font-display text-xl font-bold text-gold tracking-widest uppercase">
          Fanzone
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted hover:text-gold transition-colors duration-200 text-sm font-medium uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/bilhetes`}
            className="bg-red-pt text-white px-4 py-2 rounded text-sm font-semibold uppercase tracking-wide hover:bg-red-pt/80 transition-colors"
          >
            {t('bilhetes')}
          </Link>
          <button
            onClick={switchLocale}
            className="text-text-muted hover:text-gold text-sm font-medium border border-text-muted/30 px-2 py-1 rounded hover:border-gold transition-colors"
          >
            {otherLocale.toUpperCase()}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-64 bg-bg-surface z-40 flex flex-col gap-6 p-8 pt-20 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-text-primary hover:text-gold text-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/bilhetes`}
              onClick={() => setMenuOpen(false)}
              className="bg-red-pt text-white px-4 py-2 rounded text-center font-semibold"
            >
              {t('bilhetes')}
            </Link>
            <button onClick={switchLocale} className="text-text-muted text-sm text-left">
              {locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: Navbar with scroll-aware background, mobile drawer, locale switcher"
```

---

## Task 6: Footer Component

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Create Footer**

Create `src/components/layout/Footer.tsx`:

```typescript
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-bg-surface border-t border-white/10 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display text-gold text-lg tracking-widest uppercase">Fanzone Lisboa</span>
        <nav className="flex gap-6 text-text-muted text-sm">
          <Link href={`/${locale}/faq`} className="hover:text-gold transition-colors">FAQ</Link>
          <Link href={`/${locale}/bilhetes`} className="hover:text-gold transition-colors">Bilhetes</Link>
        </nav>
        <p className="text-text-muted text-xs">{t('copyright')}</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: Footer component"
```

---

## Task 7: CountdownTimer Component

**Files:**
- Create: `src/components/ui/CountdownTimer.tsx`

- [ ] **Step 1: Create CountdownTimer**

Create `src/components/ui/CountdownTimer.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

const TARGET = new Date('2026-06-11T15:00:00Z') // World Cup 2026 opening

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET.getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-20 md:w-24 md:h-28">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={display}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-bg-surface border border-gold/20 rounded-lg font-display text-3xl md:text-5xl font-bold text-gold"
          >
            {display}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-text-muted text-xs uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function CountdownTimer() {
  const t = useTranslations('hero')
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <FlipUnit value={time.days} label={t('countdown_days')} />
      <span className="text-gold text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.hours} label={t('countdown_hours')} />
      <span className="text-gold text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.minutes} label={t('countdown_minutes')} />
      <span className="text-gold text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.seconds} label={t('countdown_seconds')} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/CountdownTimer.tsx
git commit -m "feat: CountdownTimer with flip animation targeting 2026-06-11"
```

---

## Task 8: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Create Hero**

Create `src/components/sections/Hero.tsx`:

```typescript
'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CountdownTimer from '@/components/ui/CountdownTimer'

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => i)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#C8102E' : '#006600',
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <Particles />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-surface opacity-80" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <h1 className="font-display text-6xl md:text-8xl font-black text-gold tracking-widest uppercase leading-none">
            FANZONE
          </h1>
          <div className="flex gap-2 my-2">
            <span className="block h-1 w-12 bg-red-pt rounded" />
            <span className="block h-1 w-12 bg-green-pt rounded" />
            <span className="block h-1 w-12 bg-gold rounded" />
          </div>
          <p className="text-text-muted tracking-[0.5em] text-sm uppercase">{t('subtitle')}</p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CountdownTimer />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href={`/${locale}/bilhetes`}
            className="bg-red-pt hover:bg-red-pt/80 text-white font-bold px-8 py-3 rounded uppercase tracking-wide transition-colors duration-200"
          >
            {t('cta_tickets')}
          </Link>
          <a
            href="#jogos"
            className="border border-gold text-gold hover:bg-gold hover:text-bg-primary font-bold px-8 py-3 rounded uppercase tracking-wide transition-all duration-200"
          >
            {t('cta_matches')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: Hero section with particles, countdown, and CTAs"
```

---

## Task 9: MatchCard + Jogos Section

**Files:**
- Create: `src/components/ui/MatchCard.tsx`
- Create: `src/components/sections/Jogos.tsx`

- [ ] **Step 1: Create MatchCard**

Create `src/components/ui/MatchCard.tsx`:

```typescript
import { useTranslations, useLocale } from 'next-intl'
import type { Match } from '@/types'
import { formatMatchDate } from '@/lib/utils'

const phaseKeys: Record<string, string> = {
  grupo: 'phase_grupo',
  oitavos: 'phase_oitavos',
  quartos: 'phase_quartos',
  meias: 'phase_meias',
  final: 'phase_final',
}

export default function MatchCard({ match }: { match: Match }) {
  const t = useTranslations('jogos')
  const locale = useLocale()
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <div
      className={`bg-bg-surface border border-white/10 rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:border-gold/30 ${
        isFinished ? 'opacity-50' : ''
      }`}
    >
      {/* Phase + Live badge */}
      <div className="flex items-center justify-between text-xs uppercase tracking-wider">
        <span className="text-text-muted">{t(phaseKeys[match.phase])}</span>
        {isLive && (
          <span className="flex items-center gap-1.5 text-red-pt font-bold">
            <span className="w-2 h-2 rounded-full bg-red-pt animate-pulse" />
            {t('live_badge')}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-3xl">{match.home.flag}</span>
          <span className="text-sm font-medium text-text-primary text-center">
            {locale === 'pt' ? match.home.name : match.home.nameEn}
          </span>
        </div>
        <span className="text-text-muted font-display text-lg font-bold">VS</span>
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-3xl">{match.away.flag}</span>
          <span className="text-sm font-medium text-text-primary text-center">
            {locale === 'pt' ? match.away.name : match.away.nameEn}
          </span>
        </div>
      </div>

      {/* Date */}
      <p className="text-text-muted text-xs text-center">
        {formatMatchDate(match.date, locale)}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create Jogos section**

Create `src/components/sections/Jogos.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import type { Match } from '@/types'
import MatchCard from '@/components/ui/MatchCard'

type Filter = 'all' | 'grupos' | 'eliminatorias' | 'portugal'

const filters: Filter[] = ['all', 'grupos', 'eliminatorias', 'portugal']
const filterKeys: Record<Filter, string> = {
  all: 'filter_all',
  grupos: 'filter_grupos',
  eliminatorias: 'filter_eliminatorias',
  portugal: 'filter_portugal',
}

function applyFilter(matches: Match[], filter: Filter, locale: string): Match[] {
  if (filter === 'all') return matches
  if (filter === 'grupos') return matches.filter((m) => m.phase === 'grupo')
  if (filter === 'eliminatorias') return matches.filter((m) => m.phase !== 'grupo')
  if (filter === 'portugal') {
    return matches.filter(
      (m) =>
        m.home.nameEn === 'Portugal' || m.away.nameEn === 'Portugal'
    )
  }
  return matches
}

export default function Jogos({ matches }: { matches: Match[] }) {
  const t = useTranslations('jogos')
  const locale = useLocale()
  const [active, setActive] = useState<Filter>('all')
  const filtered = applyFilter(matches, active, locale)

  return (
    <section id="jogos" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-12 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      {/* Filter tabs */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
              active === f
                ? 'bg-gold text-bg-primary'
                : 'bg-bg-surface text-text-muted hover:text-gold border border-white/10'
            }`}
          >
            {t(filterKeys[f])}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <MatchCard match={match} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/MatchCard.tsx src/components/sections/Jogos.tsx
git commit -m "feat: MatchCard and Jogos section with filter tabs and stagger animation"
```

---

## Task 10: Venue Section

**Files:**
- Create: `src/components/sections/Venue.tsx`

- [ ] **Step 1: Install react-map-gl if not already done**

```bash
npm install react-map-gl mapbox-gl @types/mapbox-gl
```

Note: Mapbox requires a free API token from mapbox.com. Create `.env.local` with:

```
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

- [ ] **Step 2: Create Venue section**

Create `src/components/sections/Venue.tsx`:

```typescript
'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/ui/VenueMap'), { ssr: false })

const INFO_ICONS: Record<string, string> = {
  transport: '🚇',
  parking: '🅿️',
  access: '♿',
  hours: '🕐',
}

export default function Venue() {
  const t = useTranslations('venue')
  const includes = t.raw('includes') as string[]

  const infoCards = [
    { key: 'transport', title: t('transport_title'), body: t('transport') },
    { key: 'parking', title: t('parking_title'), body: t('parking') },
    { key: 'access', title: t('access_title'), body: t('access') },
    { key: 'hours', title: t('hours_title'), body: t('hours') },
  ]

  return (
    <section id="venue" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-16 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      {/* Split layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">{t('address_label')}</p>
            <p className="text-text-primary text-lg font-semibold">{t('address')}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">{t('capacity_label')}</p>
            <p className="text-text-primary text-lg font-semibold">{t('capacity')}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-2">{t('includes_label')}</p>
            <ul className="flex flex-wrap gap-2">
              {includes.map((item) => (
                <li key={item} className="bg-bg-surface border border-gold/20 text-gold text-sm px-3 py-1 rounded-full">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Right: map */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="h-72 md:h-96 rounded-xl overflow-hidden border border-white/10"
        >
          <MapComponent />
        </motion.div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-bg-surface border border-white/10 rounded-xl p-5"
          >
            <div className="text-2xl mb-2">{INFO_ICONS[card.key]}</div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wide mb-1">{card.title}</h3>
            <p className="text-text-muted text-sm">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create VenueMap subcomponent**

Create `src/components/ui/VenueMap.tsx`:

```typescript
'use client'

import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const VENUE_COORDS = { longitude: -9.0938, latitude: 38.7693 } // Parque das Nações

export default function VenueMap() {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ ...VENUE_COORDS, zoom: 14 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
      <Marker longitude={VENUE_COORDS.longitude} latitude={VENUE_COORDS.latitude}>
        <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-bg-primary font-bold text-sm shadow-lg">
          ⚽
        </div>
      </Marker>
    </Map>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Venue.tsx src/components/ui/VenueMap.tsx .env.local
git commit -m "feat: Venue section with Mapbox map, info cards, slide-in animation"
```

---

## Task 11: Galeria Section + Lightbox

**Files:**
- Create: `src/components/sections/Galeria.tsx`
- Create: `src/components/ui/PhotoLightbox.tsx`

- [ ] **Step 1: Install masonry library**

```bash
npm install react-masonry-css
```

- [ ] **Step 2: Create PhotoLightbox**

Create `src/components/ui/PhotoLightbox.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Photo {
  src: string
  alt: string
}

interface LightboxProps {
  photos: Photo[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function PhotoLightbox({ photos, index, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative z-10 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[index].src}
              alt={photos[index].alt}
              width={1200}
              height={800}
              className="rounded-xl object-cover w-full max-h-[80vh]"
            />
            <button onClick={onPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-bg-primary transition-colors">‹</button>
            <button onClick={onNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-bg-primary transition-colors">›</button>
            <button onClick={onClose} className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-pt transition-colors">✕</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Create Galeria section**

Create `src/components/sections/Galeria.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import PhotoLightbox from '@/components/ui/PhotoLightbox'

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', alt: 'Adeptos no estádio' },
  { src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', alt: 'Bola de futebol' },
  { src: 'https://images.unsplash.com/photo-1551958219-acbc608f2099?w=800', alt: 'Ecrã gigante fanzone' },
  { src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', alt: 'Adeptos portugueses' },
  { src: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=800', alt: 'Lisboa ao pôr do sol' },
  { src: 'https://images.unsplash.com/photo-1540747913346-19212a32a168?w=800', alt: 'Celebração golo' },
]

const breakpoints = { default: 3, 1024: 2, 640: 1 }

export default function Galeria() {
  const t = useTranslations('galeria')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % PHOTOS.length : null))

  return (
    <section id="galeria" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-16 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      <Masonry breakpointCols={breakpoints} className="flex gap-4" columnClassName="flex flex-col gap-4">
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={() => setLightboxIndex(i)}
          >
            <Image src={photo.src} alt={photo.alt} width={600} height={400} className="w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">⤢</span>
            </div>
          </motion.div>
        ))}
      </Masonry>

      <PhotoLightbox
        photos={PHOTOS}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Galeria.tsx src/components/ui/PhotoLightbox.tsx
git commit -m "feat: Galeria section with masonry grid and lightbox"
```

---

## Task 12: Sponsors Section

**Files:**
- Create: `src/components/sections/Sponsors.tsx`

- [ ] **Step 1: Create Sponsors**

Create `src/components/sections/Sponsors.tsx`:

```typescript
'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import type { SponsorsData } from '@/types'

function SponsorPlaceholder({ name, large }: { name: string; large?: boolean }) {
  return (
    <div
      className={`bg-bg-surface border border-white/10 rounded-lg flex items-center justify-center transition-all duration-200 grayscale hover:grayscale-0 hover:border-gold/40 cursor-pointer ${
        large ? 'w-48 h-24 text-base' : 'w-32 h-16 text-xs'
      }`}
    >
      <span className="text-text-muted font-semibold uppercase tracking-wide">{name}</span>
    </div>
  )
}

export default function Sponsors({ data }: { data: SponsorsData }) {
  const t = useTranslations('sponsors')

  return (
    <section id="sponsors" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-16 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      {/* Principal */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <p className="text-text-muted text-xs uppercase tracking-widest">{t('principal_label')}</p>
        <div className="flex gap-6 flex-wrap justify-center">
          {data.principal.map((s) => (
            <SponsorPlaceholder key={s.id} name={s.name} large />
          ))}
        </div>
      </div>

      {/* Parceiros */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-text-muted text-xs uppercase tracking-widest">{t('partners_label')}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          {data.parceiros.map((s) => (
            <SponsorPlaceholder key={s.id} name={s.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Sponsors.tsx
git commit -m "feat: Sponsors section with grayscale-to-colour hover effect"
```

---

## Task 13: Landing Page (Compose All Sections)

**Files:**
- Create: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create landing page**

Create `src/app/[locale]/page.tsx`:

```typescript
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Jogos from '@/components/sections/Jogos'
import Venue from '@/components/sections/Venue'
import Galeria from '@/components/sections/Galeria'
import Sponsors from '@/components/sections/Sponsors'
import matchesData from '@/data/matches.json'
import sponsorsData from '@/data/sponsors.json'
import type { Match, SponsorsData } from '@/types'

export default function LandingPage() {
  const matches = matchesData as Match[]
  const sponsors = sponsorsData as SponsorsData

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Jogos matches={matches} />
        <Venue />
        <Galeria />
        <Sponsors data={sponsors} />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Run dev server and verify landing**

```bash
npm run dev
```

Open http://localhost:3000. Verify: Hero renders with countdown, Jogos section shows match cards, Venue shows info + map placeholder, Galeria shows photos, Sponsors shows placeholders.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: compose landing page with all sections"
```

---

## Task 14: FAQ Page

**Files:**
- Create: `src/components/ui/FaqAccordion.tsx`
- Create: `src/app/[locale]/faq/page.tsx`

- [ ] **Step 1: Create FaqAccordion**

Create `src/components/ui/FaqAccordion.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItem {
  q: string
  a: string
}

export default function FaqAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-white/10">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between py-4 text-left text-text-primary font-medium hover:text-gold transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{item.q}</span>
            <motion.span
              animate={{ rotate: openIndex === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gold text-xl ml-4 flex-shrink-0"
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-text-muted text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create FAQ page**

Create `src/app/[locale]/faq/page.tsx`:

```typescript
import { useLocale, useTranslations } from 'next-intl'
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

export default function FaqPage() {
  const t = useTranslations('faq')
  const locale = useLocale()
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
                {t(categoryTitleKeys[cat.category])}
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
```

- [ ] **Step 3: Verify FAQ page**

Open http://localhost:3000/pt/faq. Verify: categories render, accordion opens/closes with spring animation, `+` rotates to `×`.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/FaqAccordion.tsx src/app/[locale]/faq/page.tsx
git commit -m "feat: FAQ page with animated accordion and i18n categories"
```

---

## Task 15: Tickets Form Page

**Files:**
- Create: `src/components/ui/TicketsForm.tsx`
- Create: `src/app/[locale]/bilhetes/page.tsx`

- [ ] **Step 1: Set up Formspree**

Go to formspree.io, create a free account, create a new form. Copy the form ID (looks like `xpwzgkjl`). Add to `.env.local`:

```
NEXT_PUBLIC_FORMSPREE_ID=your_form_id_here
```

- [ ] **Step 2: Create TicketsForm**

Create `src/components/ui/TicketsForm.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import type { Match } from '@/types'
import { formatMatchDate } from '@/lib/utils'

export default function TicketsForm({ matches }: { matches: Match[] }) {
  const t = useTranslations('bilhetes')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])

  const toggleMatch = (id: string) => {
    setSelectedMatches((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)
    data.set('matches', selectedMatches.join(', '))

    const res = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 flex flex-col items-center gap-4"
          >
            <div className="text-6xl">✅</div>
            <h2 className="font-display text-3xl text-gold font-black uppercase">{t('success_title')}</h2>
            <p className="text-text-muted">{t('success_msg')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('name_label')}</label>
              <input
                name="name"
                required
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('email_label')}</label>
              <input
                name="email"
                type="email"
                required
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('quantity_label')}</label>
              <select
                name="quantity"
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Matches */}
            <div className="flex flex-col gap-2">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('matches_label')}</label>
              <div className="flex flex-col gap-2">
                {matches.map((match) => {
                  const label = `${match.home.flag} ${locale === 'pt' ? match.home.name : match.home.nameEn} vs ${match.away.flag} ${locale === 'pt' ? match.away.name : match.away.nameEn} — ${formatMatchDate(match.date, locale)}`
                  return (
                    <label key={match.id} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedMatches.includes(match.id)}
                        onChange={() => toggleMatch(match.id)}
                        className="mt-1 accent-gold"
                      />
                      <span className="text-text-muted text-sm group-hover:text-text-primary transition-colors">{label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('message_label')}</label>
              <textarea
                name="message"
                rows={3}
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-red-pt hover:bg-red-pt/80 disabled:opacity-50 text-white font-bold py-3 rounded-lg uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('submitting')}
                </>
              ) : t('submit')}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 3: Create Bilhetes page**

Create `src/app/[locale]/bilhetes/page.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TicketsForm from '@/components/ui/TicketsForm'
import matchesData from '@/data/matches.json'
import type { Match } from '@/types'

export default function BilhetesPage() {
  const t = useTranslations('bilhetes')
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
```

- [ ] **Step 4: Verify tickets form**

Open http://localhost:3000/pt/bilhetes. Verify: form renders, all match checkboxes appear, submit shows loading then success state. Check Formspree dashboard for received submission.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/TicketsForm.tsx src/app/[locale]/bilhetes/page.tsx
git commit -m "feat: Bilhetes page with Formspree form, match selection, success animation"
```

---

## Task 16: Build Check + Vercel Deploy

**Files:**
- Create: `vercel.json` (optional)
- Create: `.gitignore`

- [ ] **Step 1: Ensure .gitignore is correct**

Verify `.gitignore` contains:

```
.env.local
.next/
node_modules/
.superpowers/
```

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes with no TypeScript errors and no `next build` failures. All routes listed: `/`, `/pt`, `/en`, `/pt/faq`, `/en/faq`, `/pt/bilhetes`, `/en/bilhetes`.

- [ ] **Step 3: Test production build locally**

```bash
npm run start
```

Open http://localhost:3000. Test: countdown works, filter tabs work, lightbox opens, FAQ accordion animates, locale switch works.

- [ ] **Step 4: Deploy to Vercel**

```bash
npx vercel --prod
```

When prompted: link to existing project or create new. Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_FORMSPREE_ID`

- [ ] **Step 5: Verify production**

Open the Vercel URL. Test all 9 checklist items from the spec:
1. All sections visible on landing
2. Countdown counting down to 11 Jun 2026
3. Match filters work (Todos / Grupos / Eliminatórias / Portugal)
4. Ticket form submits and shows success
5. Lightbox opens, arrow navigation, ESC closes
6. PT/EN toggle switches all strings
7. Mobile layout at 375px (DevTools)
8. Build passed (step 2)
9. All routes resolve: `/pt`, `/en`, `/pt/faq`, `/en/faq`, `/pt/bilhetes`, `/en/bilhetes`

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "chore: production build verified, Vercel deploy configured"
```

---

## Summary

| Task | Deliverable |
|---|---|
| 1 | Project scaffold, Tailwind config, next-intl middleware |
| 2 | Static JSON data (matches, faq, sponsors) |
| 3 | TypeScript types, PT+EN i18n messages |
| 4 | Root layout with fonts and dark theme |
| 5 | Navbar (sticky, scroll-aware, mobile drawer, locale toggle) |
| 6 | Footer |
| 7 | CountdownTimer with flip animation |
| 8 | Hero section (particles, countdown, CTAs) |
| 9 | MatchCard + Jogos section (grid, filters, stagger) |
| 10 | Venue section (split layout, Mapbox map, info cards) |
| 11 | Galeria section (masonry, lightbox, swipe) |
| 12 | Sponsors section (grayscale hover, tiers) |
| 13 | Landing page (compose all sections) |
| 14 | FAQ page (accordion with spring animation) |
| 15 | Bilhetes page (form, Formspree, success state) |
| 16 | Production build + Vercel deploy |
