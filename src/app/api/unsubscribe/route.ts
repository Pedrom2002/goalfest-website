import { NextRequest } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

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

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return Response.json({ error: 'Email is required.' }, { status: 400 })
  }

  const subscribers = loadSubscribers()
  const index = subscribers.findIndex((s) => s.email === email)

  if (index === -1) {
    return Response.json({ error: 'Email not found.' }, { status: 404 })
  }

  subscribers.splice(index, 1)
  saveSubscribers(subscribers)

  return Response.json({ success: true })
}
