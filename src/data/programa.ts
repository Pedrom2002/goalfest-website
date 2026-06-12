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
    date: '2026-06-12',
    displayDate: '12 Jun',
    dayLabel: { pt: 'Sexta', en: 'Friday' },
    events: [
      { time: '15H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '18H', title: 'DJ Macalak', type: 'dj' },
      { time: '20H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Bósnia x Canadá' },
      { time: '22H', title: 'Pimba à Bruta', type: 'concerto' },
      { time: '24H', title: 'DJ Macalak', type: 'dj' },
      { time: '02H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
  {
    date: '2026-06-13',
    displayDate: '13 Jun',
    dayLabel: { pt: 'Sábado', en: 'Saturday' },
    events: [
      { time: '11H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '11H', title: 'Receção Alberto Lopes (Ingleses FC)', type: 'atividade', detail: 'Xadrez e Petanca feitos à mão' },
      { time: '11H', title: 'Jogos Tradicionais', type: 'atividade', detail: 'Zona Kids' },
      { time: '17H', title: 'Live Talk', type: 'atividade' },
      { time: '18H', title: 'DJ Johny', type: 'dj' },
      { time: '21H', title: 'KissCam Project', type: 'concerto' },
      { time: '23H', title: 'Transmissão ao Vivo', type: 'jogo', detail: 'Brasil x Marrocos' },
      { time: '01H', title: 'DJ Johny', type: 'dj' },
      { time: '02H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
  {
    date: '2026-06-14',
    displayDate: '14 Jun',
    dayLabel: { pt: 'Domingo', en: 'Sunday' },
    events: [
      { time: '11H', title: 'Abertura do Recinto', type: 'abertura' },
      { time: '11H', title: 'Jogos Tradicionais', type: 'atividade' },
      { time: '12H', title: 'Troca de Cromos do Mundial', type: 'atividade' },
      { time: '15H', title: 'DJ Johny', type: 'dj' },
      { time: '18H', title: 'Encerramento do Recinto', type: 'encerramento' },
    ],
  },
]
