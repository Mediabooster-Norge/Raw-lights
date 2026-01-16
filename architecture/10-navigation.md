# Navigation System

## File Structure
```
schemas/site/navigation.ts
lib/components/layout/Header.tsx
lib/components/layout/Footer.tsx
```

Rules:
- mainNav: array of links
- footerNav: array of links
- Each site has its own navigation document

---

## Header/Footer Rendering Contract

### Data Source
Header og Footer henter **alltid** data fra `navigation` document – aldri hardkodet per side.

---

## Navigation Schema
```ts
// schemas/site/navigation.ts
export default {
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    {
      name: 'mainNav',
      title: 'Main Navigation',
      type: 'array',
      of: [{ type: 'navItem' }]
    },
    {
      name: 'headerCta',
      title: 'Header CTA',
      type: 'cta'
    },
    {
      name: 'footerNav',
      title: 'Footer Navigation',
      type: 'array',
      of: [{ type: 'navGroup' }]
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'socialLink' }]
    }
  ]
}
```

---

## NavItem Schema (supports multi-level)
```ts
// schemas/objects/navItem.ts
export default {
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    { name: 'label', type: 'string' },
    { name: 'link', type: 'link' },
    {
      name: 'children',
      title: 'Submenu',
      type: 'array',
      of: [{ type: 'navItem' }]
    }
  ]
}
```

---

## NavGroup Schema (footer columns)
```ts
// schemas/objects/navGroup.ts
export default {
  name: 'navGroup',
  title: 'Navigation Group',
  type: 'object',
  fields: [
    { name: 'title', type: 'string' },
    {
      name: 'links',
      type: 'array',
      of: [{ type: 'link' }]
    }
  ]
}
```

---

## GROQ Query
```ts
const navigationQuery = groq`
  *[_type == "navigation"][0] {
    mainNav[] {
      label,
      link,
      children[] {
        label,
        link
      }
    },
    headerCta,
    footerNav[] {
      title,
      links[]
    },
    socialLinks
  }
`
```

---

## Header Component Contract
```tsx
// lib/components/layout/Header.tsx
type HeaderProps = {
  navigation: Navigation
  logo: ImageAsset
}

export function Header({ navigation, logo }: HeaderProps) {
  // ✅ Data from navigation document
  // ✅ CTA from navigation.headerCta
  // ✅ Multi-level nav support via children
  // ❌ No hardcoded links
  // ❌ No per-page overrides
}
```

---

## Footer Component Contract
```tsx
// lib/components/layout/Footer.tsx
type FooterProps = {
  navigation: Navigation
  globalSettings: GlobalSettings
}

export function Footer({ navigation, globalSettings }: FooterProps) {
  // ✅ Nav groups from navigation.footerNav
  // ✅ Social links from navigation.socialLinks
  // ✅ Logo/brand from globalSettings
  // ❌ No hardcoded content
}
```

---

## Layout Integration
```tsx
// app/(sites)/[site]/layout.tsx
export default async function SiteLayout({ children, params }) {
  const [navigation, globalSettings] = await Promise.all([
    getNavigation(params.site),
    getGlobalSettings(params.site)
  ])

  return (
    <>
      <Header navigation={navigation} logo={globalSettings.logo} />
      <main>{children}</main>
      <Footer navigation={navigation} globalSettings={globalSettings} />
    </>
  )
}
```
