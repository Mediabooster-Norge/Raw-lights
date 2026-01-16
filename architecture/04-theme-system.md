# Theme System

## Required Files
```
/lib/theme/baseTheme.ts
/lib/theme/mergeTheme.ts
/lib/theme/useTheme.ts
/app/(sites)/[site]/theme.config.ts
```

---

## Theme Structure
```ts
theme = {
  palette: {
    primary,
    secondary,
    tertiary,
    background,
    surface,
    textPrimary,
    textSecondary,
    onPrimary,
    onSecondary
  },
  typography: {
    fontFamily: {
      heading,
      body
    },
    fontSize: {
      xs, sm, base, lg, xl, '2xl', '3xl', '4xl', '5xl'
    },
    fontWeight: {
      normal, medium, semibold, bold
    },
    lineHeight: {
      tight, normal, relaxed
    }
  },
  spacing: {
    section: { sm, md, lg, xl },
    container: { padding, maxWidth }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  components: {
    header: { background, text },
    footer: { background, text },
    cta: {
      primary: { background, text },
      secondary: { background, text }
    },
    section: {
      defaultBackground,
      altBackground
    }
  }
}
```

---

## Base Theme Defaults

### File
```
/lib/theme/baseTheme.ts
```

### Implementation
```ts
export const baseTheme = {
  palette: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    tertiary: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff'
  },
  typography: {
    fontFamily: {
      heading: 'Inter',
      body: 'Inter'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  spacing: {
    section: {
      sm: '2rem',
      md: '4rem',
      lg: '6rem',
      xl: '8rem'
    },
    container: {
      padding: '1rem',
      maxWidth: '1280px'
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  components: {
    header: {
      background: '#ffffff',
      text: '#0f172a'
    },
    footer: {
      background: '#0f172a',
      text: '#f8fafc'
    },
    cta: {
      primary: {
        background: '#2563eb',
        text: '#ffffff'
      },
      secondary: {
        background: '#7c3aed',
        text: '#ffffff'
      }
    },
    section: {
      defaultBackground: '#ffffff',
      altBackground: '#f8fafc'
    }
  }
} as const

export type Theme = typeof baseTheme
```

---

## Typography Scale (Tailwind)
```ts
// tailwind.config.ts
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1.15' }],
  '6xl': ['3.75rem', { lineHeight: '1.1' }]
}
```

---

## Spacing Scale
```css
/* Section padding pattern */
.section-sm { padding-block: 2rem; }
.section-md { padding-block: 4rem; }
.section-lg { padding-block: 6rem; }
.section-xl { padding-block: 8rem; }

/* Container */
.container {
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 1rem;
}
@media (min-width: 768px) {
  .container { padding-inline: 2rem; }
}
```

---

## CSS Variable Injection Pattern
```tsx
<body style={{
  '--color-primary': theme.palette.primary,
  '--color-secondary': theme.palette.secondary,
  '--color-background': theme.palette.background
}}>
  {children}
</body>
```

---

## Font Loading

### Required Files
```
/app/fonts.ts
/app/(sites)/[site]/layout.tsx
```

### Font Setup with next/font
```ts
// /app/fonts.ts
import { Inter, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'

export const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
})

export const fontHeading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap'
})

// Local font example
export const fontCustom = localFont({
  src: [
    { path: '../public/fonts/CustomFont-Regular.woff2', weight: '400' },
    { path: '../public/fonts/CustomFont-Bold.woff2', weight: '700' }
  ],
  variable: '--font-custom',
  display: 'swap'
})
```

### Layout Integration
```tsx
// /app/(sites)/[site]/layout.tsx
import { fontBody, fontHeading } from '@/app/fonts'

export default function SiteLayout({ children }) {
  return (
    <html className={`${fontBody.variable} ${fontHeading.variable}`}>
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}
```

### Tailwind Config
```ts
// tailwind.config.ts
fontFamily: {
  body: ['var(--font-body)', 'system-ui', 'sans-serif'],
  heading: ['var(--font-heading)', 'serif']
}
```

---

## Theme Merge Strategy

### File
```
/lib/theme/mergeTheme.ts
```

### Pattern
```ts
import { baseTheme } from './baseTheme'

type SanityTheme = {
  colors?: Record<string, { hex: string }>
  buttonColors?: {
    primary?: { background?: { hex: string }; text?: { hex: string } }
    secondary?: { background?: { hex: string }; text?: { hex: string } }
  }
  typography?: {
    headingFont?: string
    bodyFont?: string
    customHeadingFont?: string
    customBodyFont?: string
  }
}

export function mergeTheme(sanityTheme?: SanityTheme) {
  if (!sanityTheme) return baseTheme

  return {
    palette: {
      ...baseTheme.palette,
      ...(sanityTheme.colors && {
        primary: sanityTheme.colors.primary?.hex ?? baseTheme.palette.primary,
        secondary: sanityTheme.colors.secondary?.hex ?? baseTheme.palette.secondary,
        tertiary: sanityTheme.colors.tertiary?.hex ?? baseTheme.palette.tertiary,
        background: sanityTheme.colors.background?.hex ?? baseTheme.palette.background,
        surface: sanityTheme.colors.surface?.hex ?? baseTheme.palette.surface,
        textPrimary: sanityTheme.colors.textPrimary?.hex ?? baseTheme.palette.textPrimary,
        textSecondary: sanityTheme.colors.textSecondary?.hex ?? baseTheme.palette.textSecondary
      })
    },
    components: {
      ...baseTheme.components,
      cta: {
        primary: {
          background: sanityTheme.buttonColors?.primary?.background?.hex ?? baseTheme.components.cta.primary.background,
          text: sanityTheme.buttonColors?.primary?.text?.hex ?? baseTheme.components.cta.primary.text
        },
        secondary: {
          background: sanityTheme.buttonColors?.secondary?.background?.hex ?? baseTheme.components.cta.secondary.background,
          text: sanityTheme.buttonColors?.secondary?.text?.hex ?? baseTheme.components.cta.secondary.text
        }
      }
    },
    typography: {
      ...baseTheme.typography,
      fontFamily: {
        heading: sanityTheme.typography?.customHeadingFont 
          ?? sanityTheme.typography?.headingFont 
          ?? baseTheme.typography.fontFamily.heading,
        body: sanityTheme.typography?.customBodyFont 
          ?? sanityTheme.typography?.bodyFont 
          ?? baseTheme.typography.fontFamily.body
      }
    }
  }
}
```

---

## Text Color Resolution Rules

If textColor = auto:
- Use `theme.palette.onPrimary` when background is primary
- Use `theme.palette.onSecondary` when background is secondary
- Use `theme.palette.textPrimary` for background/surface

### Implementation
```ts
// /lib/theme/resolveTextColor.ts
type Background = 'primary' | 'secondary' | 'background' | 'surface'
type TextColor = 'auto' | 'onPrimary' | 'onSecondary' | 'textPrimary'

export function resolveTextColor(
  background: Background,
  textColor: TextColor,
  theme: Theme
): string {
  if (textColor !== 'auto') {
    return theme.palette[textColor]
  }

  const colorMap: Record<Background, string> = {
    primary: theme.palette.onPrimary,
    secondary: theme.palette.onSecondary,
    background: theme.palette.textPrimary,
    surface: theme.palette.textPrimary
  }

  return colorMap[background]
}
```

---

## Layout Integration with Theme
```tsx
// /app/(sites)/[site]/layout.tsx
import { mergeTheme } from '@/lib/theme/mergeTheme'
import { loadFonts } from '@/lib/theme/loadFonts'

export default async function SiteLayout({ children, params }) {
  const settings = await getGlobalSettings(params.site)
  const theme = mergeTheme(settings?.siteTheme)
  
  const { headingFont, bodyFont } = settings?.siteTheme?.typography ?? {}
  const fonts = loadFonts(headingFont, bodyFont)

  return (
    <html className={`${fonts.heading?.variable ?? ''} ${fonts.body?.variable ?? ''}`}>
      <head>
        {settings?.siteTheme?.favicon && (
          <link rel="icon" href={urlFor(settings.siteTheme.favicon).url()} />
        )}
      </head>
      <body style={{
        '--color-primary': theme.palette.primary,
        '--color-secondary': theme.palette.secondary,
        '--color-tertiary': theme.palette.tertiary,
        '--color-background': theme.palette.background,
        '--color-surface': theme.palette.surface,
        '--color-text-primary': theme.palette.textPrimary,
        '--color-text-secondary': theme.palette.textSecondary,
        '--color-cta-primary-bg': theme.components.cta.primary.background,
        '--color-cta-primary-text': theme.components.cta.primary.text,
        '--color-cta-secondary-bg': theme.components.cta.secondary.background,
        '--color-cta-secondary-text': theme.components.cta.secondary.text,
        '--font-heading': theme.typography.fontFamily.heading,
        '--font-body': theme.typography.fontFamily.body
      } as React.CSSProperties}>
        {children}
      </body>
    </html>
  )
}
```
