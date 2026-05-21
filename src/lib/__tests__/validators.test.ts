import { describe, it, expect } from 'vitest'
import { rsvpSchema, inviteCreateSchema, inviteArchiveSchema, accreditationRsvpSchema } from '@/lib/validators'

const validRsvp = {
  name: 'Alice Silva',
  email: 'alice@example.com',
  phone: '912345678',
  acompanhante: 'nao' as const,
}

describe('rsvpSchema', () => {
  it('accepts a valid submission without companion', () => {
    const result = rsvpSchema.safeParse(validRsvp)
    expect(result.success).toBe(true)
  })

  it('accepts a valid submission with companion', () => {
    const result = rsvpSchema.safeParse({
      ...validRsvp,
      acompanhante: 'sim',
      companion_nome: 'Bob Costa',
      companion_tel: '923456789',
      companion_email: 'bob@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a name that is too short', () => {
    const result = rsvpSchema.safeParse({ ...validRsvp, name: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = rsvpSchema.safeParse({ ...validRsvp, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid PT phone number', () => {
    const result = rsvpSchema.safeParse({ ...validRsvp, phone: '123456789' })
    expect(result.success).toBe(false)
  })

  it('accepts PT phone with country code', () => {
    const result = rsvpSchema.safeParse({ ...validRsvp, phone: '+351912345678' })
    expect(result.success).toBe(true)
  })

  it('requires companion fields when acompanhante is sim', () => {
    const result = rsvpSchema.safeParse({ ...validRsvp, acompanhante: 'sim' })
    expect(result.success).toBe(false)
  })

  it('normalises email to lowercase', () => {
    const result = rsvpSchema.safeParse({ ...validRsvp, email: 'ALICE@EXAMPLE.COM' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('alice@example.com')
    }
  })
})

describe('inviteCreateSchema', () => {
  it('accepts valid invite creation data', () => {
    const result = inviteCreateSchema.safeParse({ max_uses: 10 })
    expect(result.success).toBe(true)
  })

  it('rejects max_uses of 0', () => {
    const result = inviteCreateSchema.safeParse({ max_uses: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects max_uses above 1000', () => {
    const result = inviteCreateSchema.safeParse({ max_uses: 1001 })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields', () => {
    const result = inviteCreateSchema.safeParse({
      max_uses: 5,
      label: 'Press pass',
      is_vip: true,
    })
    expect(result.success).toBe(true)
  })
})

describe('inviteArchiveSchema', () => {
  it('accepts archived true', () => {
    expect(inviteArchiveSchema.safeParse({ archived: true }).success).toBe(true)
  })

  it('accepts archived false', () => {
    expect(inviteArchiveSchema.safeParse({ archived: false }).success).toBe(true)
  })

  it('rejects non-boolean archived', () => {
    expect(inviteArchiveSchema.safeParse({ archived: 'yes' }).success).toBe(false)
  })
})

describe('accreditationRsvpSchema', () => {
  it('accepts valid media accreditation', () => {
    const result = accreditationRsvpSchema.safeParse({
      name: 'Carlos Melo',
      email: 'carlos@press.pt',
      phone: '934567890',
      media_company: 'RTP',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing media_company', () => {
    const result = accreditationRsvpSchema.safeParse({
      name: 'Carlos Melo',
      email: 'carlos@press.pt',
      phone: '934567890',
      media_company: '',
    })
    expect(result.success).toBe(false)
  })
})
