import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/constants'

const LOCALES = ['pt', 'en'] as const

const routes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/jogos', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/privacidade', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/termos', priority: 0.3, changeFrequency: 'yearly' as const },
]

const LAST_MODIFIED = new Date('2026-05-17')

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    routes.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
    }))
  )
}
