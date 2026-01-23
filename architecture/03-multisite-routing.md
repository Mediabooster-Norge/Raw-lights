# Routing (Single-site & Multisite)

## Konfigurasjon

Templaten støtter både single-site og multisite via miljøvariabel:

```env
# Single-site (default)
NEXT_PUBLIC_MULTISITE_ENABLED=false

# Multisite
NEXT_PUBLIC_MULTISITE_ENABLED=true
```

---

## Single-site Modus

### Hvordan det fungerer
- Ingen site-felt på dokumenter
- Queries henter innhold uten site-filtrering
- Navigation og GlobalSettings er singletons (ett dokument)
- Enkel Studio-struktur

### Middleware
```ts
// Ingen site-rewriting nødvendig for single-site
// Middleware kan brukes for andre formål (auth, redirects)
```

### Queries
```groq
// Single-site: Ingen site-filter
*[_type == "page" && slug.current == $slug][0]
```

---

## Multisite Modus

### Hvordan det fungerer
- Site-felt på alle dokumenter
- Queries filtrerer på `site->siteId.current == $siteId`
- Navigation og GlobalSettings er per-site (ett dokument per nettsted)
- Studio gruppert etter nettsted

### Site Document Type

```ts
// schemas/site/site.ts
{
  name: 'site',
  title: 'Nettsted',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'siteId', type: 'slug' },      // Unik identifikator
    { name: 'domain', type: 'string' },    // Produksjonsdomene
    { name: 'isDefault', type: 'boolean' },
    { name: 'isActive', type: 'boolean' }
  ]
}
```

### Middleware Pattern
```ts
// middleware.ts
const domainToSite: Record<string, string> = {
  'example.com': 'site1',
  'other.com': 'site2',
  'localhost': 'site1'
}

export function middleware(req) {
  const hostname = req.headers.get('host')
  const site = domainToSite[hostname] ?? 'site1'
  
  // Rewrite to site-specific route
  const url = req.nextUrl.clone()
  url.pathname = `/${site}${req.nextUrl.pathname}`
  
  return NextResponse.rewrite(url)
}
```

### Queries
```groq
// Multisite: Site-filter inkludert
*[_type == "page" && slug.current == $slug && site->siteId.current == $siteId][0]
```

---

## Universell GROQ Filter

Queries bruker en smart filter som håndterer begge moduser:

```groq
// Hvis $siteId er null (single-site), ignoreres filteret
const SITE_FILTER = `(!defined($siteId) || site->siteId.current == $siteId)`

// Brukes slik:
*[_type == "page" && slug.current == $slug && ${SITE_FILTER}][0]
```

---

## DatasetRouter

### Fil
```
/lib/sanity/datasetRouter.ts
```

### Contract
```ts
type SiteConfig = {
  dataset: string
  projectId: string
  siteId: string | null  // null for single-site
}
```

### Implementation
```ts
import { isMultisiteEnabled } from '../config/multisite'

const singleSiteConfig: SiteConfig = {
  dataset: DATASET,
  projectId: PROJECT_ID,
  siteId: null  // Ingen filtrering
}

const multisiteConfigs: Record<string, SiteConfig> = {
  site1: { dataset: DATASET, projectId: PROJECT_ID, siteId: 'site1' },
  site2: { dataset: DATASET, projectId: PROJECT_ID, siteId: 'site2' }
}

export function datasetRouter(site: string): SiteConfig {
  if (!isMultisiteEnabled()) {
    return singleSiteConfig
  }
  return multisiteConfigs[site] ?? multisiteConfigs['site1']
}
```

---

## Fetcher Pattern

```ts
function getSiteId(site: string): string | null {
  const config = datasetRouter(site)
  return config.siteId  // null for single-site, string for multisite
}

export async function getPage(slug: string, site: string) {
  const siteId = getSiteId(site)  // null eller 'site1', 'site2' etc.
  
  return client.fetch(pageQuery, { slug, siteId })
}
```

---

## Studio Structure

### Single-site
```
📄 Sider
📝 Innlegg
📋 Posttyper
---
🧭 Navigasjon (singleton)
⚙️ Globale innstillinger (singleton)
↪️ Redirects
```

### Multisite
```
🌐 Nettsteder
---
📄 Sider (gruppert etter nettsted)
📝 Innlegg (gruppert etter nettsted → posttype)
📋 Posttyper (gruppert etter nettsted)
---
🧭 Navigasjon (gruppert etter nettsted)
⚙️ Globale innstillinger (gruppert etter nettsted)
↪️ Redirects (gruppert etter nettsted)
```

---

## Legge til nytt nettsted (Multisite)

1. Opprett `site` dokument i Sanity Studio
2. Legg til site i `datasetRouter.ts`:
```ts
const multisiteConfigs = {
  // ... existing
  nyttsted: { dataset: DATASET, projectId: PROJECT_ID, siteId: 'nyttsted' }
}
```
3. Legg til domene-mapping i `middleware.ts`:
```ts
const domainToSite = {
  // ... existing
  'nyttsted.no': 'nyttsted'
}
```
4. Opprett Navigation og GlobalSettings for det nye nettstedet
