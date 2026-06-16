export type ProgramaEventType =
  | 'abertura'
  | 'encerramento'
  | 'dj'
  | 'concerto'
  | 'jogo'
  | 'atividade'

export interface ProgramaEvent {
  time: string
  title: string
  type: ProgramaEventType
  detail?: string
}

export interface ProgramaDay {
  date: string
  displayDate: string
  dayLabel: { pt: string; en: string }
  events: ProgramaEvent[]
}

export const PROGRAMA: ProgramaDay[] = [
  {
    date: '2026-06-16',
    displayDate: '16 Jun',
    dayLabel: { pt: 'Terça', en: 'Tuesday' },
    events: [
      { time: '18H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '19H', title: 'DJ Bomboca', type: 'dj' },
      { time: '20H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'França x Senegal' },
      { time: '22H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
  {
    date: '2026-06-17',
    displayDate: '17 Jun',
    dayLabel: { pt: 'Quarta', en: 'Wednesday' },
    events: [
      { time: '15H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '18H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Portugal x R.D. Congo' },
      { time: '20H', title: 'DJ Rúben da Cruz', type: 'dj' },
      { time: '21H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Inglaterra x Croácia' },
      { time: '23H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
  {
    date: '2026-06-18',
    displayDate: '18 Jun',
    dayLabel: { pt: 'Quinta', en: 'Thursday' },
    events: [
      { time: '15H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '17H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'República Checa x África do Sul' },
      { time: '19H', title: 'DJ Johny', type: 'dj' },
      { time: '20H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Suíça x Bósnia' },
      { time: '22H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
  {
    date: '2026-06-19',
    displayDate: '19 Jun',
    dayLabel: { pt: 'Sexta', en: 'Friday' },
    events: [
      { time: '15H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '20H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'EUA x Austrália' },
      { time: '22H', title: 'Concerto a anunciar', type: 'concerto' },
      { time: '23H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Escócia x Marrocos' },
      { time: '02H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
  {
    date: '2026-06-20',
    displayDate: '20 Jun',
    dayLabel: { pt: 'Sábado', en: 'Saturday' },
    events: [
      { time: '11H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '18H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Holanda x Suécia' },
      { time: '21H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Alemanha x Costa do Marfim' },
      { time: '23H', title: 'DJ Overule', type: 'dj' },
      { time: '02H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
  {
    date: '2026-06-21',
    displayDate: '21 Jun',
    dayLabel: { pt: 'Domingo', en: 'Sunday' },
    events: [
      { time: '11H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '17H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Espanha x Arábia Saudita' },
      { time: '19H', title: 'DJ Johny', type: 'dj' },
      { time: '20H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Bélgica x Irão' },
      { time: '22H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
]
