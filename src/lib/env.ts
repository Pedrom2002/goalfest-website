import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://goalfest.pt'),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  NEXT_PUBLIC_VIDEO_HERO: z.string().default('/hero.mp4'),
  NEXT_PUBLIC_VIDEO_VENUE: z.string().default('/venue.mp4'),
  NEXT_PUBLIC_MODEL_VENUE: z.string().default('/venue_optimized.glb'),
  NEXT_PUBLIC_ENV_VENUE: z.string().default('/dikhololo_night_1k.hdr'),
})

export type Env = z.infer<typeof schema>

let _env: Env | undefined

export function getEnv(): Env {
  if (_env && process.env.NODE_ENV !== 'test') return _env
  const result = schema.safeParse(process.env)
  if (!result.success) {
    const issues = result.error.issues.map(i => `  ${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`[env] Missing or invalid environment variables:\n${issues}`)
  }
  _env = result.data
  return _env
}
