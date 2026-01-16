# Redirects (Sanity-Managed)

## Schema
```
schemas/shared/redirect.ts
```

```ts
export default {
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    {
      name: 'source',
      title: 'Source Path',
      type: 'string',
      description: 'Path to redirect from (e.g., /old-page)',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'destination',
      title: 'Destination',
      type: 'string',
      description: 'Path or URL to redirect to',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      initialValue: true,
      description: '301 (permanent) or 302 (temporary)'
    }
  ]
}
```

---

# Redirect Performance Rule (Required)

## Problem
Fetching redirects from Sanity inside middleware causes:
- Latency on every request
- Cold start delays
- Potential rate limiting issues
- Poor performance during high traffic events

## Rule
**Do NOT fetch redirects inside middleware in production.**

---

## Allowed Approaches

### Option 1: Build-Time (Recommended)
```ts
// next.config.js
const { createClient } = require('next-sanity')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true
})

async function getRedirects() {
  const redirects = await client.fetch(`
    *[_type == "redirect" && enabled == true] {
      "source": from,
      "destination": to,
      "permanent": type == "301"
    }
  `)
  return redirects
}

/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return getRedirects()
  }
}
```

### Option 2: Cached Redirect Map (Edge-Compatible)
```ts
// /lib/redirects/cache.ts
import { unstable_cache } from 'next/cache'
import { client } from '@/lib/sanity/client'

export const getCachedRedirects = unstable_cache(
  async () => {
    return client.fetch(`
      *[_type == "redirect" && enabled == true] {
        "source": from,
        "destination": to,
        "permanent": type == "301"
      }
    `)
  },
  ['redirects'],
  {
    revalidate: 3600, // 1 hour cache
    tags: ['redirects']
  }
)
```

### Option 3: Static JSON File (Zero Runtime)
Generate redirects to static JSON at build time:
```ts
// scripts/generate-redirects.ts
import { client } from '@/lib/sanity/client'
import fs from 'fs'

async function generateRedirects() {
  const redirects = await client.fetch(`*[_type == "redirect" && enabled == true]`)
  fs.writeFileSync('public/redirects.json', JSON.stringify(redirects))
}

generateRedirects()
```

---

## Middleware Pattern (If Required)
If middleware redirect checking is absolutely required, use edge-cached approach:
```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Import pre-generated redirects (not fetched at runtime)
import redirects from './redirects.json'

export function middleware(req: NextRequest) {
  const redirect = redirects.find(r => r.source === req.nextUrl.pathname)
  
  if (redirect) {
    return NextResponse.redirect(
      new URL(redirect.destination, req.url),
      redirect.permanent ? 308 : 307
    )
  }
  
  // ... rest of middleware
}
```

---

## Revalidation
When redirects are updated in Sanity:
1. Webhook triggers rebuild (Option 1) or cache invalidation (Option 2)
2. New redirects are active after deploy/revalidation
