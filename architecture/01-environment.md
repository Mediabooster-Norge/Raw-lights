# Environment Variables

## Required .env.local
```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_PREVIEW_SECRET=
SANITY_WEBHOOK_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=

# Site-specific URLs (Required for multisite)
SITE_URL_LANDSTREFF=https://landstreffstavanger.no
SITE_URL_YPSILON=https://ypsilonfestivalen.no
SITE_URL_JULIVINTERLAND=https://julivinterland.no

# Revalidation
REVALIDATE_SECRET=
```

## Dataset per site (optional override)
```env
SANITY_DATASET_LANDSTREFF=landstreff
SANITY_DATASET_YPSILON=ypsilon
SANITY_DATASET_JULIVINTERLAND=julivinterland
```

---

## Environment Validation Pattern

### File
```
/lib/env.ts
```

### Implementation
```ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  SANITY_API_TOKEN: z.string().min(1),
  SANITY_PREVIEW_SECRET: z.string().min(1),
  SANITY_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  REVALIDATE_SECRET: z.string().min(1),
  
  // Site URLs
  SITE_URL_LANDSTREFF: z.string().url(),
  SITE_URL_YPSILON: z.string().url(),
  SITE_URL_JULIVINTERLAND: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

---

## Multisite Base URL Rules (Required)

### Problem
Multisite architecture requires site-specific canonical URLs for:
- SEO (canonical tags)
- Sitemap generation
- OpenGraph URLs
- Absolute links

### Rule
Each site **must** have its own canonical base URL.

### URL Resolver
```ts
// /lib/utils/getSiteUrl.ts
const siteUrls: Record<string, string> = {
  landstreff: process.env.SITE_URL_LANDSTREFF ?? process.env.NEXT_PUBLIC_SITE_URL ?? '',
  ypsilon: process.env.SITE_URL_YPSILON ?? process.env.NEXT_PUBLIC_SITE_URL ?? '',
  julivinterland: process.env.SITE_URL_JULIVINTERLAND ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
}

export function getSiteUrl(site: string): string {
  return siteUrls[site] ?? siteUrls.landstreff
}
```
