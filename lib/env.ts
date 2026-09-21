import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
  SANITY_API_TOKEN: z.string().optional(),
  SANITY_PREVIEW_SECRET: z.string().optional(),
  SANITY_WEBHOOK_SECRET: z.string().optional(),
  SANITY_TRANSLATION_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_TRANSLATION_MODEL: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  FORM_FROM_EMAIL: z.string().optional(),
  FORM_TO_EMAIL: z.string().optional(),
})

export const env = envSchema.parse(process.env)
