import { vi } from 'vitest'

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: () => ({
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve({ error: null }),
      }),
    }),
  }),
}))

const { GET } = await import('./route')

describe('GET /api/health', () => {
  beforeAll(() => {
    process.env.BREVO_API_KEY = 'test-key'
  })

  it('returns 200 when all checks ok', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
  })

  it('returns ok=true and checks', async () => {
    const res = await GET()
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.checks).toEqual({ supabase: 'ok', email: 'ok' })
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
