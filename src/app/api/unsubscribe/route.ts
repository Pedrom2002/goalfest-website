import { NextRequest } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

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

function removeEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  const subs = loadSubscribers()
  const next = subs.filter((s) => s.email.toLowerCase() !== normalized)
  if (next.length === subs.length) return false
  saveSubscribers(next)
  return true
}

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Invalid email.' }, { status: 400 })
  }
  removeEmail(email)
  return Response.json({ success: true })
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  if (!email) {
    return Response.json({ error: 'Email is required.' }, { status: 400 })
  }
  const removed = removeEmail(email)
  if (!removed) {
    return Response.json({ error: 'Email not found.' }, { status: 404 })
  }
  return Response.json({ success: true })
}
