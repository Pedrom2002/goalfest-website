import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'
import { sendNewsletterWelcome } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request)
  const rl = await rateLimit(`subscribe:${ip}`, 5, 60_000)
  if (!rl.ok) {
    return Response.json(
      { error: 'Demasiados pedidos. Tenta novamente em breve.' },
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
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const normalized = email.trim().toLowerCase()
  const db = supabaseAdmin()

  // Upsert pattern: try insert, on unique conflict re-activate if soft-unsubscribed.
  const { data: existing, error: selErr } = await db
    .from('newsletter_subscribers')
    .select('id, unsubscribed_at')
    .ilike('email', normalized)
    .maybeSingle()

  if (selErr) {
    console.error('[subscribe] select failed', selErr)
    return Response.json({ error: 'Erro do servidor.' }, { status: 500 })
  }

  if (existing) {
    if (existing.unsubscribed_at === null) {
      return Response.json({ error: 'This email is already subscribed.' }, { status: 409 })
    }
    const { error: updErr } = await db
      .from('newsletter_subscribers')
      .update({ unsubscribed_at: null, subscribed_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (updErr) {
      console.error('[subscribe] reactivate failed', updErr)
      return Response.json({ error: 'Erro do servidor.' }, { status: 500 })
    }
  } else {
    const { error: insErr } = await db
      .from('newsletter_subscribers')
      .insert({ email: normalized })
    if (insErr) {
      console.error('[subscribe] insert failed', insErr)
      return Response.json({ error: 'Erro do servidor.' }, { status: 500 })
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(normalized)}`

  if (process.env.BREVO_API_KEY) {
    try {
      await sendNewsletterWelcome({ to: normalized, unsubscribeUrl })
    } catch (err) {
      console.error('[subscribe] welcome email failed', err)
    }
  }

  return Response.json({ success: true })
}
