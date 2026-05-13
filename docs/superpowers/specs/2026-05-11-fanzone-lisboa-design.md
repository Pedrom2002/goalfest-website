# Fanzone Lisboa 2026 - Design Spec

## Context

Evento público em Lisboa para ver o Mundial de Futebol 2026. Website serve como presença online do evento: atrair adeptos, mostrar calendário de jogos transmitidos, permitir reserva de lugar, e comunicar localização e informações práticas.

---

## Stack

| Tecnologia | Uso |
|---|---|
| Next.js 15 (App Router) | Framework principal |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animações |
| next-intl | Internacionalização PT/EN |
| Resend ou Formspree | Envio de formulário de bilhetes |
| Mapbox GL JS | Mapa interactivo |
| Vercel | Deploy + CDN |

---

## Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `bg-primary` | `#0d0d0d` | Fundo principal |
| `bg-surface` | `#1a1a1a` | Cards, superfícies elevadas |
| `gold` | `#FFD700` | Cor de destaque primária |
| `red-pt` | `#C8102E` | Vermelho Portugal, CTAs |
| `green-pt` | `#006600` | Accents secundários |
| `text-primary` | `#F5F5F5` | Texto principal |
| `text-muted` | `#9CA3AF` | Texto secundário |

---

## Arquitectura de Rotas

```
/                     ← Landing SPA (scroll por secções)
  #hero               ← Countdown + CTAs
  #jogos              ← Calendário de jogos
  #venue              ← Local + mapa
  #galeria            ← Fotos
  #sponsors           ← Patrocinadores
/bilhetes             ← Formulário de reserva
/faq                  ← Perguntas frequentes
```

i18n via next-intl middleware: `/pt/...` e `/en/...`. Default PT.

---

## Estrutura de Ficheiros

```
src/
  app/
    [locale]/
      page.tsx              ← Landing (SPA)
      bilhetes/page.tsx
      faq/page.tsx
      layout.tsx
  components/
    layout/
      Navbar.tsx
      Footer.tsx
    sections/
      Hero.tsx
      Jogos.tsx
      Venue.tsx
      Galeria.tsx
      Sponsors.tsx
    ui/
      CountdownTimer.tsx
      MatchCard.tsx
      PhotoLightbox.tsx
      FaqAccordion.tsx
      TicketsForm.tsx
  data/
    matches.json            ← Dados dos jogos (estático)
    faq.json                ← Perguntas e respostas
    sponsors.json           ← Logos e nomes
  messages/
    pt.json                 ← Strings PT
    en.json                 ← Strings EN
  lib/
    utils.ts
```

---

## Secções

### 1. Navbar

- Fixa no topo, fundo transparente que transita para `bg-primary/95 backdrop-blur` ao scroll
- Logo esquerda
- Links centro: Jogos / Venue / Galeria / FAQ / Bilhetes
- Toggle PT/EN direita
- Mobile: hamburger menu com drawer animado

### 2. Hero

- Full-viewport (`min-h-screen`)
- Fundo: `#0d0d0d` com partículas flutuantes (Framer Motion, elementos subtis)
- Centro: Logo da Fanzone + subtítulo "Lisboa · Mundial 2026"
- Countdown em tempo real para 11 Jun 2026 (início do Mundial): formato `DD HH MM SS` com flip animation
- Dois CTAs: "Reservar Lugar" (link `/bilhetes`, cor `red-pt`) e "Ver Jogos" (scroll para `#jogos`, cor `gold`)
- Entrada: logo fade+scale, countdown slide-up, CTAs fade-in em stagger

### 3. Calendário de Jogos

- Secção `#jogos`
- Dados de `/data/matches.json`:
  ```json
  {
    "id": "m1",
    "home": { "name": "Portugal", "flag": "🇵🇹" },
    "away": { "name": "Brasil", "flag": "🇧🇷" },
    "date": "2026-06-15T19:00:00",
    "phase": "grupo",
    "status": "upcoming"
  }
  ```
- `status`: `upcoming` / `live` / `finished`
- Grid de cards, 3 colunas desktop / 1 mobile
- Filtros: tabs "Todos" / "Grupos" / "Eliminatórias" / "Portugal"
- Card: bandeiras, data/hora, fase, badge "AO VIVO" (pulse vermelho) se `live`
- Cards `finished` com opacidade 50%
- Animação: stagger ao entrar em viewport, hover scale + glow dourado

### 4. Venue + Mapa

- Secção `#venue`
- Split 50/50 desktop (stack vertical mobile)
- Esquerda: nome do local, morada, capacidade, ícones do que está incluído (ecrãs grandes, food & drink, zonas cobertas)
- Direita: Mapbox GL JS com marker customizado da fanzone
- Info cards abaixo: Transportes / Estacionamento / Acessibilidade / Horários
- Animação: esquerda slide-in-left, direita slide-in-right ao entrar viewport

### 5. Galeria

- Secção `#galeria`
- Masonry grid (CSS columns ou biblioteca `react-masonry-css`)
- Fotos inicialmente de Unsplash (tema futebol/Lisboa)
- Click: lightbox full-screen com blur de fundo, navegação por setas, swipe em mobile
- Hover: overlay escuro com ícone expand
- Animação: fade+scale stagger ao scroll

### 6. Patrocinadores

- Faixa horizontal
- Tier 1 "Patrocinador Principal": logo grande, centrado
- Tier 2 "Parceiros": row de logos menores
- Logos grayscale por defeito, cor ao hover
- Se >6 logos: carousel auto-scroll animado

### 7. Footer

- Links rápidos, redes sociais, copyright, toggle de língua

---

## Página `/bilhetes`

- Formulário centrado em página própria
- Campos: Nome, Email, Nº de bilhetes (1-10), Jogo(s) pretendido(s) (checklist gerada do `matches.json`), Mensagem opcional
- Submit: POST para Formspree ou Resend API
- Feedback: loading spinner durante envio, mensagem de sucesso animada (Framer Motion)
- Sem pagamento nesta fase (mockup de reserva)

---

## Página `/faq`

- Accordion. Dados de `/data/faq.json`
- Ícone `+` roda para `×` ao expandir
- Painel com spring animation (`AnimatePresence` Framer Motion)
- Categorias: Entradas / Local / Comida & Bebida / Regras / Acessibilidade

---

## Internacionalização

- `next-intl` com middleware de detecção automática de língua
- Ficheiros `/messages/pt.json` e `/messages/en.json`
- Datas e horas formatadas com `Intl.DateTimeFormat` para timezone Europe/Lisbon
- Toggle PT/EN na Navbar persiste em cookie

---

## Animações (Framer Motion)

| Elemento | Animação |
|---|---|
| Hero logo | fade + scale ao mount |
| Countdown dígitos | flip (rotateX) na mudança |
| Secções | fade + translateY ao entrar viewport |
| Match cards | stagger 0.1s, hover scale(1.03) |
| Lightbox | fade + blur backdrop |
| FAQ accordion | AnimatePresence height spring |
| Navbar | background opacity ao scroll |
| Mobile drawer | slide-in-right |

---

## Performance

- Imagens: `next/image` com lazy loading e formatos WebP/AVIF
- Fonts: `next/font` (Google Fonts, subset PT)
- Dados estáticos (matches, faq, sponsors): JSON local, sem API calls
- SSG por defeito em todas as rotas (sem `dynamic = 'force-dynamic'` excepto form submit)

---

## Verificação (como testar)

1. `npm run dev` - verificar todas as secções no browser
2. Countdown: verificar que conta correctamente para 11 Jun 2026
3. Filtros de jogos: verificar que filtram correctamente por fase/equipa
4. Formulário de bilhetes: submeter e verificar recepção de email
5. Lightbox: abrir foto, navegar, fechar com ESC
6. i18n: alternar PT/EN e verificar todas as strings
7. Mobile: verificar responsive em 375px (iPhone SE) e 768px (tablet)
8. `npm run build` - sem erros de TypeScript ou build
9. Deploy Vercel: verificar que todas as rotas resolvem em produção
