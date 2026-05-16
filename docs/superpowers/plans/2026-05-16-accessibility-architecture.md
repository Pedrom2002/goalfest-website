# Accessibility, Architecture & Dead Code Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring fanzone-website to WCAG AA compliance, fix the generateStaticParams/headers() architecture contradiction, and remove the dead `filter_portugal` translation key.

**Architecture:** All accessibility fixes are isolated to individual component files — no shared state changes. The architecture fix is a one-line removal from layout.tsx. The dead key removal touches only messages/pt.json and messages/en.json.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, next-intl v4, Vitest + Testing Library, TypeScript

---

## File Map

| File | Change |
|------|--------|
| `src/app/globals.css` | Add `focus-visible` styles |
| `src/app/[locale]/layout.tsx` | Add skip-to-content link, remove `generateStaticParams` |
| `src/components/ui/PhotoLightbox.tsx` | Add `aria-label` to 3 icon buttons, `role="dialog"` to backdrop |
| `src/components/ui/FaqAccordion.tsx` | Add `aria-expanded`, `aria-controls`, `id` to answer panel |
| `src/components/sections/JogosSchedule.tsx` | Add `aria-pressed` to filter buttons |
| `src/components/sections/Galeria.tsx` | Change photo `motion.div` to `button` |
| `src/components/ui/CountdownTimer.tsx` | Add `aria-live="polite"` + `aria-atomic` to countdown container |
| `src/components/sections/Hero.tsx` | Add `aria-label` to `<video>` |
| `messages/pt.json` | Remove `jogos.filter_portugal` |
| `messages/en.json` | Remove `jogos.filter_portugal` |
| `src/components/ui/FaqAccordion.test.tsx` | Add tests for aria-expanded and aria-controls |
| `src/components/sections/JogosSchedule.test.tsx` | Add test for aria-pressed |

---

### Task 1: Focus-visible styles + skip-to-content link

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add focus-visible CSS to globals.css**

Open `src/app/globals.css`. After the `* { box-sizing: border-box; }` block (line 29), add:

```css
:focus-visible {
  outline: 2px solid var(--color-green-pt);
  outline-offset: 3px;
  border-radius: 3px;
}
```

The full file after the change (lines 27-52 only, rest unchanged):

```css
* {
  box-sizing: border-box;
}

:focus-visible {
  outline: 2px solid var(--color-green-pt);
  outline-offset: 3px;
  border-radius: 3px;
}

@keyframes particleFloat {
```

- [ ] **Step 2: Add skip-to-content link in layout.tsx**

Open `src/app/[locale]/layout.tsx`. The current `<body>` block at lines 79-85 is:

```tsx
      <body className="bg-bg-primary text-text-primary antialiased">
        <NextIntlClientProvider messages={messages}>
          <BackgroundFXClient />
          {children}
        </NextIntlClientProvider>
      </body>
```

Replace with:

```tsx
      <body className="bg-bg-primary text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-green-pt focus:text-bg-primary focus:font-bold focus:rounded focus:outline-none"
        >
          {locale === 'pt' ? 'Saltar para o conteúdo' : 'Skip to content'}
        </a>
        <NextIntlClientProvider messages={messages}>
          <BackgroundFXClient />
          <div id="main-content">{children}</div>
        </NextIntlClientProvider>
      </body>
```

- [ ] **Step 3: Remove generateStaticParams from layout.tsx**

In the same file, delete lines 61-63:

```tsx
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
```

Remove them entirely. The layout calls `headers()` which makes it dynamic — `generateStaticParams` is ignored by Next.js when the layout is dynamic and its presence is misleading. The route segments (`/pt`, `/en`) are still rendered correctly via the middleware locale detection.

Also remove the now-unused `nonce` variable on line 76 if it is only used for `data-nonce` (which was already removed). Check: if `nonce` is not used anywhere in the JSX, remove:

```tsx
  const nonce = (await headers()).get('x-nonce') ?? ''
```

And remove the `headers` import if it becomes unused:

```tsx
import { headers } from 'next/headers'
```

- [ ] **Step 4: Run tests**

```
npx vitest run
```

Expected: all tests pass (no component changes yet, just CSS + layout structure).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css "src/app/[locale]/layout.tsx"
git commit -m "feat: add focus-visible styles, skip-to-content link, remove dead generateStaticParams"
```

---

### Task 2: PhotoLightbox accessibility

**Files:**
- Modify: `src/components/ui/PhotoLightbox.tsx`

The current buttons at lines 50-52 use HTML entities with no labels. Screen readers read them as "‹", "›", "×".

- [ ] **Step 1: Update PhotoLightbox.tsx**

Replace the entire file content with:

```tsx
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
          role="dialog"
          aria-modal="true"
          aria-label={index !== null ? photos[index]?.alt : undefined}
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
            <button
              onClick={onPrev}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-bg-primary transition-colors"
            >
              &#8249;
            </button>
            <button
              onClick={onNext}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-bg-primary transition-colors"
            >
              &#8250;
            </button>
            <button
              onClick={onClose}
              aria-label="Fechar galeria"
              className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-pt transition-colors"
            >
              &#10005;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Run tests**

```
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/PhotoLightbox.tsx
git commit -m "fix(a11y): add aria-labels to PhotoLightbox icon buttons, role=dialog"
```

---

### Task 3: FaqAccordion aria-expanded + aria-controls

**Files:**
- Modify: `src/components/ui/FaqAccordion.tsx`
- Modify: `src/components/ui/FaqAccordion.test.tsx`

- [ ] **Step 1: Write failing tests first**

Open `src/components/ui/FaqAccordion.test.tsx`. Add these two tests inside the `describe('FaqAccordion', ...)` block, after the existing tests:

```tsx
  it('button has aria-expanded=false when answer is hidden', () => {
    render(<FaqAccordion items={items} />)
    const btn = screen.getByText('Pergunta um').closest('button')!
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('button has aria-expanded=true when answer is visible', () => {
    render(<FaqAccordion items={items} />)
    const btn = screen.getByText('Pergunta um').closest('button')!
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('button aria-controls points to the answer panel id', () => {
    render(<FaqAccordion items={items} />)
    const btn = screen.getByText('Pergunta um').closest('button')!
    const controlsId = btn.getAttribute('aria-controls')!
    expect(controlsId).toBeTruthy()
    fireEvent.click(btn)
    expect(document.getElementById(controlsId)).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

```
npx vitest run src/components/ui/FaqAccordion.test.tsx
```

Expected: FAIL — `aria-expanded` not present, `aria-controls` not present.

- [ ] **Step 3: Update FaqAccordion.tsx**

Replace the entire file:

```tsx
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
      {items.map((item, i) => {
        const panelId = `faq-panel-${i}`
        const isOpen = openIndex === i
        return (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between py-4 text-left text-text-primary font-medium hover:text-gold transition-colors"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span>{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gold text-xl ml-4 flex-shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-label={item.q}
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
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```
npx vitest run src/components/ui/FaqAccordion.test.tsx
```

Expected: all 9 tests pass (6 existing + 3 new).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/FaqAccordion.tsx src/components/ui/FaqAccordion.test.tsx
git commit -m "fix(a11y): add aria-expanded, aria-controls to FaqAccordion; add tests"
```

---

### Task 4: JogosSchedule filter buttons aria-pressed

**Files:**
- Modify: `src/components/sections/JogosSchedule.tsx`
- Modify: `src/components/sections/JogosSchedule.test.tsx`

- [ ] **Step 1: Write failing test**

Open `src/components/sections/JogosSchedule.test.tsx`. Add this test inside the existing describe block:

```tsx
  it('active filter button has aria-pressed=true, others aria-pressed=false', () => {
    render(<JogosSchedule />)
    const allBtn = screen.getByRole('button', { name: /todos/i })
    const groupBtn = screen.getByRole('button', { name: /fase de grupos/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'true')
    expect(groupBtn).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(groupBtn)
    expect(allBtn).toHaveAttribute('aria-pressed', 'false')
    expect(groupBtn).toHaveAttribute('aria-pressed', 'true')
  })
```

Note: the existing JogosSchedule.test.tsx already has vi.mock('next-intl') returning translations. Verify the mock returns `filter_all: 'Todos'` and `filter_grupos: 'Fase de Grupos'` — if so, the `getByRole` queries above will match.

- [ ] **Step 2: Run to verify it fails**

```
npx vitest run src/components/sections/JogosSchedule.test.tsx
```

Expected: FAIL — `aria-pressed` not present on filter buttons.

- [ ] **Step 3: Add aria-pressed to filter buttons in JogosSchedule.tsx**

Find the filter buttons block (lines 65-77). Change:

```tsx
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
              filter === f.key
                ? 'bg-green-pt text-bg-primary shadow-[0_0_20px_rgba(94,166,59,0.4)]'
                : 'border border-white/15 text-text-muted hover:border-green-pt/40 hover:text-green-pt'
            }`}
          >
            {f.label}
          </button>
        ))}
```

To:

```tsx
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            aria-pressed={filter === f.key}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
              filter === f.key
                ? 'bg-green-pt text-bg-primary shadow-[0_0_20px_rgba(94,166,59,0.4)]'
                : 'border border-white/15 text-text-muted hover:border-green-pt/40 hover:text-green-pt'
            }`}
          >
            {f.label}
          </button>
        ))}
```

- [ ] **Step 4: Run tests**

```
npx vitest run src/components/sections/JogosSchedule.test.tsx
```

Expected: all tests pass including the new one.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/JogosSchedule.tsx src/components/sections/JogosSchedule.test.tsx
git commit -m "fix(a11y): add aria-pressed to JogosSchedule filter buttons; add test"
```

---

### Task 5: Galeria photo grid — div to button

**Files:**
- Modify: `src/components/sections/Galeria.tsx`

The `motion.div` that opens the lightbox (lines 38-85) is not keyboard-accessible. Replace it with a `motion.button`.

- [ ] **Step 1: Update Galeria.tsx**

Find the outer `motion.div` for each photo (lines 38-86). Change:

```tsx
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover="hover"
            className="relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={() => setLightboxIndex(i)}
          >
```

To:

```tsx
          <motion.button
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover="hover"
            className="relative group cursor-pointer rounded-xl overflow-hidden w-full text-left"
            onClick={() => setLightboxIndex(i)}
            aria-label={`Abrir foto: ${photo.alt}`}
            type="button"
          >
```

And close with `</motion.button>` instead of `</motion.div>`.

The full updated section (lines 38-86 after the change):

```tsx
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover="hover"
            className="relative group cursor-pointer rounded-xl overflow-hidden w-full text-left"
            onClick={() => setLightboxIndex(i)}
            aria-label={`Abrir foto: ${photo.alt}`}
            type="button"
          >
            <motion.div
              variants={{ hover: { scale: 1.05 } }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full"
            >
              <Image src={photo.src} alt={photo.alt} width={600} height={400} className="w-full object-cover" />
            </motion.div>

            {/* Overlay */}
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2"
            >
              {/* Expand icon with bounce */}
              <motion.div
                variants={{ hover: { scale: 1, opacity: 1 } }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1h5M1 1v5M15 1h-5M15 1v5M1 15h5M1 15v-5M15 15h-5M15 15v-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.div>

              {/* Caption slides up */}
              <motion.p
                variants={{ hover: { y: 0, opacity: 1 } }}
                initial={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-white text-xs uppercase tracking-widest text-center px-4"
              >
                {photo.alt}
              </motion.p>
            </motion.div>
          </motion.button>
        ))}
```

- [ ] **Step 2: Run tests**

```
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Galeria.tsx
git commit -m "fix(a11y): change gallery photo div to button for keyboard accessibility"
```

---

### Task 6: CountdownTimer aria-live

**Files:**
- Modify: `src/components/ui/CountdownTimer.tsx`

- [ ] **Step 1: Update CountdownTimer.tsx**

The live countdown `<div>` at line 66 that wraps the FlipUnit components needs `aria-live="polite"` and `aria-atomic="true"` so screen readers announce the updating time. The loading skeleton and "started" states do not need aria-live.

Find the return statement at line 65 (the main countdown, not the skeleton or the "started" indicator):

```tsx
  return (
    <div className="flex items-center gap-4 md:gap-6">
```

Change to:

```tsx
  return (
    <div
      className="flex items-center gap-4 md:gap-6"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Contagem decrescente para o evento"
    >
```

- [ ] **Step 2: Run tests**

```
npx vitest run
```

Expected: all tests pass. (CountdownTimer is excluded from coverage and has no direct tests — this is a pure accessibility annotation.)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CountdownTimer.tsx
git commit -m "fix(a11y): add aria-live=polite to CountdownTimer for screen reader updates"
```

---

### Task 7: Hero video aria-label

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Update Hero.tsx**

The `<video>` element at line 45 has no accessible label. It is a decorative background video but contains meaningful context (event atmosphere). Add `aria-label` to describe it:

Find:

```tsx
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/01_Sofia_ConcertoValeSilencio_0609_16x9.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://phwtscjrqihtamdy.public.blob.vercel-storage.com/122965-726547934-fGrPQAr0RXA9c69k7WRaFODMAmxUK9.mp4"
        />
```

Replace with:

```tsx
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/01_Sofia_ConcertoValeSilencio_0609_16x9.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://phwtscjrqihtamdy.public.blob.vercel-storage.com/122965-726547934-fGrPQAr0RXA9c69k7WRaFODMAmxUK9.mp4"
          aria-label="Vídeo de ambiente do evento Goalfest Lisboa"
        />
```

- [ ] **Step 2: Run tests**

```
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "fix(a11y): add aria-label to Hero background video"
```

---

### Task 8: Remove dead filter_portugal translation key

**Files:**
- Modify: `messages/pt.json`
- Modify: `messages/en.json`

The key `jogos.filter_portugal` exists in both message files but is not used anywhere in the codebase. `JogosSchedule.tsx` only uses `filter_all`, `filter_grupos`, and `filter_eliminatorias`. The `applyFilter` function in `matchFilters.ts` still supports the `'portugal'` filter but it is not exposed in the UI anymore.

- [ ] **Step 1: Remove from messages/pt.json**

Find in `messages/pt.json` inside the `"jogos"` object:

```json
    "filter_portugal": "Portugal",
```

Delete that line (including the trailing comma on the previous line if needed to keep valid JSON).

The `"jogos"` section after removal:

```json
  "jogos": {
    "title": "Calendário de Jogos",
    "subtitle": "Programação",
    "heading": "Jogos Transmitidos",
    "count": "+50 jogos ao vivo · FIFA World Cup 2026",
    "tba": "A definir",
    "back": "Voltar ao início",
    "filter_all": "Todos",
    "filter_grupos": "Fase de Grupos",
    "filter_eliminatorias": "Eliminatórias",
    "live_badge": "AO VIVO",
    "phase_grupo": "Fase de Grupos",
    "phase_oitavos": "Oitavos de Final",
    "phase_quartos": "Quartos de Final",
    "phase_meias": "Meias-Finais",
    "phase_final": "Final"
  },
```

- [ ] **Step 2: Remove from messages/en.json**

Find in `messages/en.json` inside the `"jogos"` object:

```json
    "filter_portugal": "Portugal",
```

Delete that line. The `"jogos"` section after removal:

```json
  "jogos": {
    "title": "Match Schedule",
    "subtitle": "Schedule",
    "heading": "Broadcast Matches",
    "count": "+50 matches live · FIFA World Cup 2026",
    "tba": "TBA",
    "back": "Back to home",
    "filter_all": "All",
    "filter_grupos": "Group Stage",
    "filter_eliminatorias": "Knockouts",
    "live_badge": "LIVE",
    "phase_grupo": "Group Stage",
    "phase_oitavos": "Round of 16",
    "phase_quartos": "Quarter-Finals",
    "phase_meias": "Semi-Finals",
    "phase_final": "Final"
  },
```

- [ ] **Step 3: Run tests**

```
npx vitest run
```

Expected: all tests pass. (The matchFilters.test.ts tests for the `'portugal'` filter still pass because they import `applyFilter` directly from `matchFilters.ts`, which is unaffected by the message removal.)

- [ ] **Step 4: Commit**

```bash
git add messages/pt.json messages/en.json
git commit -m "chore: remove unused jogos.filter_portugal translation key"
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|------------|------|
| focus-visible styles in globals.css | Task 1 |
| skip-to-content link in layout | Task 1 |
| Remove generateStaticParams (architecture) | Task 1 |
| PhotoLightbox icon buttons aria-labels | Task 2 |
| FaqAccordion aria-expanded + aria-controls | Task 3 |
| JogosSchedule filter buttons aria-pressed | Task 4 |
| Galeria div to button | Task 5 |
| CountdownTimer aria-live | Task 6 |
| Hero video aria-label | Task 7 |
| Remove dead filter_portugal key | Task 8 |

All requirements covered.

**Placeholder scan:** No TBDs, no "implement later", no vague steps. All code blocks are complete.

**Type consistency:** No new types introduced. `aria-expanded` accepts `boolean` in React — `isOpen` is `boolean`. `aria-pressed` accepts `boolean` — `filter === f.key` is `boolean`. Consistent throughout.
