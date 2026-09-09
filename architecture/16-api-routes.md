# API routes

| Route | Role |
|-------|------|
| `/api/draft` | Enable draft mode (Presentation) |
| `/api/preview` | Enable draft with `SANITY_PREVIEW_SECRET` |
| `/api/preview/disable` | Exit draft |
| `/api/revalidate` | Sanity webhook, `x-webhook-secret` |
| `/api/forms` | Form POST → Resend |

Locale routing and redirects live in `proxy.ts`, not in an API route.
