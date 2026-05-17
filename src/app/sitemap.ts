import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/constants'

const LOCALES = ['pt', 'en'] as const

const routes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/jogos', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    routes.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  )
}
