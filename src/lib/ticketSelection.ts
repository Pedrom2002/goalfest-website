export function toggleMatch(prev: string[], id: string): string[] {
  return prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
}
