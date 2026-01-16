# API Routes & Webhooks

## Sanity Webhooks (On-Demand Revalidation)

### Webhook Endpoint
```
/app/api/revalidate/route.ts
```

```ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    // Revalidate based on document type
    switch (body._type) {
      case 'page':
        if (body.slug?.current) {
          revalidatePath(`/${body.slug.current}`)
        }
        revalidateTag('pages')
        break
      case 'globalSettings':
        revalidateTag('global-settings')
        revalidatePath('/', 'layout')
        break
      case 'navigation':
        revalidateTag('navigation')
        revalidatePath('/', 'layout')
        break
      default:
        revalidateTag(body._type)
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
```

### Sanity Webhook Setup (sanity.io dashboard)
```
URL: https://{domain}/api/revalidate
Trigger: Create, Update, Delete
Filter: _type in ["page", "globalSettings", "navigation"]
Secret: Same as SANITY_WEBHOOK_SECRET
HTTP method: POST
```

---

## Rate Limiting (API Routes)

### Purpose
Beskytt API-routes mot misbruk.

### Simple In-Memory Rate Limiter
```
/lib/utils/rateLimit.ts
```

```ts
type RateLimitConfig = {
  interval: number // ms
  maxRequests: number
}

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (identifier: string): { success: boolean; remaining: number } => {
      const now = Date.now()
      const record = rateLimitMap.get(identifier)

      if (!record || now - record.timestamp > config.interval) {
        rateLimitMap.set(identifier, { count: 1, timestamp: now })
        return { success: true, remaining: config.maxRequests - 1 }
      }

      if (record.count >= config.maxRequests) {
        return { success: false, remaining: 0 }
      }

      record.count++
      return { success: true, remaining: config.maxRequests - record.count }
    }
  }
}
```

### Usage in API Route
```ts
// /app/api/forms/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/utils/rateLimit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, remaining } = limiter.check(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        }
      }
    )
  }

  // ... rest of handler
}
```

### Rate Limit Rules
| Route | Interval | Max Requests |
|-------|----------|--------------|
| `/api/forms` | 1 min | 5 |
| `/api/revalidate` | 1 min | 20 |
| `/api/preview` | 1 min | 10 |

---

## API Integrations Layer
```
/lib/integrations/ticketmaster.ts
/lib/integrations/tickster.ts
```
- fetch
- cache
- transform responses
