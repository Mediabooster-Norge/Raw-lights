# Sanity Studio Configuration

## Studio Structure (SiteId-basert)

Studio bruker **ett workspace** med innhold gruppert etter nettsted.
Venstre sidebar viser innholdsstruktur med nettsted-velger.

### Navigasjonsstruktur
```
📂 Nettsteder (site documents)
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

## Sanity Config (sanity.config.ts)

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './schemas'
import { resolve } from './lib/sanity/presentation'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Multisite CMS',
  projectId: PROJECT_ID,
  dataset: DATASET,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S, context) => {
        // Innhold gruppert etter nettsted
        // Se full implementasjon i sanity.config.ts
      }
    }),
    presentationTool({
      previewUrl: `${PREVIEW_URL}/api/draft?redirect=/`,
      resolve
    }),
    visionTool(),
    colorInput(),
    media()
  ],
  schema: {
    types: schemaTypes
  }
})
```

---

## Studio Structure Implementation

```ts
structure: (S, context) => {
  // Nettsteder
  const sitesListItem = S.listItem()
    .title('Nettsteder')
    .id('sites')
    .icon(() => '🌐')
    .child(S.documentTypeList('site').title('Nettsteder'))

  // Sider gruppert etter nettsted
  const pagesListItem = S.listItem()
    .title('Sider')
    .id('pages')
    .icon(() => '📄')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId) =>
          S.documentList()
            .title('Sider')
            .filter('_type == "page" && site._ref == $siteId')
            .params({ siteId })
        )
    )

  // Innlegg gruppert etter nettsted -> posttype
  const postsListItem = S.listItem()
    .title('Innlegg')
    .id('posts')
    .icon(() => '📝')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId) =>
          S.list()
            .title('Posttyper')
            .items([
              S.listItem()
                .title('Alle innlegg')
                .child(
                  S.documentList()
                    .title('Alle innlegg')
                    .filter('_type == "post" && site._ref == $siteId')
                    .params({ siteId })
                ),
              S.divider(),
              S.listItem()
                .title('Etter posttype')
                .child(
                  S.documentList()
                    .title('Velg posttype')
                    .filter('_type == "postType" && site._ref == $siteId')
                    .params({ siteId })
                    .child((postTypeId) =>
                      S.documentList()
                        .title('Innlegg')
                        .filter('_type == "post" && site._ref == $siteId && postType._ref == $postTypeId')
                        .params({ siteId, postTypeId })
                    )
                )
            ])
        )
    )

  // Navigasjon og innstillinger følger samme mønster
  // ...

  return S.list()
    .title('Innhold')
    .items([
      sitesListItem,
      S.divider(),
      pagesListItem,
      postsListItem,
      postTypesListItem,
      S.divider(),
      navigationListItem,
      globalSettingsListItem,
      redirectsListItem
    ])
}
```

---

## Recommended Plugins

```
sanity-plugin-media          # Media library
@sanity/color-input          # Color picker
@sanity/vision               # GROQ playground
sanity/presentation          # Live preview
```

---

## Site-Aware Singletons

Navigation og GlobalSettings er nå **per site** i stedet for globale singletons.

### Før (dataset-basert)
- Ett `navigation` dokument per datasett
- Ett `globalSettings` dokument per datasett

### Nå (siteId-basert)
- Ett `navigation` dokument per site (filtrer på `site._ref`)
- Ett `globalSettings` dokument per site (filtrer på `site._ref`)

### Query Pattern
```groq
*[_type == "navigation" && site->siteId.current == $siteId][0] {
  // ... fields
}

*[_type == "globalSettings" && site->siteId.current == $siteId][0] {
  // ... fields
}
```

---

## Site Document Type

```ts
// schemas/site/site.ts
export default defineType({
  name: 'site',
  title: 'Nettsted',
  type: 'document',
  icon: () => '🌐',
  fields: [
    defineField({
      name: 'title',
      title: 'Navn',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'siteId',
      title: 'Site ID',
      type: 'slug',
      description: 'Unik identifikator (f.eks. "landstreff")',
      options: { source: 'title', maxLength: 50 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'domain',
      title: 'Domene',
      type: 'string',
      description: 'Produksjonsdomene (f.eks. "landstreffstavanger.no")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isDefault',
      title: 'Standard nettsted',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      initialValue: true
    })
  ]
})
```

---

## Preview i Sanity Studio

```ts
// i sanity.config.ts
presentationTool({
  previewUrl: `${PREVIEW_URL}/api/draft?redirect=/`,
  resolve
})
```

Preview-URL setter `preview-site` cookie basert på site-parameter.

---

## Legge til nytt nettsted

1. **I Sanity Studio:** Opprett nytt `site` dokument med siteId og domain
2. **I kode:** Legg til site i `datasetRouter.ts`
3. **I miljøvariabler:** Legg til domene-mapping i `middleware.ts`
4. **Opprett innhold:** Navigation, GlobalSettings, sider for det nye nettstedet

### Eksempel: Legge til "nyttsted"
```ts
// datasetRouter.ts
const siteConfigs: Record<string, SiteConfig> = {
  landstreff: { dataset: DATASET, projectId: PROJECT_ID, siteId: 'landstreff' },
  ypsilon: { dataset: DATASET, projectId: PROJECT_ID, siteId: 'ypsilon' },
  julivinterland: { dataset: DATASET, projectId: PROJECT_ID, siteId: 'julivinterland' },
  nyttsted: { dataset: DATASET, projectId: PROJECT_ID, siteId: 'nyttsted' }  // ← Ny
}
```

```ts
// middleware.ts
const domainToSite: Record<string, string> = {
  // ... existing
  'nyttsted.no': 'nyttsted',  // ← Ny
  'www.nyttsted.no': 'nyttsted'  // ← Ny
}
```
