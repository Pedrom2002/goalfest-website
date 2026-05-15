export const TARGET = new Date('2026-06-11T15:00:00Z')

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function calcTimeLeft(): TimeLeft | 'started' {
  const diff = TARGET.getTime() - Date.now()
  if (diff <= 0) return 'started'
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}
