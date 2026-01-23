# Sanity + Next.js Headless CMS Starter

Dette er en fleksibel starter template for headless CMS prosjekter med Sanity og Next.js.

## Fleksibel Arkitektur

Templaten støtter både **single-site** og **multisite** prosjekter:

### Single-site modus (default)
- Enkel oppsett uten ekstra konfigurasjon
- Ingen site-felt på dokumenter
- Singleton-struktur for Navigation og GlobalSettings
- Perfekt for enkle nettsteder

### Multisite modus (valgfri)
- Aktiveres med `NEXT_PUBLIC_MULTISITE_ENABLED=true`
- Site-felt på alle dokumenter
- Queries filtrerer på siteId
- Studio gruppert etter nettsted
- Ett datasett for alle sites

---

## Hurtigstart

### Single-site prosjekt
```env
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_MULTISITE_ENABLED=false  # eller bare utelat
```

### Multisite prosjekt
```env
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_MULTISITE_ENABLED=true
```

---

## Cursor-regler

Cursor skal:
- følge **nyeste offisielle best practices** for Next.js (App Router, Server Components, Metadata API, caching)
- følge **nyeste offisielle best practices** for Sanity (Content Lake, GROQ, Studio v3, preview)
- være **kritisk til valg** og alltid velge den mest robuste løsningen
- aldri bruke deprecated APIs eller uoffisielle workarounds
- prioritere **ytelse, sikkerhet, skalerbarhet og redaktøropplevelse**

---

## Dokumentstruktur

| Fil | Innhold |
|-----|---------|
| [01-environment.md](./01-environment.md) | Environment variables, validering |
| [02-directory-structure.md](./02-directory-structure.md) | Mappestruktur |
| [03-multisite-routing.md](./03-multisite-routing.md) | Single-site og multisite routing |
| [04-theme-system.md](./04-theme-system.md) | Theme, farger, typografi |
| [05-components.md](./05-components.md) | Komponentbibliotek |
| [06-page-builder.md](./06-page-builder.md) | Block registry, PageRenderer |
| [07-sanity-schemas.md](./07-sanity-schemas.md) | Alle schema-definisjoner |
| [08-sanity-studio.md](./08-sanity-studio.md) | Studio config |
| [09-content-rendering.md](./09-content-rendering.md) | Portable Text, lenker, bilder |
| [10-navigation.md](./10-navigation.md) | Navigasjon, Header/Footer |
| [11-seo.md](./11-seo.md) | SEO, metadata, sitemap |
| [12-data-fetching.md](./12-data-fetching.md) | GROQ queries, caching |
| [13-preview.md](./13-preview.md) | Preview mode, draft mode |
| [14-forms.md](./14-forms.md) | Skjema-system |
| [15-error-handling.md](./15-error-handling.md) | Error boundaries, 404 |
| [16-api-routes.md](./16-api-routes.md) | API routes, webhooks |
| [17-redirects.md](./17-redirects.md) | Redirects |
| [18-deployment.md](./18-deployment.md) | Vercel, security |
| [19-integrations.md](./19-integrations.md) | Eksterne APIer |
| [20-security.md](./20-security.md) | Sikkerhet |

---

## Nøkkelkonsepter

### Konfigurasjonsflagg
```ts
// lib/config/multisite.ts
export function isMultisiteEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MULTISITE_ENABLED === 'true'
}
```

### Betinget Site-felt
Schemas bruker en helper som inkluderer site-feltet kun når multisite er aktivert:

```ts
// schemas/helpers/siteField.ts
export function getSiteField() {
  if (!isMultisiteEnabled) return []
  return [defineField({ name: 'site', type: 'reference', to: [{ type: 'site' }] })]
}

// Bruk i schema:
fields: [
  ...getSiteField(),
  // andre felter...
]
```

### Fleksible Queries
Queries håndterer begge moduser med en smart filter:

```groq
// Hvis siteId er null (single-site), ignoreres filteret
const SITE_FILTER = `(!defined($siteId) || site->siteId.current == $siteId)`
```

---

## Migrering fra Single-site til Multisite

1. Sett `NEXT_PUBLIC_MULTISITE_ENABLED=true` i .env
2. Restart dev server
3. Opprett site-dokumenter i Studio
4. Legg til site-referanse på eksisterende innhold
5. (Valgfritt) Opprett flere site-dokumenter for flere nettsteder
