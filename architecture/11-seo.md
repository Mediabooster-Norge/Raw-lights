# SEO & Metadata

## Sanity SEO Setup

### seo.ts object schema
```ts
seo = {
  metaTitle: string,
  metaDescription: text,
  metaImage: image,
  canonicalUrl: url,
  robots: enum('index, follow', 'noindex, nofollow')
}
```

### Include in all page schemas
```ts
{ name: 'seo', type: 'seo' }
```

---

## Next.js Metadata Integration
```ts
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

export async function generateMetadata({ params }) {
  const siteUrl = getSiteUrl(params.site)
  const data = await getPage(params.slug, params.site)
  
  return {
    title: data?.seo?.metaTitle || data?.title,
    description: data?.seo?.metaDescription,
    robots: data?.seo?.robots,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: data?.seo?.canonicalUrl ?? `${siteUrl}/${params.slug}`
    },
    openGraph: {
      url: `${siteUrl}/${params.slug}`,
      images: data?.seo?.metaImage ? [data.seo.metaImage.url] : []
    }
  }
}
```

---

## Sitemap Generation

### File
```
/app/(sites)/[site]/sitemap.ts
```

```ts
import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { getClient } from '@/lib/sanity/client'

export async function generateSitemaps() {
  return [
    { id: 'landstreff' },
    { id: 'ypsilon' },
    { id: 'julivinterland' }
  ]
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl(id)
  const client = getClient(id)
  
  const pages = await client.fetch(`
    *[_type == "page" && visibility == "public" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `)

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    ...pages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ]
}
```

---

## Robots.txt

### File
```
/app/robots.ts
```

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/_next/']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  }
}
```

---

## Breadcrumbs & Structured Data

### Page Schema Extension (Parent/Child)
```ts
// Add to page schema
{
  name: 'parent',
  title: 'Parent Page',
  type: 'reference',
  to: [{ type: 'page' }]
}
```

### GROQ for Breadcrumb Chain
```ts
const pageWithBreadcrumbsQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    ...,
    "breadcrumbs": [
      ...select(
        defined(parent) => parent-> {
          "title": title,
          "slug": slug.current,
          "parent": parent-> {
            "title": title,
            "slug": slug.current
          }
        }
      ),
      { "title": title, "slug": slug.current }
    ]
  }
`
```

### Breadcrumb Component
```tsx
// /lib/components/ui/Breadcrumbs.tsx
type Breadcrumb = { title: string; slug: string }

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
      <ol className="flex items-center gap-2">
        <li><a href="/">Hjem</a></li>
        {items.map((item, i) => (
          <li key={item.slug} className="flex items-center gap-2">
            <span>/</span>
            {i === items.length - 1 ? (
              <span aria-current="page">{item.title}</span>
            ) : (
              <a href={`/${item.slug}`}>{item.title}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

### JSON-LD Structured Data
```tsx
// /lib/components/seo/BreadcrumbJsonLd.tsx
type Breadcrumb = { title: string; slug: string }

export function BreadcrumbJsonLd({ items, siteUrl }: { items: Breadcrumb[]; siteUrl: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Hjem', item: siteUrl },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.title,
        item: `${siteUrl}/${item.slug}`
      }))
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

### Page Integration
```tsx
export default async function Page({ params }) {
  const page = await getPageWithBreadcrumbs(params.slug)
  
  return (
    <>
      <BreadcrumbJsonLd items={page.breadcrumbs} siteUrl={siteUrl} />
      <Breadcrumbs items={page.breadcrumbs} />
      <PageRenderer blocks={page.blocks} />
    </>
  )
}
```
