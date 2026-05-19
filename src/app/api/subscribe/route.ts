import { NextRequest } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { Resend } from 'resend'

const DATA_PATH = resolve(process.cwd(), 'src/data/subscribers.json')

function loadSubscribers(): { email: string; subscribedAt: string }[] {
  try {
    return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return []
  }
}

function saveSubscribers(list: { email: string; subscribedAt: string }[]) {
  writeFileSync(DATA_PATH, JSON.stringify(list, null, 2))
}

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const subscribers = loadSubscribers()

  if (subscribers.some((s) => s.email === email)) {
    return Response.json({ error: 'This email is already subscribed.' }, { status: 409 })
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() })
  saveSubscribers(subscribers)

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  if (apiKey && fromEmail) {
    const resend = new Resend(apiKey)
    const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'You\'re subscribed — welcome aboard',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d0d0d;color:#f5f5f5;padding:40px 32px;border-radius:8px;">
          <h1 style="margin:0 0 16px;font-size:24px;color:#FFD700;">You're in.</h1>
          <p style="margin:0 0 12px;line-height:1.6;color:#d1d5db;">
            Thanks for subscribing. You'll hear from us when there's something worth reading.
          </p>
          <p style="margin:0 0 32px;line-height:1.6;color:#d1d5db;">No spam. Unsubscribe any time.</p>
          <hr style="border:none;border-top:1px solid #2a2a2a;margin:0 0 24px;" />
          <p style="margin:0;font-size:12px;color:#6b7280;">
            <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
          </p>
        </div>
      `,
    })
  }

  return Response.json({ success: true })
}
