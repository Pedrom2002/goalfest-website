import type { MetadataRoute } from 'next'

const BASE_URL = 'https://goalfest.pt'
const LOCALES = ['pt', 'en'] as const

const routes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/bilhetes', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/termos', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/privacidade', priority: 0.3, changeFrequency: 'yearly' as const },
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
