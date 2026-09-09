# Sanity + Next.js starter

Internal model for this single-site CMS. Clone per customer. One dataset (`production`), two locales (`nb`, `en`).

## Stack

- Next.js 16 App Router, React 19
- Sanity v6, `next-sanity` 13, Studio at `/studio`
- Tailwind CSS
- Document-level translations via `@sanity/document-internationalization`

## Documents

| File | Content |
|------|---------|
| [01-environment.md](./01-environment.md) | Environment variables |
| [02-directory-structure.md](./02-directory-structure.md) | Folders |
| [03-i18n-routing.md](./03-i18n-routing.md) | Locales, proxy, language switcher |
| [04-theme-system.md](./04-theme-system.md) | Theme from Studio colors and fonts |
| [05-components.md](./05-components.md) | Component library |
| [06-page-builder.md](./06-page-builder.md) | Block registry |
| [07-sanity-schemas.md](./07-sanity-schemas.md) | Schemas |
| [08-sanity-studio.md](./08-sanity-studio.md) | Studio |
| [09-content-rendering.md](./09-content-rendering.md) | Portable Text, links, images |
| [10-navigation.md](./10-navigation.md) | Header and footer |
| [11-seo.md](./11-seo.md) | Metadata, hreflang, JSON-LD |
| [12-data-fetching.md](./12-data-fetching.md) | GROQ and cache tags |
| [13-preview.md](./13-preview.md) | Draft mode and Presentation |
| [14-forms.md](./14-forms.md) | Forms and Resend |
| [15-error-handling.md](./15-error-handling.md) | 404 and boundaries |
| [16-api-routes.md](./16-api-routes.md) | API routes |
| [17-redirects.md](./17-redirects.md) | CMS redirects |
| [18-deployment.md](./18-deployment.md) | Vercel |
| [19-integrations.md](./19-integrations.md) | External services |
| [20-security.md](./20-security.md) | Security |

## Rules of the template

- One site, one dataset, no multisite flag
- `nb` has no prefix; `en` uses `/en`
- JSON-LD is built in `lib/seo`, not pasted per post
- Homepage and 404 are chosen in global settings
- Visibility is `public` / `hidden`
- `NEXT_PUBLIC_*` must not be Sensitive on Vercel
