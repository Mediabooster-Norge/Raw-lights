# Component Library

## File Structure
```
/lib/components/ui/
/lib/components/blocks/
/lib/components/layout/
```

## Requirements
- Alle komponenter skal være theme-aware
- Ingen hardkodet styling
- Styling hentes fra CSS-variabler
- Blocks mottar `data` fra Sanity og bruker block registry

---

## Loading Patterns (Components + Blocks)

### Requirements
- Every block component must include a `Loading` version
- Skeleton loading states must match the structure of each block
- A global loading boundary must wrap all page-level fetches

### File Structure
```
/lib/components/blocks/loading/
  hero.loading.tsx
  cta.loading.tsx
  section.loading.tsx
  gallery.loading.tsx
```

### Pattern for loading components
```tsx
export function HeroBlockLoading() {
  return (
    <section className="loading skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
    </section>
  )
}
```

### Page-level loading boundary
```
/app/(sites)/[site]/loading.tsx
```
Pattern:
```tsx
export default function Loading() {
  return <div className="page-loading" />
}
```

### Required CSS token classes
```css
.skeleton { opacity: 0.4; background: var(--color-surface); }
.skeleton-title { height: 32px; width: 60%; }
.skeleton-text { height: 20px; width: 80%; }
```

---

## Logo Component
```tsx
// /lib/components/ui/Logo.tsx
import { SanityImage } from './SanityImage'

type LogoProps = {
  logo: any
  logoDark?: any
  variant?: 'light' | 'dark' | 'auto'
  className?: string
}

export function Logo({ logo, logoDark, variant = 'auto', className }: LogoProps) {
  if (variant === 'dark' && logoDark) {
    return <SanityImage image={logoDark} alt="Logo" className={className} />
  }
  
  if (variant === 'auto' && logoDark) {
    return (
      <>
        <SanityImage image={logo} alt="Logo" className={`${className} dark:hidden`} />
        <SanityImage image={logoDark} alt="Logo" className={`${className} hidden dark:block`} />
      </>
    )
  }
  
  return <SanityImage image={logo} alt={logo?.alt ?? 'Logo'} className={className} />
}
```

---

## Accessibility Rules
- focus-visible polyfill
- skip link component
- aria roles in all blocks

### SkipToContent Component
```
/lib/components/ui/SkipToContent.tsx
```
