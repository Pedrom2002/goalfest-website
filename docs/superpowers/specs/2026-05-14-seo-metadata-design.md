# SEO Metadata Design: Goalfest Lisboa

**Date:** 2026-05-14
**Domain:** goalfest.pt
**Locales:** pt (default), en

---

## Scope

Implement foundational SEO for the Goalfest Lisboa site:
- robots.txt + XML sitemap
- Per-page metadata with OpenGraph and canonical URLs
- hreflang for pt/en
- JSON-LD structured data (Event on homepage, FAQPage on /faq)
- Fix metadata conflict between root and locale layouts

---

## Architecture

### robots.ts (`src/app/robots.ts`)
Dynamic robots.txt via Next.js App Router convention.
- Allow all
- Reference sitemap: `https://goalfest.pt/sitemap.xml`

### sitemap.ts (`src/app/sitemap.ts`)
Dynamic sitemap listing all locale routes:
- `/pt`, `/en` (homepage)
- `/pt/faq`, `/en/faq`
- `/pt/bilhetes`, `/en/bilhetes`
- `/pt/termos`, `/en/termos`
- `/pt/privacidade`, `/en/privacidade`

Priority: homepage=1.0, faq/bilhetes=0.8, legal=0.3

### `[locale]/layout.tsx` - Base metadata
Shared metadata for all pages under a locale:
- `metadataBase`: `https://goalfest.pt`
- `alternates.languages`: hreflang pt/en + x-default
- `openGraph.type`: website
- `openGraph.images`: logo `/Design sem nome(3).png`
- `twitter.card`: summary_large_image

Per-page metadata overrides via `generateMetadata` in each page file.

### Homepage (`[locale]/page.tsx`)
```
title: "Goalfest Lisboa | Fanzone Oficial do Mundial 2026"
description: "A maior fanzone de Lisboa para o Mundial 2026. Ecrãs gigantes, food trucks e bar no Parque das Nações. 11 Jun - 19 Jul 2026."
```
JSON-LD: `Event` schema
```json
{
  "@type": "Event",
  "name": "Goalfest Lisboa",
  "startDate": "2026-06-11",
  "endDate": "2026-07-19",
  "location": { "@type": "Place", "name": "Parque das Nações", "address": "Lisboa, Portugal" },
  "organizer": { "@type": "Organization", "name": "Goalfest" },
  "url": "https://goalfest.pt"
}
```

### FAQ (`[locale]/faq/page.tsx`)
```
title: "FAQ | Goalfest Lisboa"
description: "Respostas às perguntas frequentes sobre o Goalfest: entradas, local, comida, regras e acessibilidade."
```
JSON-LD: `FAQPage` schema generated from `faq.json` data (locale-aware: pt vs en q/a).

### Bilhetes (`[locale]/bilhetes/page.tsx`)
```
title: "Reservar Lugar | Goalfest Lisboa"
description: "Reserva o teu lugar no Goalfest Lisboa para os jogos do Mundial 2026."
```
No structured data needed.

### Root layout fix (`src/app/layout.tsx`)
Remove `metadata` export - it conflicts with locale layout. Root layout is just a shell that returns children.

---

## Data Flow

```
goalfest.pt/pt       → locale=pt, canonical=/pt,    hreflang pt+en
goalfest.pt/en       → locale=en, canonical=/en,    hreflang pt+en
goalfest.pt/sitemap.xml → all routes, both locales
goalfest.pt/robots.txt  → allow all + sitemap ref
```

---

## Constraints

- No new dependencies
- JSON-LD injected via `<script type="application/ld+json">` in page JSX (not metadata API, which doesn't support JSON-LD)
- OG image: reuse existing `/Design sem nome(3).png` (360x360) - not ideal ratio but acceptable until a proper OG image is created
- Event dates: Mundial 2026 period (Jun 11 - Jul 19)
