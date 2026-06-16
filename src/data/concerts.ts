// ────────────────────────────────────────────────────────────────────────────
// CONCERTOS / ARTISTAS — espelho de schedule.ts
//
// Ainda NÃO há artistas confirmados, por isso o array CONCERTS está VAZIO.
// A secção e a página tratam disso e mostram o estado "Line-up em breve".
//
// COMO ADICIONAR UM ARTISTA:
// Acrescenta um objeto ao array CONCERTS (em baixo), seguindo este formato.
// Nomes, datas e horas NÃO se traduzem — vivem só aqui neste ficheiro.
//
//   {
//     artist: 'NOME DO ARTISTA',   // obrigatório
//     date: '2026-06-17',          // obrigatório · formato YYYY-MM-DD (igual a schedule.ts)
//     displayDate: '17 Jun',       // obrigatório · como aparece no ecrã
//     startTime: '22H',            // obrigatório · hora de início (formato igual aos jogos: "22H")
//     endTime: '23H30',            // opcional   · hora de fim
//     stage: 'Palco Principal',    // opcional   · palco / local
//     image: '/concerts/nome.jpg', // opcional   · foto do artista (em /public)
//   },
//
// Exemplo (comentado — descomenta e edita, ou copia o formato acima):
//   {
//     artist: 'ARTISTA EXEMPLO — substituir',
//     date: '2026-06-17',
//     displayDate: '17 Jun',
//     startTime: '22H',
//   },
// ────────────────────────────────────────────────────────────────────────────

export interface Concert {
  artist: string
  date: string
  displayDate: string
  startTime: string
  endTime?: string
  stage?: string
  image?: string
}

export const CONCERTS: Concert[] = [
  { artist: 'KissCam Party',    date: '2026-06-13', displayDate: '13 Jun', startTime: 'Em breve', image: '/headliners/Kisscamparty.png' },
  { artist: 'DJ Rúben da Cruz', date: '2026-06-17', displayDate: '17 Jun', startTime: 'Em breve', image: '/headliners/ruben-da-cruz.jpeg' },
  { artist: 'DJ Overule',       date: '2026-06-20', displayDate: '20 Jun', startTime: 'Em breve', image: '/headliners/dj_overule137073cedefaultlarge_1024.jpg' },
  { artist: 'Ben Colton',       date: '2026-06-25', displayDate: '25 Jun', startTime: 'Em breve', image: '/headliners/bencolton.jpg' },
  { artist: 'DJ Marques',       date: '2026-06-26', displayDate: '26 Jun', startTime: 'Em breve', image: '/headliners/dj-marques.jpg' },
]
