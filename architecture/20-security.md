# Security & Access Control

## Custom Code Injection Guardrails (Required)

### Access Control
Only users with `administrator` role can edit `customCode` fields.

### Schema-Level Restriction
```ts
// schemas/shared/globalSettings.ts
{
  name: 'customCode',
  title: 'Custom Code',
  type: 'customCode',
  group: 'code',
  hidden: ({ currentUser }) => 
    !currentUser?.roles?.some(r => r.name === 'administrator')
}
```

---

## Validation Rules
`customCode` fields must validate against dangerous patterns.

### Blocked Patterns
- ❌ `<script src="http://...">` - Insecure HTTP sources
- ❌ `<iframe>` - Unless explicitly allowed per field
- ❌ `javascript:` protocol
- ❌ `data:` protocol in src attributes
- ❌ `on*` event handlers (onclick, onerror, etc.)

### Schema Validation
```ts
// schemas/objects/customCode.ts
export default {
  name: 'customCode',
  title: 'Custom Code',
  type: 'object',
  fields: [
    {
      name: 'headScripts',
      title: 'Head Scripts',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.custom(validateScript)
    },
    {
      name: 'bodyStartScripts',
      title: 'Body Start Scripts',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.custom(validateScript)
    },
    {
      name: 'footerScripts',
      title: 'Footer Scripts',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.custom(validateScript)
    }
  ]
}

function validateScript(value: string | undefined) {
  if (!value) return true

  const blockedPatterns = [
    { pattern: /src\s*=\s*["']http:\/\//gi, message: 'HTTP sources not allowed. Use HTTPS.' },
    { pattern: /<iframe/gi, message: 'Iframes not allowed in custom code. Use embedBlock instead.' },
    { pattern: /javascript:/gi, message: 'javascript: protocol not allowed.' },
    { pattern: /data:/gi, message: 'data: protocol not allowed.' },
    { pattern: /\bon\w+\s*=/gi, message: 'Inline event handlers not allowed.' }
  ]

  for (const { pattern, message } of blockedPatterns) {
    if (pattern.test(value)) {
      return message
    }
  }

  return true
}
```

---

## Allowed Script Types
| Field | Allowed | Examples |
|-------|---------|----------|
| `headScripts` | Analytics, meta tags | Google Analytics, Meta Pixel |
| `bodyStartScripts` | GTM noscript | Google Tag Manager |
| `footerScripts` | Widgets, deferred | Chat widgets, Hubspot |

---

## Content Security Policy (CSP)
Consider adding CSP headers to restrict script sources:
```ts
// next.config.js
{
  key: 'Content-Security-Policy',
  value: "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;"
}
```

---

## Custom Code Fields (Script Injection)

### Purpose
Redaktører kan legge inn egendefinerte scripts (analytics, tracking, widgets) i head, body start og footer.

### Schema: customCode.ts
```
schemas/objects/customCode.ts
```

```ts
export default {
  name: 'customCode',
  title: 'Custom Code',
  type: 'object',
  fields: [
    {
      name: 'headScripts',
      title: 'Head Scripts',
      description: 'Scripts som legges i <head> (f.eks. analytics, meta-tags)',
      type: 'text',
      rows: 6
    },
    {
      name: 'bodyStartScripts',
      title: 'Body Start Scripts',
      description: 'Scripts som legges rett etter <body> (f.eks. GTM noscript)',
      type: 'text',
      rows: 6
    },
    {
      name: 'footerScripts',
      title: 'Footer Scripts',
      description: 'Scripts som legges før </body> (f.eks. chat widgets, deferred scripts)',
      type: 'text',
      rows: 6
    }
  ]
}
```

### Add to globalSettings.ts
```ts
{
  name: 'customCode',
  title: 'Custom Code',
  type: 'customCode'
}
```

### Next.js Layout Integration
```
/app/(sites)/[site]/layout.tsx
```

```tsx
import Script from 'next/script'

export default async function SiteLayout({ children, params }) {
  const settings = await getGlobalSettings(params.site)
  const { customCode } = settings || {}

  return (
    <html>
      <head>
        {customCode?.headScripts && (
          <Script
            id="head-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: customCode.headScripts }}
          />
        )}
      </head>
      <body>
        {customCode?.bodyStartScripts && (
          <div
            dangerouslySetInnerHTML={{ __html: customCode.bodyStartScripts }}
          />
        )}
        
        {children}
        
        {customCode?.footerScripts && (
          <Script
            id="footer-scripts"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{ __html: customCode.footerScripts }}
          />
        )}
      </body>
    </html>
  )
}
```

### Script Strategy Rules
| Placement | Next.js Strategy | Use Case |
|-----------|------------------|----------|
| head | `afterInteractive` | Analytics, critical tracking |
| bodyStart | Inline | GTM noscript, essential no-JS fallbacks |
| footer | `lazyOnload` | Chat widgets, non-critical scripts |

### Security Notes
- Kun redaktører med admin-tilgang bør kunne redigere custom code.
- Valider at scripts ikke inneholder skadelig kode via Sanity validering (valgfritt).

### Optional: Per-Page Custom Code
For page-level overrides, add customCode field til page schemas:
```ts
{
  name: 'customCode',
  title: 'Page-specific Scripts',
  type: 'customCode',
  hidden: ({ currentUser }) => !currentUser?.roles?.some(r => r.name === 'administrator')
}
```

---

## Global Settings Schema (Required)
```
schemas/shared/globalSettings.ts
```
- Default SEO
- Default OpenGraph
- Header config
- Footer config
- Logo + brand assets
- Custom code injection
- Site Theme (redaktør-styrte farger, typografi, logo)
