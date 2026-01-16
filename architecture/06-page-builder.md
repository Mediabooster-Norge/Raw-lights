# Page Builder

## Block Registry
```
/lib/components/blocks/registry.ts
```

Pattern:
```ts
export const blockRegistry = {
  hero: HeroBlock,
  cta: CtaBlock,
  section: SectionBlock,
  gallery: GalleryBlock
}
```

---

## Page Renderer
```ts
export function PageRenderer({ blocks }) {
  return blocks.map((b) => {
    const Component = blockRegistry[b._type]
    return <Component key={b._key} data={b} />
  })
}
```

---

## Block Fallback / Unknown Blocks

### Rules
- `_type` not in registry → render `UnknownBlock` in dev, skip in prod
- Component not implemented → same handling
- Always log warning in dev

### Implementation
```ts
import { UnknownBlock } from './UnknownBlock'

const isDev = process.env.NODE_ENV === 'development'

export function PageRenderer({ blocks }) {
  return blocks.map((block) => {
    const Component = blockRegistry[block._type]
    
    if (!Component) {
      if (isDev) {
        console.warn(`[PageRenderer] Unknown block type: ${block._type}`)
        return <UnknownBlock key={block._key} type={block._type} data={block} />
      }
      return null // Silent skip in prod
    }
    
    return <Component key={block._key} data={block} />
  })
}
```

### UnknownBlock Component
```
/lib/components/blocks/UnknownBlock.tsx
```

```tsx
export function UnknownBlock({ type, data }: { type: string; data: unknown }) {
  return (
    <section className="bg-yellow-100 border-2 border-yellow-400 p-6 my-4 rounded">
      <p className="font-bold text-yellow-800">⚠️ Unknown block: {type}</p>
      <pre className="text-xs mt-2 overflow-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  )
}
```

---

## Block Schema Options
- background: enum fra theme.palette
- textColor: enum fra theme.palette

Example Sanity schema fields:
```ts
{
  name: 'background',
  type: 'string',
  options: { list: ['primary','secondary','tertiary','background','surface'] }
}
```

---

## Error Boundary per Block

### Purpose
Forhindrer at én feilende block krasjer hele siden.

### BlockErrorBoundary Component
```
/lib/components/blocks/BlockErrorBoundary.tsx
```

```tsx
'use client'
import { Component, ReactNode } from 'react'

type Props = {
  children: ReactNode
  blockType: string
  blockKey: string
}

type State = {
  hasError: boolean
  error?: Error
}

export class BlockErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[BlockError] ${this.props.blockType}:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <section className="bg-red-100 border-2 border-red-400 p-6 my-4 rounded">
            <p className="font-bold text-red-800">
              ❌ Block Error: {this.props.blockType}
            </p>
            <pre className="text-xs mt-2 text-red-600">
              {this.state.error?.message}
            </pre>
          </section>
        )
      }
      // Silent fail in production
      return null
    }

    return this.props.children
  }
}
```

### Updated PageRenderer with Error Boundaries
```tsx
// /lib/components/blocks/PageRenderer.tsx
import { BlockErrorBoundary } from './BlockErrorBoundary'
import { UnknownBlock } from './UnknownBlock'
import { blockRegistry } from './registry'

const isDev = process.env.NODE_ENV === 'development'

export function PageRenderer({ blocks }: { blocks: SanityBlock[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block) => {
        const Component = blockRegistry[block._type]

        if (!Component) {
          if (isDev) {
            console.warn(`[PageRenderer] Unknown block type: ${block._type}`)
            return <UnknownBlock key={block._key} type={block._type} data={block} />
          }
          return null
        }

        return (
          <BlockErrorBoundary
            key={block._key}
            blockType={block._type}
            blockKey={block._key}
          >
            <Component data={block} />
          </BlockErrorBoundary>
        )
      })}
    </>
  )
}
```

---

# Page Builder Theme Guardrails (Required)

The page builder must enforce strict separation between:
- Global theme control
- Section-level styling
- Block-level content

Redaktører must never be allowed to freely combine arbitrary colors, text colors or styles.

---

## Section-First Styling Rule

All visual styling must be applied at **section level**, not per block.

Required:
- All pages are composed of `sectionBlock`
- All content blocks must be children of a section
- Sections control:
  - background
  - spacing
  - themeVariant

Blocks inside a section must inherit styles unless explicitly allowed.

---

## Root Block Rule (Required)

Only `sectionBlock` is allowed at page root level.
Hero must always be inside a sectionBlock.
**No exceptions.**

Rationale:
- Allowing heroBlock at root level creates inconsistency
- Editors will mix section-wrapped and unwrapped blocks over time
- Enforcing section-first ensures consistent spacing and theming

If hero needs full-bleed styling, configure sectionBlock with:
- `spacing: 'none'`
- `background: 'primary'` or `'secondary'`

---

## Page Schema Update (Required)

Page blocks array must only allow sectionBlock at root level:

```ts
// schemas/site/page.ts - blocks field
{
  name: 'blocks',
  title: 'Page Sections',
  type: 'array',
  of: [
    { type: 'sectionBlock' }
  ]
}
```

---

## sectionBlock Schema Rules

### sectionBlock fields:
- background (enum: primary | secondary | background | surface)
- spacing (enum: default | compact | spacious)
- themeVariant (enum: default | inverted)
- children (array of content blocks)

Rules:
- sectionBlock is the ONLY block allowed to control background color
- sectionBlock must wrap one or more content blocks
- Nested sections are not allowed

### sectionBlock Schema
```ts
// schemas/blocks/sectionBlock.ts
export default {
  name: 'sectionBlock',
  title: 'Section',
  type: 'object',
  fields: [
    {
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Background', value: 'background' },
          { title: 'Surface', value: 'surface' }
        ]
      },
      initialValue: 'background'
    },
    {
      name: 'spacing',
      title: 'Spacing',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Compact', value: 'compact' },
          { title: 'Spacious', value: 'spacious' }
        ]
      },
      initialValue: 'default'
    },
    {
      name: 'themeVariant',
      title: 'Theme Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Inverted', value: 'inverted' }
        ]
      },
      initialValue: 'default'
    },
    {
      name: 'children',
      title: 'Content Blocks',
      type: 'array',
      of: [
        { type: 'heroBlock' },
        { type: 'textBlock' },
        { type: 'listingBlock' },
        { type: 'featuredItemsBlock' },
        { type: 'scheduleBlock' },
        { type: 'galleryBlock' },
        { type: 'ctaBlock' },
        { type: 'partnersBlock' },
        { type: 'formBlock' },
        { type: 'embedBlock' },
        { type: 'accordionBlock' },
        { type: 'mapBlock' },
        { type: 'spacerBlock' }
      ]
    }
  ]
}
```

---

## Block-Level Theme Restrictions

Blocks must NOT expose full theme controls.

### heroBlock
Allowed:
- background (enum: primary | secondary)
- textColor (enum: auto | onPrimary | onSecondary)

Rules:
- Default textColor = auto
- auto resolves via theme (onPrimary / onSecondary)

### ctaBlock
Allowed:
- variant (enum: primary | secondary)

Rules:
- No manual background or text color selection
- Styling is fully controlled by theme tokens

### All Other Blocks
Rules:
- No background selection
- No textColor selection
- Always inherits section styling

---

## Theme Token Usage Rules

- Blocks may only reference theme tokens
- Blocks must never define raw colors
- Blocks must never define font sizes or spacing
- All visual values must resolve via CSS variables

### CSS Variable Pattern
```tsx
// Section component applies CSS variables
<section
  style={{
    '--section-bg': `var(--color-${background})`,
    '--section-text': resolveTextColor(background, 'auto', theme),
    '--section-spacing': spacingMap[spacing]
  }}
  className="bg-[var(--section-bg)] text-[var(--section-text)] py-[var(--section-spacing)]"
>
  {children}
</section>
```

### Block Styling Pattern
```tsx
// Blocks inherit section variables
<div className="text-[var(--section-text)]">
  {/* Block content */}
</div>
```

---

## Editor Guardrails

Redaktører skal aldri kunne:
- ❌ Sette egne farger (hex/rgb)
- ❌ Kombinere vilkårlige background/textColor
- ❌ Bryte visuell konsistens
- ❌ Override spacing med egne verdier
- ❌ Endre font sizes per block

Alle begrensninger håndheves via:
- ✅ Schema `options.list` enums
- ✅ `hidden` fields for restricted options
- ✅ Validation rules
- ✅ Default values

Ingen visuell frihet håndheves via opplæring – kun via system.

---

## Summary

| Layer | Controls | Responsibility |
|-------|----------|----------------|
| Theme | Tokens | Colors, fonts, spacing values |
| Section | Styling | Background, spacing, variant |
| Block | Content | Text, images, data |

Defaults are always safe:
- background: `background`
- spacing: `default`
- themeVariant: `default`
- textColor: `auto`
