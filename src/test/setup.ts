import '@testing-library/jest-dom/vitest'

global.IntersectionObserver = class IntersectionObserver {
  observe() { return undefined }
  unobserve() { return undefined }
  disconnect() { return undefined }
} as unknown as typeof IntersectionObserver

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})
