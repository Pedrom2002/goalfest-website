import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://goalfest.pt'),
})

export type Env = z.infer<typeof schema>

let _env: Env | undefined

export function getEnv(): Env {
  if (_env && process.env.NODE_ENV !== 'test') return _env
  const result = schema.safeParse(process.env)
  _env = result.success ? result.data : { NEXT_PUBLIC_APP_URL: 'https://goalfest.pt' }
  return _env
}
