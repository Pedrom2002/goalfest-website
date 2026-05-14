---
name: project-cleanup-2026-05-14
description: Limpeza da base do projeto Fanzone - public/, código morto, estrutura src/
metadata:
  type: project
---

# Project Cleanup - Fanzone Lisboa

## Scope

Three cleanup passes on the existing codebase. No feature changes, no refactoring beyond removing dead code.

---

## 1. public/ Cleanup

**Delete dev screenshots from repo root:**
- `footer-check.png`, `footer-visible.png`, `footer2.png`
- `venue-final.png`, `venue-hero.png`, `venue-section.png`, `venue-top.png`, `venue2.png`, `venue3.png`

**Confirm staged deletions** (already `D` in git):
- `public/LOGO FINAL- Mundial (1).png`
- `public/LOGO ORIGINAL.png`
- `public/goalfest_clean.png`, `goalfest_dual_mask.png`, `goalfest_no_faded.png`, `goalfest_perfect.png`, `goalfest_refined_v2.png`, `goalfest_ultra.png`
- `public/image.png`

---

## 2. Dead Code in src/

**`src/app/[locale]/page.tsx`:**
- Remove commented imports: `Jogos`, `Galeria`, `matchesData`, `Match`
- Remove commented JSX: `<Jogos>`, `<Galeria>`, their `<Divider />` wrappers
- Keep: active imports, active sections (Hero, WhatIsGoalfest, Venue, Sponsors, FaqSection)

**`VenueMap.tsx`:** Keep - Mapbox impl ready, just not wired yet. Not dead code.

---

## 3. Structure Check

- `messages/` at repo root (not `src/messages/`) - valid for next-intl, no change needed
- `src/` structure matches the implementation plan - no moves required

---

## Decisions

| Item | Decision |
|---|---|
| Dev screenshots | Delete |
| Commented Jogos/Galeria imports | Remove |
| VenueMap.tsx (unused but complete) | Keep |
| messages/ location | Keep at root |
