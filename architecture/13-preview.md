# Preview Mode

## Required Files
```
/app/api/preview/route.ts
/lib/sanity/preview.ts
```

Pattern:
- draft overlay
- live preview

---

## Preview Client Configuration
```ts
// /lib/sanity/preview.ts
import { createClient } from 'next-sanity'
import { datasetRouter } from './datasetRouter'

export function getPreviewClient(site: string) {
  const { dataset, projectId } = datasetRouter(site)
  
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,              // ⚠️ REQUIRED: No CDN in preview
    perspective: 'previewDrafts', // ⚠️ REQUIRED: See draft content
    token: process.env.SANITY_API_TOKEN // ⚠️ REQUIRED: Read token
  })
}
```

---

## Preview vs Production Rules
| Setting | Production | Preview |
|---------|------------|---------|
| `useCdn` | `true` | `false` |
| `perspective` | `'published'` | `'previewDrafts'` |
| `token` | Not required | **Required** |
| Caching | Next.js cache | No cache |

---

## Fetcher with Preview Support
```ts
// /lib/sanity/fetcher.ts
import { draftMode } from 'next/headers'
import { getClient } from './client'
import { getPreviewClient } from './preview'

export async function getPage(slug: string, site: string) {
  const { isEnabled: isPreview } = draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  
  return client.fetch(
    pageQuery,
    { slug },
    isPreview ? {} : { next: { tags: ['pages', `page-${slug}`] } }
  )
}
```

---

## Preview API Route
```ts
// /app/api/preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') ?? '/'

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()
  redirect(slug)
}

// Disable preview
export async function DELETE() {
  draftMode().disable()
  return new Response('Draft mode disabled')
}
```

---

## Preview Indicator Component
```tsx
// /lib/components/ui/PreviewBanner.tsx
import { draftMode } from 'next/headers'

export function PreviewBanner() {
  const { isEnabled } = draftMode()
  
  if (!isEnabled) return null
  
  return (
    <div className="fixed bottom-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full z-50 text-sm font-medium">
      Preview Mode
      <a href="/api/preview" className="ml-2 underline">Exit</a>
    </div>
  )
}
```

---

# Preview Multisite Rule (Required)

## Problem
Preview mode må vite hvilket dataset den skal bruke for å hente riktig innhold.

## Rule
Preview URL **must always include**:
- `site` param (preferred)
- OR `dataset` param (fallback)

## Preview URL Format
```
/api/preview?secret={SANITY_PREVIEW_SECRET}&site={site}&slug={path}
```

## Examples
```
/api/preview?secret=abc123&site=landstreff&slug=/program
/api/preview?secret=abc123&site=ypsilon&slug=/artister
/api/preview?secret=abc123&site=julivinterland&slug=/
```

## Preview Route Implementation
```ts
// /app/api/preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { datasetRouter } from '@/lib/sanity/datasetRouter'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') ?? '/'
  const site = searchParams.get('site')

  // Validate secret
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Validate site parameter
  if (!site) {
    return new Response('Missing site parameter', { status: 400 })
  }

  // Validate site exists in router
  const config = datasetRouter(site)
  if (!config) {
    return new Response('Invalid site', { status: 400 })
  }

  // Store site in cookie for preview client to use
  const cookieStore = cookies()
  cookieStore.set('preview-site', site, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 // 1 hour
  })

  draftMode().enable()
  redirect(slug)
}

// Disable preview
export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete('preview-site')
  draftMode().disable()
  return new Response('Draft mode disabled')
}
```

## Preview Client with Site Awareness
```ts
// /lib/sanity/preview.ts
import { cookies } from 'next/headers'
import { createClient } from 'next-sanity'
import { datasetRouter } from './datasetRouter'

export function getPreviewClient(site?: string) {
  // Get site from parameter or cookie
  const cookieStore = cookies()
  const previewSite = site ?? cookieStore.get('preview-site')?.value ?? 'landstreff'
  
  const { dataset, projectId } = datasetRouter(previewSite)
  
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    perspective: 'previewDrafts',
    token: process.env.SANITY_API_TOKEN
  })
}
```

## Sanity Studio Preview Link
Configure Sanity Studio to generate correct preview URLs:
```ts
// sanity.config.ts
import { defineConfig } from 'sanity'

const datasets = ['landstreff', 'ypsilon', 'julivinterland']

export default defineConfig(
  datasets.map((dataset) => ({
    // ... other config
    document: {
      productionUrl: async (prev, context) => {
        const { document } = context
        const slug = document?.slug?.current ?? ''
        const secret = process.env.SANITY_PREVIEW_SECRET
        
        return `${process.env.NEXT_PUBLIC_SITE_URL}/api/preview?secret=${secret}&site=${dataset}&slug=/${slug}`
      }
    }
  }))
)
```
