export function formatMatchDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Lisbon',
  }).format(date)
}
