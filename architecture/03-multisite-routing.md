# Multisite Routing

## Rules
- Routing styres via `middleware.ts`
- Domenenavn → `site`-mapping
- `site`-parameter injiseres i URL via searchParam
- `datasetRouter.ts` returnerer dataset basert på `site`

---

## DatasetRouter Contract

### File
```
/lib/sanity/datasetRouter.ts
```

### Contract
```ts
type SiteConfig = {
  dataset: string
  projectId: string
}

type DatasetRouter = (site: string) => SiteConfig
```

### Implementation
```ts
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!

const siteConfigs: Record<string, SiteConfig> = {
  landstreff: { dataset: 'landstreff', projectId: PROJECT_ID },
  ypsilon: { dataset: 'ypsilon', projectId: PROJECT_ID },
  julivinterland: { dataset: 'julivinterland', projectId: PROJECT_ID }
}

const DEFAULT_SITE = 'landstreff'

export function datasetRouter(site: string): SiteConfig {
  return siteConfigs[site] ?? siteConfigs[DEFAULT_SITE]
}
```

### Fallback Rules
1. Unknown site → returns `DEFAULT_SITE` config
2. Empty/null site → returns `DEFAULT_SITE` config
3. Never throws – always returns valid config

---

## client.ts Pattern
```ts
import { createClient } from 'next-sanity'
import { datasetRouter } from './datasetRouter'

export function getClient(site: string) {
  const { dataset, projectId } = datasetRouter(site)
  
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true
  })
}
```

---

## Middleware Pattern
```ts
// middleware.ts
export function middleware(req) {
  const host = req.headers.get('host')
  const map = {
    'landstreffstavanger.no': 'landstreff',
    'ypsilonfestivalen.no': 'ypsilon',
    'julivinterland.no': 'julivinterland'
  }
  req.nextUrl.searchParams.set('site', map[host] || 'landstreff')
  return NextResponse.rewrite(req.nextUrl)
}
```

---

## Domain → Site Mapping Fallbacks (Required)

### middleware.ts rules
```ts
// 1. Localhost fallback
if (host.includes('localhost')) {
  req.nextUrl.searchParams.set('site', 'landstreff')
}

// 2. Unknown domain fallback → default site
if (!map[host]) {
  req.nextUrl.searchParams.set('site', 'landstreff')
}

// 3. Skip mapping for Sanity Studio
if (req.nextUrl.pathname.startsWith('/studio')) {
  return NextResponse.next()
}
```

---

## Usage Locations

| File | Usage |
|------|-------|
| `client.ts` | `createClient(datasetRouter(site))` |
| `fetcher.ts` | `getClient(site)` uses router |
| `preview.ts` | Preview client uses router |
| `revalidate/route.ts` | Webhook determines site from payload |
