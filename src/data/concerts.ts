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

export const CONCERTS: Concert[] = []
