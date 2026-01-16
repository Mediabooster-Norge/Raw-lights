# Sanity Studio Configuration

## Studio Structure
Use **dataset switcher tab** on top.
Left sidebar = content structure for selected dataset.

```
Landstreff | Ypsilon | Jul i Vinterland | Felles
```

Folder structure inside each:
- Pages
- Navigation
- Global settings
- Blocks / modules

---

## Sanity Config (sanity.config.ts)

```ts
import { defineConfig, isDev } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './schemas'
import { structure } from './sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const datasets = ['landstreff', 'ypsilon', 'julivinterland']

export default defineConfig(
  datasets.map((dataset) => ({
    name: dataset,
    title: dataset.charAt(0).toUpperCase() + dataset.slice(1),
    projectId,
    dataset,
    basePath: `/studio/${dataset}`,
    plugins: [
      structureTool({ structure }),
      visionTool(),
      media(),
      colorInput(),
      ...(isDev ? [] : [])
    ],
    schema: {
      types: schemaTypes
    }
  }))
)
```

---

## Studio Structure
```
/sanity/structure.ts
```

```ts
import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Innhold')
    .items([
      S.listItem()
        .title('Sider')
        .child(S.documentTypeList('page').title('Sider')),
      S.listItem()
        .title('Navigasjon')
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.listItem()
        .title('Innstillinger')
        .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
      S.divider(),
      S.listItem()
        .title('Skjemaer')
        .child(S.documentTypeList('form').title('Skjemaer')),
      S.listItem()
        .title('Redirects')
        .child(S.documentTypeList('redirect').title('Redirects')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !['page', 'navigation', 'globalSettings', 'form', 'redirect'].includes(item.getId()!)
      )
    ])
```

---

## Recommended Plugins
```
sanity-plugin-media          # Media library
@sanity/color-input          # Color picker
@sanity/vision               # GROQ playground
sanity-plugin-iframe-pane    # Live preview
```

---

# Singleton Rules (Required)

## Purpose
Forhindre at redaktører oppretter duplikater av singleton-dokumenter.

## Singleton Document Types
- `navigation`
- `globalSettings`

## Requirements
Must be enforced in Studio:
- ❌ Prevent creating duplicates
- ❌ Prevent delete
- ✅ Force fixed documentId

## Studio Structure Enforcement
```ts
// /sanity/structure.ts
import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Innhold')
    .items([
      // ... other items
      
      // Singletons - locked to specific documentId
      S.listItem()
        .title('Navigasjon')
        .id('navigation')
        .child(
          S.document()
            .schemaType('navigation')
            .documentId('navigation')
        ),
      S.listItem()
        .title('Innstillinger')
        .id('globalSettings')
        .child(
          S.document()
            .schemaType('globalSettings')
            .documentId('globalSettings')
        ),
      
      // ... other items
      
      // Filter out singletons from document type list
      ...S.documentTypeListItems().filter(
        (item) => !['navigation', 'globalSettings', 'page', 'form', 'redirect'].includes(item.getId()!)
      )
    ])
```

## Schema-Level Protection
```ts
// schemas/site/navigation.ts
export default {
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  // Singleton enforcement
  __experimental_actions: ['update', 'publish'], // Remove 'create' and 'delete'
  fields: [
    // ... fields
  ]
}

// schemas/shared/globalSettings.ts
export default {
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  // Singleton enforcement
  __experimental_actions: ['update', 'publish'], // Remove 'create' and 'delete'
  fields: [
    // ... fields
  ]
}
```

## Initial Document Creation
Singletons must be created programmatically or via migration:
```ts
// sanity/migrations/createSingletons.ts
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function createSingletons() {
  // Create navigation if not exists
  const nav = await client.fetch(`*[_type == "navigation" && _id == "navigation"][0]`)
  if (!nav) {
    await client.create({
      _id: 'navigation',
      _type: 'navigation',
      mainNav: [],
      footerNav: []
    })
  }

  // Create globalSettings if not exists
  const settings = await client.fetch(`*[_type == "globalSettings" && _id == "globalSettings"][0]`)
  if (!settings) {
    await client.create({
      _id: 'globalSettings',
      _type: 'globalSettings'
    })
  }
}

createSingletons()
```

---

## Site Theme Schema (Redaktør-styrt)

### Purpose
Redaktører kan konfigurere visuell identitet direkte i Sanity Studio:
- Logo (light/dark/favicon)
- Fargepalett med color picker
- Typografi-valg

### Schema: siteTheme.ts
```
schemas/objects/siteTheme.ts
```

```ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteTheme',
  title: 'Site Theme',
  type: 'object',
  groups: [
    { name: 'logos', title: 'Logoer' },
    { name: 'colors', title: 'Farger' },
    { name: 'typography', title: 'Typografi' }
  ],
  fields: [
    // === LOGOS ===
    defineField({
      name: 'logo',
      title: 'Logo (Light Background)',
      type: 'image',
      group: 'logos',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' }
      ]
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (Dark Background)',
      type: 'image',
      group: 'logos',
      options: { hotspot: true },
      description: 'Valgfri – brukes på mørk bakgrunn'
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'logos',
      description: '32x32 eller 64x64 px'
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OpenGraph Image',
      type: 'image',
      group: 'logos',
      description: 'Standard delingsbilde (1200x630)'
    }),

    // === COLORS ===
    defineField({
      name: 'colors',
      title: 'Fargepalett',
      type: 'object',
      group: 'colors',
      fields: [
        { name: 'primary', title: 'Primary', type: 'color' },
        { name: 'secondary', title: 'Secondary', type: 'color' },
        { name: 'tertiary', title: 'Tertiary', type: 'color' },
        { name: 'background', title: 'Background', type: 'color' },
        { name: 'surface', title: 'Surface', type: 'color' },
        { name: 'textPrimary', title: 'Text Primary', type: 'color' },
        { name: 'textSecondary', title: 'Text Secondary', type: 'color' }
      ]
    }),
    defineField({
      name: 'buttonColors',
      title: 'Knapp-farger',
      type: 'object',
      group: 'colors',
      fields: [
        {
          name: 'primary',
          title: 'Primary Button',
          type: 'object',
          fields: [
            { name: 'background', type: 'color', title: 'Background' },
            { name: 'text', type: 'color', title: 'Text' }
          ]
        },
        {
          name: 'secondary',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            { name: 'background', type: 'color', title: 'Background' },
            { name: 'text', type: 'color', title: 'Text' }
          ]
        }
      ]
    }),

    // === TYPOGRAPHY ===
    defineField({
      name: 'typography',
      title: 'Typografi',
      type: 'object',
      group: 'typography',
      fields: [
        {
          name: 'headingFont',
          title: 'Heading Font',
          type: 'string',
          options: {
            list: [
              { title: 'Inter', value: 'Inter' },
              { title: 'Playfair Display', value: 'Playfair Display' },
              { title: 'Montserrat', value: 'Montserrat' },
              { title: 'Roboto', value: 'Roboto' },
              { title: 'Open Sans', value: 'Open Sans' },
              { title: 'Poppins', value: 'Poppins' },
              { title: 'Lato', value: 'Lato' },
              { title: 'Oswald', value: 'Oswald' },
              { title: 'Merriweather', value: 'Merriweather' },
              { title: 'Raleway', value: 'Raleway' }
            ]
          }
        },
        {
          name: 'bodyFont',
          title: 'Body Font',
          type: 'string',
          options: {
            list: [
              { title: 'Inter', value: 'Inter' },
              { title: 'Roboto', value: 'Roboto' },
              { title: 'Open Sans', value: 'Open Sans' },
              { title: 'Lato', value: 'Lato' },
              { title: 'Source Sans Pro', value: 'Source Sans Pro' },
              { title: 'Nunito', value: 'Nunito' },
              { title: 'Work Sans', value: 'Work Sans' }
            ]
          }
        },
        {
          name: 'customHeadingFont',
          title: 'Custom Heading Font (Google Fonts)',
          type: 'string',
          description: 'Overstyr med egendefinert Google Font-navn'
        },
        {
          name: 'customBodyFont',
          title: 'Custom Body Font (Google Fonts)',
          type: 'string',
          description: 'Overstyr med egendefinert Google Font-navn'
        }
      ]
    })
  ],
  preview: {
    select: {
      primary: 'colors.primary.hex',
      secondary: 'colors.secondary.hex',
      logo: 'logo'
    },
    prepare({ primary, secondary, logo }) {
      return {
        title: 'Site Theme',
        subtitle: `${primary ?? 'No primary'} / ${secondary ?? 'No secondary'}`,
        media: logo
      }
    }
  }
})
```
