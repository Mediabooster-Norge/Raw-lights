# Ticket Integration Contract (Required)

## Purpose
Standardisert integrasjon med billettleverandører (Ticketmaster, Tickster).

---

## eventItem Schema Update
```ts
// schemas/site/eventItem.ts - Add ticket fields
{
  name: 'ticketing',
  title: 'Billetter',
  type: 'object',
  fields: [
    {
      name: 'provider',
      title: 'Billettleverandør',
      type: 'string',
      options: {
        list: [
          { title: 'Ingen', value: 'none' },
          { title: 'Ticketmaster', value: 'ticketmaster' },
          { title: 'Tickster', value: 'tickster' },
          { title: 'Extern lenke', value: 'external' }
        ]
      },
      initialValue: 'none'
    },
    {
      name: 'ticketId',
      title: 'Ticket ID',
      type: 'string',
      description: 'Event ID hos billettleverandør',
      hidden: ({ parent }) => !['ticketmaster', 'tickster'].includes(parent?.provider)
    },
    {
      name: 'externalUrl',
      title: 'Ekstern billett-URL',
      type: 'url',
      hidden: ({ parent }) => parent?.provider !== 'external'
    },
    {
      name: 'buttonText',
      title: 'Knappetekst',
      type: 'string',
      initialValue: 'Kjøp billetter'
    },
    {
      name: 'soldOut',
      title: 'Utsolgt',
      type: 'boolean',
      initialValue: false
    }
  ]
}
```

---

## Ticket URL Builder
```ts
// /lib/utils/ticketUrl.ts
type TicketProvider = 'none' | 'ticketmaster' | 'tickster' | 'external'

type Ticketing = {
  provider: TicketProvider
  ticketId?: string
  externalUrl?: string
}

const providerUrls: Record<string, (id: string) => string> = {
  ticketmaster: (id) => `https://www.ticketmaster.no/event/${id}`,
  tickster: (id) => `https://www.tickster.com/no/events/${id}`
}

export function getTicketUrl(ticketing?: Ticketing): string | null {
  if (!ticketing || ticketing.provider === 'none') {
    return null
  }

  if (ticketing.provider === 'external') {
    return ticketing.externalUrl ?? null
  }

  if (ticketing.ticketId && providerUrls[ticketing.provider]) {
    return providerUrls[ticketing.provider](ticketing.ticketId)
  }

  return null
}
```

---

## Ticket Button Component
```tsx
// /lib/components/ui/TicketButton.tsx
import { getTicketUrl } from '@/lib/utils/ticketUrl'

type Ticketing = {
  provider: 'none' | 'ticketmaster' | 'tickster' | 'external'
  ticketId?: string
  externalUrl?: string
  buttonText?: string
  soldOut?: boolean
}

type TicketButtonProps = {
  ticketing?: Ticketing
  className?: string
}

export function TicketButton({ ticketing, className }: TicketButtonProps) {
  if (!ticketing || ticketing.provider === 'none') {
    return null
  }

  const url = getTicketUrl(ticketing)
  const text = ticketing.buttonText ?? 'Kjøp billetter'

  if (ticketing.soldOut) {
    return (
      <button disabled className={`${className} opacity-50 cursor-not-allowed`}>
        Utsolgt
      </button>
    )
  }

  if (!url) {
    return null
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {text}
    </a>
  )
}
```

---

## GROQ Query for Ticket Data
```groq
*[_type == "eventItem" && slug.current == $slug][0] {
  ...,
  ticketing {
    provider,
    ticketId,
    externalUrl,
    buttonText,
    soldOut
  }
}
```

---

## TypeScript Types
```ts
// /lib/types/sanity.ts - Add ticket types
export type TicketProvider = 'none' | 'ticketmaster' | 'tickster' | 'external'

export type SanityTicketing = {
  provider: TicketProvider
  ticketId?: string
  externalUrl?: string
  buttonText?: string
  soldOut?: boolean
}

export type SanityEventItem = {
  _id: string
  _type: 'eventItem'
  title: string
  slug: { current: string }
  // ... other fields
  ticketing?: SanityTicketing
}
```

---

## Full eventItem Fields (Updated)
```ts
// schemas/site/eventItem.ts
export default {
  name: 'eventItem',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'contentType', type: 'reference', to: [{ type: 'contentType' }] },
    { name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] },
    { name: 'startDate', type: 'datetime' },
    { name: 'endDate', type: 'datetime' },
    { name: 'location', type: 'string' },
    { name: 'venue', type: 'reference', to: [{ type: 'venue' }] },
    { name: 'image', type: 'imageWithAlt' },
    { name: 'description', type: 'text' },
    { name: 'body', type: 'richText' },
    { name: 'cta', type: 'cta' },
    // Ticket integration
    {
      name: 'ticketing',
      title: 'Billetter',
      type: 'object',
      fields: [
        {
          name: 'provider',
          title: 'Billettleverandør',
          type: 'string',
          options: {
            list: [
              { title: 'Ingen', value: 'none' },
              { title: 'Ticketmaster', value: 'ticketmaster' },
              { title: 'Tickster', value: 'tickster' },
              { title: 'Ekstern lenke', value: 'external' }
            ]
          },
          initialValue: 'none'
        },
        {
          name: 'ticketId',
          title: 'Ticket ID',
          type: 'string',
          hidden: ({ parent }) => !['ticketmaster', 'tickster'].includes(parent?.provider)
        },
        {
          name: 'externalUrl',
          title: 'Ekstern billett-URL',
          type: 'url',
          hidden: ({ parent }) => parent?.provider !== 'external'
        },
        {
          name: 'buttonText',
          title: 'Knappetekst',
          type: 'string',
          initialValue: 'Kjøp billetter'
        },
        {
          name: 'soldOut',
          title: 'Utsolgt',
          type: 'boolean',
          initialValue: false
        }
      ]
    },
    { name: 'featured', type: 'boolean' },
    {
      name: 'visibility',
      type: 'string',
      options: { list: ['public', 'hidden'] },
      initialValue: 'public'
    },
    { name: 'publishDate', type: 'datetime' }
  ]
}
```
