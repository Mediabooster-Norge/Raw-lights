# Environment Variables

## Required .env.local

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token
SANITY_PREVIEW_SECRET=your-preview-secret
SANITY_WEBHOOK_SECRET=your-webhook-secret

# Site
NEXT_PUBLIC_SITE_URL=https://your-site.com

# Multisite (valgfri - default: false)
NEXT_PUBLIC_MULTISITE_ENABLED=false

# Revalidation
REVALIDATE_SECRET=your-revalidate-secret
```

---

## Single-site vs Multisite

### Single-site (default)
```env
NEXT_PUBLIC_MULTISITE_ENABLED=false
# eller bare utelat variabelen
```

### Multisite
```env
NEXT_PUBLIC_MULTISITE_ENABLED=true

# Site-spesifikke URLer (kun for multisite)
SITE_URL_SITE1=https://site1.com
SITE_URL_SITE2=https://site2.com
```

---

## Environment Validation Pattern

### Fil
```
/lib/env.ts
```

### Implementation
```ts
import { z } from 'zod'

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  SANITY_API_TOKEN: z.string().min(1),
  SANITY_PREVIEW_SECRET: z.string().min(1),
  SANITY_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  REVALIDATE_SECRET: z.string().min(1),
  
  // Optional
  NEXT_PUBLIC_MULTISITE_ENABLED: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

---

## Multisite URL Resolver

```ts
// /lib/utils/getSiteUrl.ts

const DEFAULT_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// Single-site: Bruker alltid NEXT_PUBLIC_SITE_URL
// Multisite: Bruker site-spesifikke URLer
const siteUrls: Record<string, string> = {
  site1: process.env.SITE_URL_SITE1 ?? DEFAULT_URL,
  site2: process.env.SITE_URL_SITE2 ?? DEFAULT_URL,
}

export function getSiteUrl(site: string): string {
  // Single-site modus
  if (process.env.NEXT_PUBLIC_MULTISITE_ENABLED !== 'true') {
    return DEFAULT_URL
  }
  // Multisite modus
  return siteUrls[site] ?? DEFAULT_URL
}
```

---

## Konfigurasjonsfil

```ts
// /lib/config/multisite.ts

export function isMultisiteEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MULTISITE_ENABLED === 'true'
}

export function getDefaultSiteId(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'default'
}

export const multisiteConfig = {
  get enabled(): boolean {
    return isMultisiteEnabled()
  },
  get defaultSiteId(): string {
    return getDefaultSiteId()
  }
}
```

---

## Oppsummering

| Variabel | Required | Single-site | Multisite |
|----------|----------|-------------|-----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | ✅ | ✅ |
| `SANITY_API_TOKEN` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_MULTISITE_ENABLED` | ❌ | `false` | `true` |
| `SITE_URL_*` | ❌ | ❌ | Anbefalt |
