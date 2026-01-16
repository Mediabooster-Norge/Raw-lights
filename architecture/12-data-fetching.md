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

## GROQ Queries Collection

### File Structure
```
/lib/sanity/queries/
  index.ts
  page.ts
  navigation.ts
  globalSettings.ts
```

### Queries Index
```ts
// /lib/sanity/queries/index.ts
export * from './page'
export * from './navigation'
export * from './globalSettings'
```

### Page Queries
```ts
// /lib/sanity/queries/page.ts
import { groq } from 'next-sanity'

export const pageFields = groq`
  _id,
  _type,
  title,
  "slug": slug.current,
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
  *[_type == "page" && slug.current == $slug][0] {
    ${pageFields}
  }
`

export const allPagesQuery = groq`
  *[_type == "page" && defined(slug.current)] {
    ${pageFields}
  }
`

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`
```

### Navigation Queries
```ts
// /lib/sanity/queries/navigation.ts
import { groq } from 'next-sanity'

export const linkFields = groq`
  _type,
  type,
  label,
  openInNewTab,
  externalUrl,
  internalLink-> {
    _type,
    "slug": slug.current
  }
`

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
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

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    siteTheme {
      logo { asset->, alt },
      logoDark { asset-> },
      favicon { asset-> },
      ogImage { asset-> },
      colors {
        primary { hex },
        secondary { hex },
        tertiary { hex },
        background { hex },
        surface { hex },
        textPrimary { hex },
        textSecondary { hex }
      },
      buttonColors {
        primary { background { hex }, text { hex } },
        secondary { background { hex }, text { hex } }
      },
      typography {
        headingFont,
        bodyFont,
        customHeadingFont,
        customBodyFont
      }
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

---

## Caching Strategy (Tags per Content Type)

### Tag Naming Convention
| Content Type | Tags | Revalidate Trigger |
|--------------|------|-------------------|
| Page | `pages`, `page-{slug}` | Page updated |
| Navigation | `navigation` | Nav document updated |
| Global Settings | `global-settings` | Settings updated |
| Forms | `forms`, `form-{id}` | Form config updated |
| Redirects | `redirects` | Redirect added/changed |

### Fetcher Tag Rules
```ts
// /lib/sanity/fetcher.ts

export async function getPage(slug: string, site: string) {
  return getClient(site).fetch(pageQuery, { slug }, {
    next: { tags: ['pages', `page-${slug}`] }
  })
}

export async function getNavigation(site: string) {
  return getClient(site).fetch(navigationQuery, {}, {
    next: { tags: ['navigation'] }
  })
}

export async function getGlobalSettings(site: string) {
  return getClient(site).fetch(globalSettingsQuery, {}, {
    next: { tags: ['global-settings'] }
  })
}

export async function getForm(id: string, site: string) {
  return getClient(site).fetch(formQuery, { id }, {
    next: { tags: ['forms', `form-${id}`] }
  })
}

export async function getRedirects(site: string) {
  return getClient(site).fetch(redirectsQuery, {}, {
    next: { tags: ['redirects'] }
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
  form: (b) => ['forms', `form-${b._id}`],
  redirect: () => ['redirects']
}

// In webhook handler:
const tags = typeToTags[body._type]?.(body) ?? [body._type]
tags.forEach(tag => revalidateTag(tag))
```

### Layout-Level Revalidation
Navigation og Global Settings påvirker alle sider:
```ts
case 'navigation':
case 'globalSettings':
  revalidateTag(body._type === 'navigation' ? 'navigation' : 'global-settings')
  revalidatePath('/', 'layout') // Revalidate entire layout
  break
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
- `visibility == "public"`
- `publishDate` is undefined OR `publishDate <= now()`

## Applies to
- `page`
- `eventItem`
- `contentItem`
- `partner`

## GROQ Filter Pattern
```groq
// Base publish filter (reusable)
const publishFilter = `visibility == "public" && (!defined(publishDate) || publishDate <= now())`
```

## Query Examples

### Page Query
```groq
*[_type == "page" && slug.current == $slug && visibility == "public" && (!defined(publishDate) || publishDate <= now())][0] {
  ${pageFields}
}
```

### eventItem Query
```groq
*[_type == "eventItem" && visibility == "public" && (!defined(publishDate) || publishDate <= now())] | order(startDate asc) {
  ...
}
```

### contentItem Query
```groq
*[_type == "contentItem" && visibility == "public" && (!defined(publishDate) || publishDate <= now())] | order(publishDate desc) {
  ...
}
```

### Partner Query
```groq
*[_type == "partner" && visibility == "public"] | order(tier asc) {
  ...
}
```

## Fetcher Integration
```ts
// /lib/sanity/fetcher.ts
const PUBLISH_FILTER = `visibility == "public" && (!defined(publishDate) || publishDate <= now())`

export async function getPage(slug: string, site: string) {
  const { isEnabled: isPreview } = draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  
  // Preview mode bypasses publish filter
  const filter = isPreview 
    ? `_type == "page" && slug.current == $slug`
    : `_type == "page" && slug.current == $slug && ${PUBLISH_FILTER}`
  
  return client.fetch(`*[${filter}][0] { ${pageFields} }`, { slug })
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
