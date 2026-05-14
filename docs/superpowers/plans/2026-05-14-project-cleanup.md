# Project Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove dev artifacts, dead code, and untracked screenshot files from the Fanzone Lisboa repo.

**Architecture:** Three sequential cleanup passes - (1) delete untracked dev screenshots from repo root, (2) stage and commit already-deleted public/ assets, (3) remove commented-out dead code from `src/app/[locale]/page.tsx`.

**Tech Stack:** git, Next.js 15 (App Router)

---

## File Map

| File | Change |
|---|---|
| `footer-check.png` (root) | Delete |
| `footer-visible.png` (root) | Delete |
| `footer2.png` (root) | Delete |
| `venue-final.png` (root) | Delete |
| `venue-hero.png` (root) | Delete |
| `venue-section.png` (root) | Delete |
| `venue-top.png` (root) | Delete |
| `venue2.png` (root) | Delete |
| `venue3.png` (root) | Delete |
| `src/app/[locale]/page.tsx` | Remove 4 commented imports + commented JSX blocks for Jogos/Galeria |

---

## Task 1: Delete dev screenshots from repo root

**Files:**
- Delete: `footer-check.png`, `footer-visible.png`, `footer2.png`, `venue-final.png`, `venue-hero.png`, `venue-section.png`, `venue-top.png`, `venue2.png`, `venue3.png`

These are untracked (`??` in git status) - they were never committed, so removing them needs no git unstage step.

- [ ] **Step 1: Delete all dev screenshots**

```powershell
Remove-Item "c:\Users\P02\Downloads\Fanzone Website\footer-check.png",
            "c:\Users\P02\Downloads\Fanzone Website\footer-visible.png",
            "c:\Users\P02\Downloads\Fanzone Website\footer2.png",
            "c:\Users\P02\Downloads\Fanzone Website\venue-final.png",
            "c:\Users\P02\Downloads\Fanzone Website\venue-hero.png",
            "c:\Users\P02\Downloads\Fanzone Website\venue-section.png",
            "c:\Users\P02\Downloads\Fanzone Website\venue-top.png",
            "c:\Users\P02\Downloads\Fanzone Website\venue2.png",
            "c:\Users\P02\Downloads\Fanzone Website\venue3.png"
```

- [ ] **Step 2: Verify gone**

```powershell
git -C "c:\Users\P02\Downloads\Fanzone Website" status --short
```

Expected: none of the `?? *.png` entries appear at root level.

---

## Task 2: Stage already-deleted public/ assets and TicketsForm changes

**Files:**
- Already deleted (staged as `D`): `public/LOGO FINAL- Mundial (1).png`, `public/LOGO ORIGINAL.png`, `public/goalfest_clean.png`, `public/goalfest_dual_mask.png`, `public/goalfest_no_faded.png`, `public/goalfest_perfect.png`, `public/goalfest_refined_v2.png`, `public/goalfest_ultra.png`, `public/image.png`
- Modified: `next.config.ts`, `src/components/ui/TicketsForm.tsx`, `.gitignore`

These files show as unstaged modifications (`M`) or staged deletions (`D`). Stage everything and commit.

- [ ] **Step 1: Stage all pending changes**

```bash
cd "c:\Users\P02\Downloads\Fanzone Website"
git add -A
```

- [ ] **Step 2: Verify staging area**

```bash
git status --short
```

Expected: all files show as staged (`M`, `D`, or `A` in first column). No untracked files remain (screenshots deleted in Task 1).

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove old logos and dev screenshots, update config and tickets form"
```

---

## Task 3: Remove dead code from page.tsx

**Files:**
- Modify: `src/app/[locale]/page.tsx`

Remove 4 commented imports and the commented JSX sections for Jogos and Galeria (including their surrounding `<Divider />` wrappers). Keep all active sections untouched.

- [ ] **Step 1: Remove commented imports**

Open `src/app/[locale]/page.tsx`. Replace the import block at the top with the clean version below.

Current (lines 1-14):
```tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
// import Jogos from '@/components/sections/Jogos'
import Venue from '@/components/sections/Venue'
// import Galeria from '@/components/sections/Galeria'
import Sponsors from '@/components/sections/Sponsors'
import WhatIsGoalfest from '@/components/sections/WhatIsGoalfest'
import FaqSection from '@/components/sections/FaqSection'
// import matchesData from '@/data/matches.json'
import sponsorsData from '@/data/sponsors.json'
// import type { Match, SponsorsData } from '@/types'
import type { SponsorsData } from '@/types'
```

Replace with:
```tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Venue from '@/components/sections/Venue'
import Sponsors from '@/components/sections/Sponsors'
import WhatIsGoalfest from '@/components/sections/WhatIsGoalfest'
import FaqSection from '@/components/sections/FaqSection'
import sponsorsData from '@/data/sponsors.json'
import type { SponsorsData } from '@/types'
```

- [ ] **Step 2: Remove commented JSX in return block**

In the `return` block, replace the commented-out Jogos/Galeria sections. Current (lines 100-106):
```tsx
        <Divider />
        {/* <Jogos matches={matches} /> */}
        {/* <Divider /> */}
        {/* <Galeria /> */}
        {/* <Divider /> */}
        <Sponsors data={sponsors} />
```

Replace with:
```tsx
        <Divider />
        <Sponsors data={sponsors} />
```

- [ ] **Step 3: Verify build compiles**

```bash
cd "c:\Users\P02\Downloads\Fanzone Website" && npx next build 2>&1 | tail -20
```

Expected: build succeeds with no TypeScript errors. If errors appear, check that no active code referenced the removed imports.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "chore: remove commented Jogos/Galeria dead code from landing page"
```
