import { describe, it, expect } from 'vitest'
import pt from '../../../messages/pt.json'
import en from '../../../messages/en.json'

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      return flattenKeys(v as Record<string, unknown>, key)
    }
    return [key]
  })
}

describe('i18n parity', () => {
  const ptKeys = new Set(flattenKeys(pt as Record<string, unknown>))
  const enKeys = new Set(flattenKeys(en as Record<string, unknown>))

  it('all pt keys exist in en', () => {
    const missing = [...ptKeys].filter(k => !enKeys.has(k))
    expect(missing, `Keys in pt but not en: ${missing.join(', ')}`).toHaveLength(0)
  })

  it('all en keys exist in pt', () => {
    const missing = [...enKeys].filter(k => !ptKeys.has(k))
    expect(missing, `Keys in en but not pt: ${missing.join(', ')}`).toHaveLength(0)
  })

  it('no empty string values in pt', () => {
    const empty = [...ptKeys].filter(k => {
      const parts = k.split('.')
      let val: unknown = pt
      for (const p of parts) val = (val as Record<string, unknown>)[p]
      return val === ''
    })
    expect(empty, `Empty values in pt: ${empty.join(', ')}`).toHaveLength(0)
  })

  it('no empty string values in en', () => {
    const empty = [...enKeys].filter(k => {
      const parts = k.split('.')
      let val: unknown = en
      for (const p of parts) val = (val as Record<string, unknown>)[p]
      return val === ''
    })
    expect(empty, `Empty values in en: ${empty.join(', ')}`).toHaveLength(0)
  })
})
