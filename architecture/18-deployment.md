# Deployment & Build Targets

## Vercel Configuration
```
Build Command: next build
Output Directory: .next
Install Command: npm install
Node.js Version: v25
```

---

## Runtime Targets
| File | Runtime | Notes |
|------|---------|-------|
| `middleware.ts` | **Edge** | Må være edge for rask routing |
| `app/api/*` | Node.js | Standard serverless |
| `app/(sites)/*` | Node.js | SSR/ISR pages |

---

## Sanity Studio Multi-basePath
```ts
// sanity.config.ts
basePath: `/studio/${dataset}`

// Resulting paths:
// /studio/landstreff
// /studio/ypsilon
// /studio/julivinterland
```

---

## next.config.js
```ts
/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' }
    ]
  },
  experimental: {
    taint: true // Prevent tokens from leaking to client
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ]
  }
}

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]
```

---

## Environment per Deployment
| Environment | Dataset | Notes |
|-------------|---------|-------|
| Production | Per domain | Live sites |
| Preview | Same as prod | Draft content |
| Development | `landstreff` (default) | Local testing |

---

## Package Dependencies

### package.json
```json
{
  "name": "multisite-sanity-next",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typegen": "sanity schema extract && sanity typegen generate"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-sanity": "^9.0.0",
    "@sanity/image-url": "^1.0.2",
    "@sanity/vision": "^3.0.0",
    "@portabletext/react": "^3.0.0",
    "sanity": "^3.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0",
    "@sanity/color-input": "^4.0.0",
    "sanity-plugin-media": "^2.0.0"
  }
}
```

### Sanity Plugins
```bash
npm install @sanity/color-input sanity-plugin-media @sanity/vision
```

### Optional Dependencies
```json
{
  "optionalDependencies": {
    "sanity-plugin-iframe-pane": "^3.0.0",
    "@sanity/assist": "^3.0.0",
    "resend": "^3.0.0"
  }
}
```

---

## Boilerplate Generation Rules for Cursor
1. Følg mappestrukturen nøyaktig.
2. Generer alle tomme filer med eksport-stubs.
3. Theme-system må være implementert fullt.
4. Page renderer + block registry må inkluderes.
5. CSS-variabler må genereres fra theme.
6. Sanity integrasjon må bruke datasetRouter.
7. Ingen schemas genereres før workshop (lag tomme mapper).
8. Ingen forklarende tekst i kode — kun implementasjon.
