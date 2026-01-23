# Data Fetching & Caching

## ISR + Revalidation Rules
```
app/api/revalidate/route.ts
```
- Use on-demand revalidation
- All page fetchers must use `revalidateTag`

Pattern:
```ts
export const revalidate = 60
```

---

## SiteId-basert Filtrering

Alle queries MÅ inkludere site-filter for å hente riktig innhold:

```groq
const SITE_FILTER = `site->siteId.current == $siteId`
```

### Fetcher Pattern
```ts
import { datasetRouter } from './datasetRouter'

function getSiteId(site: string): string {
  const config = datasetRouter(site)
  return config.siteId
}

export async function getPage(slug: string, site: string) {
  const client = getClient(site)
  const siteId = getSiteId(site)
  
  return client.fetch(pageQuery, { slug, siteId }, {
    next: { tags: ['pages', `page-${slug}`] }
  })
}
```

---

## GROQ Queries Collection

### File Structure
```
/lib/sanity/queries/
  index.ts
  page.ts
  navigation.ts
  globalSettings.ts
  posts.ts
```

### Queries Index
```ts
// /lib/sanity/queries/index.ts
export * from './page'
export * from './navigation'
export * from './globalSettings'
export * from './posts'
```

### Page Queries
```ts
// /lib/sanity/queries/page.ts
import { groq } from 'next-sanity'

const SITE_FILTER = `site->siteId.current == $siteId`
const PUBLISH_FILTER = `(visibility == "public" || !defined(visibility)) && (!defined(publishDate) || publishDate <= now())`

export const pageFields = groq`
  _id,
  _type,
  title,
  "slug": slug.current,
  "siteId": site->siteId.current,
  blocks[] {
    _key,
    _type,
    ...
  },
  seo {
    metaTitle,
    metaDescription,
    metaImage { asset-> },
    canonicalUrl,
    robots
  }
`

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug && ${SITE_FILTER} && ${PUBLISH_FILTER}][0] {
    ${pageFields}
  }
`

export const pagePreviewQuery = groq`
  *[_type == "page" && slug.current == $slug && ${SITE_FILTER}][0] {
    ${pageFields}
  }
`
```

### Navigation Queries
```ts
// /lib/sanity/queries/navigation.ts
import { groq } from 'next-sanity'

const SITE_FILTER = `site->siteId.current == $siteId`

export const navigationQuery = groq`
  *[_type == "navigation" && ${SITE_FILTER}][0] {
    "siteId": site->siteId.current,
    mainNav[] {
      label,
      link { ${linkFields} },
      children[] {
        label,
        link { ${linkFields} }
      }
    },
    headerCta {
      link { ${linkFields} },
      variant
    },
    footerNav[] {
      title,
      links[] { ${linkFields} }
    },
    socialLinks[] {
      platform,
      url
    }
  }
`
```

### Global Settings Queries
```ts
// /lib/sanity/queries/globalSettings.ts
import { groq } from 'next-sanity'

const SITE_FILTER = `site->siteId.current == $siteId`

export const globalSettingsQuery = groq`
  *[_type == "globalSettings" && ${SITE_FILTER}][0] {
    "siteId": site->siteId.current,
    siteTheme {
      logo { asset->, alt },
      // ... other theme fields
    },
    seo {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      robots
    },
    customCode {
      headScripts,
      bodyStartScripts,
      footerScripts
    }
  }
`
```

### Post Queries
```ts
// /lib/sanity/queries/posts.ts
import { groq } from 'next-sanity'

const SITE_FILTER = `site->siteId.current == $siteId`

export const allPostTypesQuery = groq`
  *[_type == "postType" && ${SITE_FILTER}] | order(title asc) {
    _id,
    title,
    singularTitle,
    "slug": slug.current,
    // ... other fields
  }
`

export const postsByTypeQuery = groq`
  *[_type == "post" && postType->slug.current == $postTypeSlug && ${SITE_FILTER} && visibility == "public"] | order(order asc, publishDate desc) {
    _id,
    title,
    "slug": slug.current,
    // ... other fields
  }
`
```

---

## Caching Strategy (Tags per Content Type)

### Tag Naming Convention
| Content Type | Tags | Revalidate Trigger |
|--------------|------|-------------------|
| Page | `pages`, `page-{slug}` | Page updated |
| Navigation | `navigation` | Nav document updated |
| Global Settings | `global-settings` | Settings updated |
| Posts | `posts`, `post-{slug}` | Post updated |
| Post Types | `post-types`, `post-type-{slug}` | PostType updated |
| Redirects | `redirects` | Redirect added/changed |

### Fetcher Tag Rules
```ts
// /lib/sanity/fetcher.ts

export async function getPage(slug: string, site: string) {
  const siteId = getSiteId(site)
  return getClient(site).fetch(pageQuery, { slug, siteId }, {
    next: { tags: ['pages', `page-${slug}`] }
  })
}

export async function getNavigation(site: string) {
  const siteId = getSiteId(site)
  return getClient(site).fetch(navigationQuery, { siteId }, {
    next: { tags: ['navigation'] }
  })
}

export async function getGlobalSettings(site: string) {
  const siteId = getSiteId(site)
  return getClient(site).fetch(globalSettingsQuery, { siteId }, {
    next: { tags: ['global-settings'] }
  })
}
```

### Webhook → Tag Mapping
```ts
// /app/api/revalidate/route.ts

const typeToTags: Record<string, (body: any) => string[]> = {
  page: (b) => ['pages', `page-${b.slug?.current}`],
  navigation: () => ['navigation'],
  globalSettings: () => ['global-settings'],
  post: (b) => ['posts', `post-${b.slug?.current}`],
  postType: (b) => ['post-types', `post-type-${b.slug?.current}`],
  redirect: () => ['redirects']
}

// In webhook handler:
const tags = typeToTags[body._type]?.(body) ?? [body._type]
tags.forEach(tag => revalidateTag(tag))
```

### Default TTL (fallback)
```ts
// For data without explicit tags
export const revalidate = 60 // 60 seconds fallback
```

---

# Content Publishing Rules (Required)

## Purpose
Forhindre at upublisert eller skjult innhold vises på frontend.

## Rule
All queries fetching public content **MUST** include:
- `site->siteId.current == $siteId` (site filter)
- `visibility == "public"`
- `publishDate` is undefined OR `publishDate <= now()`

## GROQ Filter Pattern
```groq
const SITE_FILTER = `site->siteId.current == $siteId`
const PUBLISH_FILTER = `(visibility == "public" || !defined(visibility)) && (!defined(publishDate) || publishDate <= now())`
```

## Query Examples

### Page Query
```groq
*[_type == "page" && slug.current == $slug && site->siteId.current == $siteId && visibility == "public" && (!defined(publishDate) || publishDate <= now())][0] {
  ${pageFields}
}
```

### Posts Query
```groq
*[_type == "post" && postType->slug.current == $postTypeSlug && site->siteId.current == $siteId && visibility == "public"] | order(order asc, publishDate desc) {
  ...
}
```

## Fetcher Integration
```ts
// /lib/sanity/fetcher.ts

export async function getPage(slug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const siteId = getSiteId(site)
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  
  // Preview mode uses query without publish filter
  const query = isPreview ? pagePreviewQuery : pageQuery
  
  return client.fetch(query, { slug, siteId })
}
```

## Exception
Preview mode (`draftMode().isEnabled`) bypasses publish filters to allow editors to preview unpublished content.

---

## TypeScript Types Structure

### File Structure
```
/lib/types/
  index.ts
  sanity.ts
  theme.ts
  components.ts
```

### Core Types
```ts
// /lib/types/index.ts
export * from './sanity'
export * from './theme'
export * from './components'
```

### Type Safety
Use:
```
- sanity-codegen OR groqd
- Zod for runtime validation
```
