import { GET } from './route'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}))

describe('GET /api/health', () => {
  const originalBrevo = process.env.BREVO_API_KEY

  beforeEach(() => {
    process.env.BREVO_API_KEY = 'test-key'
  })

  afterEach(() => {
    process.env.BREVO_API_KEY = originalBrevo
  })

  it('returns 200', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
  })

  it('returns ok true', async () => {
    const res = await GET()
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  it('returns a ts ISO string', async () => {
    const res = await GET()
    const body = await res.json()
    expect(new Date(body.ts).toISOString()).toBe(body.ts)
  })

  it('sets Cache-Control: no-store', async () => {
    const res = await GET()
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })
})
