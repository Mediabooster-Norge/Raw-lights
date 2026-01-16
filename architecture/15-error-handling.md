# Error Handling

## Global Error Handling
```
/app/global-error.tsx
```

```tsx
'use client'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Noe gikk galt</h1>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-primary text-white rounded-lg"
            >
              Prøv igjen
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

---

## 404 Not Found

### File
```
/app/(sites)/[site]/not-found.tsx
```

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Siden finnes ikke</h2>
        <p className="text-gray-600 mb-8">
          Beklager, vi finner ikke siden du leter etter.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-onPrimary rounded-lg inline-block"
        >
          Tilbake til forsiden
        </Link>
      </div>
    </div>
  )
}
```

### Trigger Not Found
```tsx
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const page = await getPage(params.slug)
  
  if (!page) {
    notFound()
  }
  
  return <PageRenderer blocks={page.blocks} />
}
```

---

## Dynamic Page Routing
```
/app/(sites)/[site]/[slug]/page.tsx
/app/(sites)/[site]/page.tsx (homepage)
```

---

## generateStaticParams (Static Generation)

### Purpose
Pre-render sider ved build-time for bedre ytelse.

### Pattern for [slug]/page.tsx
```ts
// /app/(sites)/[site]/[slug]/page.tsx
import { getClient } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

export async function generateStaticParams({ params }: { params: { site: string } }) {
  const client = getClient(params.site)
  
  const slugs = await client.fetch<string[]>(
    groq`*[_type == "page" && defined(slug.current)].slug.current`
  )
  
  return slugs.map((slug) => ({ slug }))
}

export default async function Page({ params }: { params: { site: string; slug: string } }) {
  // ... page implementation
}
```

### Pattern for [site] parameter
```ts
// /app/(sites)/[site]/layout.tsx
export async function generateStaticParams() {
  return [
    { site: 'landstreff' },
    { site: 'ypsilon' },
    { site: 'julivinterland' }
  ]
}
```

### Combined Pattern (Full Static)
```ts
// For full static generation of all site/slug combinations
export async function generateStaticParams() {
  const sites = ['landstreff', 'ypsilon', 'julivinterland']
  
  const params = await Promise.all(
    sites.map(async (site) => {
      const client = getClient(site)
      const slugs = await client.fetch<string[]>(
        groq`*[_type == "page" && defined(slug.current)].slug.current`
      )
      return slugs.map((slug) => ({ site, slug }))
    })
  )
  
  return params.flat()
}
```

### Dynamic vs Static Rules
| Route | Generation | Reason |
|-------|------------|--------|
| Homepage | Static | High traffic |
| Content pages | Static | SEO + performance |
| Preview | Dynamic | Real-time drafts |
| Forms | Dynamic | User interaction |
