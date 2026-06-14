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
    date: '2026-06-14',
    displayDate: '14 Jun',
    dayLabel: { pt: 'Domingo', en: 'Sunday' },
    events: [
      { time: '11H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '11H', title: 'Jogos Tradicionais', type: 'atividade' },
      { time: '12H', title: 'Troca de Cromos do Mundial', type: 'atividade' },
      { time: '15H', title: 'DJ Johny', type: 'dj' },
      { time: '18H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Alemanha x Curaçao' },
      { time: '21H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Holanda x Japão' },
      { time: '23H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
]
