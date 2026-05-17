import scheduleData from './schedule.json'

export interface BroadcastMatch {
  time: string
  home: string
  away: string
}

export interface BroadcastDay {
  date: string
  displayDate: string
  matches: BroadcastMatch[]
  artists: string[]
}

export const SCHEDULE: BroadcastDay[] = scheduleData as BroadcastDay[]
