import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

async function removeEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase()
  if (!EMAIL_RE.test(normalized)) return false
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('newsletter_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .ilike('email', normalized)
    .is('unsubscribed_at', null)
    .select('id')
  if (error) {
    console.error('[unsubscribe] update failed', error)
    return false
  }
  return (data?.length ?? 0) > 0
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request)
  const rl = await rateLimit(`unsubscribe:${ip}`, 10, 60_000)
  if (!rl.ok) {
    return Response.json(
      { error: 'Demasiados pedidos.' },
      { status: 429, headers: { 'retry-after': String(rl.retryAfterSeconds) } },
    )
  }
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 })
  }
  const email = (body as { email?: unknown })?.email
  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Invalid email.' }, { status: 400 })
  }
  // Always 200 (avoid email enumeration).
  await removeEmail(email)
  return Response.json({ success: true })
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request)
  const rl = await rateLimit(`unsubscribe:${ip}`, 10, 60_000)
  if (!rl.ok) {
    return Response.json(
      { error: 'Demasiados pedidos.' },
      { status: 429, headers: { 'retry-after': String(rl.retryAfterSeconds) } },
    )
  }
  const email = request.nextUrl.searchParams.get('email')
  if (!email) {
    return Response.json({ error: 'Email is required.' }, { status: 400 })
  }
  await removeEmail(email)
  return Response.json({ success: true })
}
