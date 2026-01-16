# Content Rendering

## Portable Text (Rich Text)

### Schema: blockContent.ts
```
schemas/objects/blockContent.ts
```

```ts
export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' }
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' }
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              { name: 'href', type: 'url', title: 'URL' },
              { name: 'blank', type: 'boolean', title: 'Open in new tab' }
            ]
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                to: [{ type: 'page' }]
              }
            ]
          }
        ]
      }
    },
    { type: 'image', options: { hotspot: true } },
    { type: 'youtube' },
    { type: 'codeBlock' }
  ]
}
```

---

## PortableText Component
```
/lib/components/ui/PortableText.tsx
```

```tsx
import { PortableText as SanityPortableText } from '@portabletext/react'
import Link from 'next/link'
import { SanityImage } from './SanityImage'

const components = {
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-medium mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>
  },
  marks: {
    link: ({ children, value }) => {
      const target = value?.blank ? '_blank' : undefined
      return (
        <a href={value?.href} target={target} rel={target ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      )
    },
    internalLink: ({ children, value }) => (
      <Link href={`/${value?.reference?.slug?.current}`}>{children}</Link>
    )
  },
  types: {
    image: ({ value }) => <SanityImage image={value} className="my-6 rounded-lg" />,
    youtube: ({ value }) => (
      <div className="aspect-video my-6">
        <iframe
          src={`https://www.youtube.com/embed/${value.videoId}`}
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
      </div>
    )
  }
}

export function PortableText({ value }) {
  return <SanityPortableText value={value} components={components} />
}
```

---

## YouTube Object Schema
```ts
export default {
  name: 'youtube',
  title: 'YouTube Video',
  type: 'object',
  fields: [
    { name: 'videoId', title: 'Video ID', type: 'string' }
  ]
}
```

---

## Link Object Schema

### Schema: link.ts
```
schemas/objects/link.ts
```

```ts
export default {
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' }
        ],
        layout: 'radio'
      },
      initialValue: 'internal'
    },
    {
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.type !== 'internal'
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'external'
    },
    {
      name: 'label',
      title: 'Label',
      type: 'string'
    },
    {
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false
    }
  ]
}
```

---

## Link Component
```
/lib/components/ui/SanityLink.tsx
```

```tsx
import Link from 'next/link'

export function SanityLink({ link, children, className }) {
  if (!link) return null

  const isExternal = link.type === 'external'
  const href = isExternal ? link.externalUrl : `/${link.internalLink?.slug?.current}`
  const target = link.openInNewTab ? '_blank' : undefined

  if (isExternal) {
    return (
      <a href={href} target={target} rel={target ? 'noopener noreferrer' : undefined} className={className}>
        {children || link.label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children || link.label}
    </Link>
  )
}
```

---

## CTA Button Schema
```
schemas/objects/cta.ts
```

```ts
export default {
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    { name: 'link', type: 'link' },
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
          { title: 'Ghost', value: 'ghost' }
        ]
      },
      initialValue: 'primary'
    }
  ]
}
```

---

## Image Optimization Rules
Use Sanity image pipeline.

```
/lib/components/ui/SanityImage.tsx
```

Pattern:
```tsx
<Image
  src={urlFor(img).width(2000).auto('format').url()}
  alt={alt}
  width={2000}
  height={1200}
  loading="lazy"
/>
```
