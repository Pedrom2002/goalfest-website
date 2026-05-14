# SEO Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add robots.txt, sitemap, per-page metadata with OG/hreflang, and JSON-LD structured data to goalfest.pt.

**Architecture:** Use Next.js App Router native conventions (robots.ts, sitemap.ts, generateMetadata) with no new dependencies. JSON-LD injected via inline `<script>` tags in page JSX. hreflang via `alternates.languages` in metadata.

**Tech Stack:** Next.js App Router, next-intl (pt/en), TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/app/robots.ts` | robots.txt: allow all, sitemap ref |
| Create | `src/app/sitemap.ts` | XML sitemap for all locale routes |
| Modify | `src/app/layout.tsx` | Remove conflicting metadata export |
| Modify | `src/app/[locale]/layout.tsx` | Base metadata: metadataBase, OG, hreflang |
| Modify | `src/app/[locale]/page.tsx` | generateMetadata + JSON-LD Event |
| Modify | `src/app/[locale]/faq/page.tsx` | generateMetadata + JSON-LD FAQPage |
| Modify | `src/app/[locale]/bilhetes/page.tsx` | generateMetadata |
| Modify | `src/app/[locale]/termos/page.tsx` | generateMetadata |
| Modify | `src/app/[locale]/privacidade/page.tsx` | generateMetadata |

---

### Task 1: Fix root layout metadata conflict

**Files:**
- Modify: `src/app/layout.tsx`

The root layout exports `metadata` which conflicts with the locale layout. Remove it — the locale layout is authoritative.

- [ ] **Step 1: Edit `src/app/layout.tsx`**

Replace the entire file with:

```typescript
import type { Metadata } from 'next'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix: remove conflicting metadata from root layout"
```

---

### Task 2: Create robots.ts

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create `src/app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://goalfest.pt/sitemap.xml',
  }
}
```

- [ ] **Step 2: Verify output**

Start dev server (`npm run dev`) and visit `http://localhost:3000/robots.txt`. Expected:
```
User-Agent: *
Allow: /
Sitemap: https://goalfest.pt/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat: add robots.txt via App Router"
```

---

### Task 3: Create sitemap.ts

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://goalfest.pt'
const LOCALES = ['pt', 'en'] as const

const routes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/bilhetes', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/termos', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/privacidade', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    routes.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  )
}
```

- [ ] **Step 2: Verify output**

Visit `http://localhost:3000/sitemap.xml`. Expect 10 URLs (5 routes x 2 locales), all starting with `https://goalfest.pt/`.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add XML sitemap via App Router"
```

---

### Task 4: Update locale layout with base metadata + hreflang + OG

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Replace metadata export in `src/app/[locale]/layout.tsx`**

Replace the `metadata` const (lines 14-18) with:

```typescript
const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: isPt ? 'Goalfest Lisboa | Fanzone Oficial do Mundial 2026' : 'Goalfest Lisbon | Official FIFA World Cup 2026 Fanzone',
      template: '%s | Goalfest Lisboa',
    },
    description: isPt
      ? 'A maior fanzone de Lisboa para o Mundial 2026. Ecrãs gigantes, food trucks e bar no Parque das Nações. 11 Jun - 19 Jul 2026.'
      : 'The biggest fanzone in Lisbon for the 2026 FIFA World Cup. Giant screens, food trucks and bar at Parque das Nações. 11 Jun - 19 Jul 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'pt': `${BASE_URL}/pt`,
        'en': `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/pt`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'pt' ? 'pt_PT' : 'en_GB',
      siteName: 'Goalfest Lisboa',
      images: [
        {
          url: '/Design sem nome(3).png',
          width: 360,
          height: 360,
          alt: 'Goalfest Lisboa',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}
```

Keep all other code in the file unchanged (fonts, generateStaticParams, LocaleLayout).

- [ ] **Step 2: Verify in browser**

Visit `http://localhost:3000/pt` and inspect `<head>`. Expect:
- `<meta property="og:site_name" content="Goalfest Lisboa">`
- `<link rel="alternate" hreflang="pt" href="https://goalfest.pt/pt">`
- `<link rel="alternate" hreflang="en" href="https://goalfest.pt/en">`
- `<link rel="alternate" hreflang="x-default" href="https://goalfest.pt/pt">`

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat: base metadata with OG, hreflang, and canonical"
```

---

### Task 5: Homepage — generateMetadata + JSON-LD Event

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Add generateMetadata and JSON-LD to `src/app/[locale]/page.tsx`**

Add at the top of the file (after existing imports):

```typescript
import type { Metadata } from 'next'

const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt
      ? 'Goalfest Lisboa | Fanzone Oficial do Mundial 2026'
      : 'Goalfest Lisbon | Official FIFA World Cup 2026 Fanzone',
    description: isPt
      ? 'A maior fanzone de Lisboa para o Mundial 2026. Ecrãs gigantes, food trucks e bar no Parque das Nações. 11 Jun - 19 Jul 2026.'
      : 'The biggest fanzone in Lisbon for the 2026 FIFA World Cup. Giant screens, food trucks and bar at Parque das Nações. 11 Jun - 19 Jul 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
    },
    openGraph: {
      title: isPt ? 'Goalfest Lisboa — Fanzone Oficial do Mundial 2026' : 'Goalfest Lisbon — Official FIFA World Cup 2026 Fanzone',
      description: isPt
        ? 'A maior fanzone de Lisboa para o Mundial 2026.'
        : 'The biggest fanzone in Lisbon for the 2026 World Cup.',
      url: `${BASE_URL}/${locale}`,
    },
  }
}
```

Then add the JSON-LD Event script inside `LandingPage` return, as the first child inside the fragment `<>`:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Goalfest Lisboa',
  description: 'Fanzone oficial do Mundial 2026 em Lisboa',
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Parque das Nações',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Parque das Nações',
      addressLocality: 'Lisboa',
      addressCountry: 'PT',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'QUIC NATION',
    url: 'https://goalfest.pt',
  },
  url: 'https://goalfest.pt',
}
```

And in the JSX, inside the fragment before `<BackgroundFX />`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

The full updated `LandingPage` function looks like:

```typescript
export default function LandingPage() {
  const sponsors = sponsorsData as SponsorsData

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Goalfest Lisboa',
    description: 'Fanzone oficial do Mundial 2026 em Lisboa',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Parque das Nações',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Parque das Nações',
        addressLocality: 'Lisboa',
        addressCountry: 'PT',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'QUIC NATION',
      url: 'https://goalfest.pt',
    },
    url: 'https://goalfest.pt',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackgroundFX />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Divider />
        <WhatIsGoalfest />
        <Divider />
        <Venue />
        <Divider />
        <Sponsors data={sponsors} />
        <Divider />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify JSON-LD in browser**

Visit `http://localhost:3000/pt`, view source, search for `application/ld+json`. Expect Event schema block.

Also test at: https://search.google.com/test/rich-results (paste URL after deploy).

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: homepage generateMetadata and Event JSON-LD"
```

---

### Task 6: FAQ — generateMetadata + JSON-LD FAQPage

**Files:**
- Modify: `src/app/[locale]/faq/page.tsx`

- [ ] **Step 1: Add imports and generateMetadata to `src/app/[locale]/faq/page.tsx`**

Add at top after existing imports:

```typescript
import type { Metadata } from 'next'

const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt ? 'FAQ' : 'FAQ',
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
```

- [ ] **Step 2: Add JSON-LD FAQPage inside the page component**

The `FaqPage` component already has `categories` from `faqData`. Add JSON-LD before the return:

```typescript
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
```

And in the JSX, inside the fragment before `<Navbar />`:

```tsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
```

The full updated function:

```typescript
export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/faq/page.tsx
git commit -m "feat: FAQ generateMetadata and FAQPage JSON-LD"
```

---

### Task 7: Bilhetes — generateMetadata

**Files:**
- Modify: `src/app/[locale]/bilhetes/page.tsx`

- [ ] **Step 1: Add generateMetadata to `src/app/[locale]/bilhetes/page.tsx`**

Add after existing imports:

```typescript
import type { Metadata } from 'next'

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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/bilhetes/page.tsx
git commit -m "feat: bilhetes page generateMetadata"
```

---

### Task 8: Termos and Privacidade — generateMetadata

**Files:**
- Modify: `src/app/[locale]/termos/page.tsx`
- Modify: `src/app/[locale]/privacidade/page.tsx`

- [ ] **Step 1: Add generateMetadata to `src/app/[locale]/termos/page.tsx`**

Add after existing imports:

```typescript
import type { Metadata } from 'next'

const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt ? 'Termos e Condições' : 'Terms & Conditions',
    description: isPt
      ? 'Termos e condições de utilização do Goalfest Lisboa 2026.'
      : 'Terms and conditions for using Goalfest Lisboa 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/termos`,
    },
    robots: { index: false },
  }
}
```

- [ ] **Step 2: Add generateMetadata to `src/app/[locale]/privacidade/page.tsx`**

First read the file to understand its current structure, then add:

```typescript
import type { Metadata } from 'next'

const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt ? 'Política de Privacidade' : 'Privacy Policy',
    description: isPt
      ? 'Política de privacidade do Goalfest Lisboa 2026.'
      : 'Privacy policy for Goalfest Lisboa 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/privacidade`,
    },
    robots: { index: false },
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/termos/page.tsx src/app/[locale]/privacidade/page.tsx
git commit -m "feat: legal pages generateMetadata (noindex)"
```

---

## Self-Review

**Spec coverage:**
- robots.txt: Task 2
- sitemap: Task 3
- metadata conflict fix: Task 1
- hreflang + OG in layout: Task 4
- homepage generateMetadata + JSON-LD Event: Task 5
- FAQ generateMetadata + JSON-LD FAQPage: Task 6
- bilhetes generateMetadata: Task 7
- termos/privacidade generateMetadata: Task 8

All spec items covered. No gaps.

**Placeholder scan:** No TBDs. All code blocks complete.

**Type consistency:**
- `generateMetadata` signature consistent across all tasks
- `BASE_URL` defined locally in each file (duplication acceptable, no shared module needed)
- `FaqCategory` type already imported in faq/page.tsx
- `item.q / item.qEn / item.a / item.aEn` matches faq.json structure confirmed
