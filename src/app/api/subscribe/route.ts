import { NextRequest } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { sendNewsletterWelcome } from '@/lib/email'

const DATA_PATH = resolve(process.cwd(), 'src/data/subscribers.json')

type Subscriber = { email: string; subscribedAt: string }

function loadSubscribers(): Subscriber[] {
  try {
    return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return []
  }
}

function saveSubscribers(list: Subscriber[]) {
  writeFileSync(DATA_PATH, JSON.stringify(list, null, 2))
}

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const normalized = email.trim().toLowerCase()
  const subscribers = loadSubscribers()

  if (subscribers.some((s) => s.email.toLowerCase() === normalized)) {
    return Response.json({ error: 'This email is already subscribed.' }, { status: 409 })
  }

  subscribers.push({ email: normalized, subscribedAt: new Date().toISOString() })
  saveSubscribers(subscribers)

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
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
