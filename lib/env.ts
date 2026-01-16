import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  SANITY_API_TOKEN: z.string().min(1),
  SANITY_PREVIEW_SECRET: z.string().min(1),
  SANITY_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  REVALIDATE_SECRET: z.string().min(1),
  SITE_URL_LANDSTREFF: z.string().url(),
  SITE_URL_YPSILON: z.string().url(),
  SITE_URL_JULIVINTERLAND: z.string().url(),
})

export const env = envSchema.parse(process.env)
