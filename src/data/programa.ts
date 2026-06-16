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
]
