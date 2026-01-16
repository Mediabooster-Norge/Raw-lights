# Sanity + Next 16 Multisite Architecture

Dette er arkitekturdokumentasjonen for multisite-plattformen.

## Cursor-regler

Cursor skal:
- følge **nyeste offisielle best practices** for Next.js (App Router, Server Components, Metadata API, caching, Edge/Node runtimes)
- følge **nyeste offisielle best practices** for Sanity (Content Lake, GROQ, datasets, Studio v3, preview, security)
- være **kritisk til valg** og alltid velge den mest robuste, skalerbare og fremtidsrettede løsningen
- aldri bruke deprecated APIs, mønstre eller uoffisielle workarounds
- prioritere **ytelse, sikkerhet, skalerbarhet og redaktøropplevelse**
- anta **høy trafikk, flere nettsteder og langsiktig drift**

Cursor skal:
- ikke forenkle
- ikke anta
- ikke improvisere
- ikke introdusere egne mønstre

Kun det som er eksplisitt definert i disse dokumentene skal implementeres.
Hvis noe er uklart eller mangler, skal Cursor velge det **sikreste og mest konservative alternativet** som følger offisiell dokumentasjon.

---

## Dokumentstruktur

| Fil | Innhold |
|-----|---------|
| [01-environment.md](./01-environment.md) | Environment variables, validering |
| [02-directory-structure.md](./02-directory-structure.md) | Mappestruktur |
| [03-multisite-routing.md](./03-multisite-routing.md) | Middleware, DatasetRouter, domene-mapping |
| [04-theme-system.md](./04-theme-system.md) | Theme, farger, typografi, CSS-variabler |
| [05-components.md](./05-components.md) | Komponentbibliotek, UI-komponenter |
| [06-page-builder.md](./06-page-builder.md) | Block registry, PageRenderer, section-regler |
| [07-sanity-schemas.md](./07-sanity-schemas.md) | Alle schema-definisjoner |
| [08-sanity-studio.md](./08-sanity-studio.md) | Studio config, struktur, singletons |
| [09-content-rendering.md](./09-content-rendering.md) | Portable Text, lenker, bilder |
| [10-navigation.md](./10-navigation.md) | Navigasjon, Header/Footer |
| [11-seo.md](./11-seo.md) | SEO, metadata, sitemap, structured data |
| [12-data-fetching.md](./12-data-fetching.md) | GROQ queries, caching, revalidation |
| [13-preview.md](./13-preview.md) | Preview mode, draft mode |
| [14-forms.md](./14-forms.md) | Skjema-system |
| [15-error-handling.md](./15-error-handling.md) | Error boundaries, 404, loading |
| [16-api-routes.md](./16-api-routes.md) | API routes, webhooks, rate limiting |
| [17-redirects.md](./17-redirects.md) | Redirects, ytelsesregler |
| [18-deployment.md](./18-deployment.md) | Vercel, security headers, dependencies |
| [19-integrations.md](./19-integrations.md) | Billett-integrasjon, eksterne APIer |
| [20-security.md](./20-security.md) | Custom code injection, tilgangskontroll |
