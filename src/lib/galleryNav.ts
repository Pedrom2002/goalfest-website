export function galleryNext(index: number, total: number): number {
  return (index + 1) % total
}

export function galleryPrev(index: number, total: number): number {
  return (index - 1 + total) % total
}
