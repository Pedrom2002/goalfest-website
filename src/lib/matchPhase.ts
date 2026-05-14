export type PhaseKey = 'group' | 'knockout'

const GROUP_END = new Date('2026-06-27').getTime()
const R16_END = new Date('2026-07-07').getTime()
const QF_END = new Date('2026-07-11').getTime()
const SF_END = new Date('2026-07-15').getTime()

export function phaseOf(date: string): PhaseKey {
  return new Date(date).getTime() <= GROUP_END ? 'group' : 'knockout'
}

export function phaseLabel(date: string, locale: 'pt' | 'en'): string {
  const d = new Date(date).getTime()
  const isPt = locale === 'pt'
  if (d <= GROUP_END) return isPt ? 'Fase de Grupos' : 'Group Stage'
  if (d <= R16_END) return isPt ? 'Oitavos de Final' : 'Round of 16'
  if (d <= QF_END) return isPt ? 'Quartos de Final' : 'Quarter-Finals'
  if (d <= SF_END) return isPt ? 'Meias-Finais' : 'Semi-Finals'
  return 'Final'
}
