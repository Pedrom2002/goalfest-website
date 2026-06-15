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
    date: '2026-06-15',
    displayDate: '15 Jun',
    dayLabel: { pt: 'Segunda', en: 'Monday' },
    events: [
      { time: '11H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '15H', title: 'DJ Ricardo Mata', type: 'dj' },
      { time: '16H30', title: 'Live Talk com José Váz', type: 'atividade' },
      { time: '17H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Espanha x Cabo Verde' },
      { time: '19H', title: 'DJ Nuno Dji', type: 'dj' },
      { time: '20H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Bélgica x Egito' },
      { time: '23H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
]
