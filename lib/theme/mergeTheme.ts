import { baseTheme, type Theme } from './baseTheme'

// Sanity color type includes hex, alpha, rgb, hsl
type SanityColor = {
  hex?: string
  alpha?: number
  rgb?: { r: number; g: number; b: number; a: number }
  hsl?: { h: number; s: number; l: number; a: number }
}

type SanityTheme = {
  colors?: Record<string, SanityColor>
  buttonColors?: {
    primary?: { background?: SanityColor; text?: SanityColor }
    secondary?: { background?: SanityColor; text?: SanityColor }
  }
  typography?: {
    headingFont?: string
    bodyFont?: string
    customHeadingFont?: string
    customBodyFont?: string
  }
}

/**
 * Converts Sanity color to CSS color string with alpha support
 */
function toColorString(color: SanityColor | undefined, fallback: string): string {
  if (!color?.hex) return fallback
  
  // If alpha is defined and not 1, use rgba
  if (color.alpha !== undefined && color.alpha < 1) {
    // Convert hex to rgb
    const hex = color.hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${color.alpha})`
  }
  
  return color.hex
}

/**
 * Returns just the hex color (solid, no alpha) for borders
 */
function toSolidColor(color: SanityColor | undefined, fallback: string): string {
  return color?.hex ?? fallback
}

export function mergeTheme(sanityTheme?: SanityTheme): Theme {
  if (!sanityTheme) return baseTheme

  return {
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      ...(sanityTheme.colors && {
        primary: toColorString(sanityTheme.colors.primary, baseTheme.palette.primary),
        secondary: toColorString(sanityTheme.colors.secondary, baseTheme.palette.secondary),
        tertiary: toColorString(sanityTheme.colors.tertiary, baseTheme.palette.tertiary),
        background: toColorString(sanityTheme.colors.background, baseTheme.palette.background),
        surface: toColorString(sanityTheme.colors.surface, baseTheme.palette.surface),
        textPrimary: toColorString(sanityTheme.colors.textPrimary, baseTheme.palette.textPrimary),
        textSecondary: toColorString(sanityTheme.colors.textSecondary, baseTheme.palette.textSecondary)
      })
    },
    components: {
      ...baseTheme.components,
      cta: {
        primary: {
          background: toColorString(sanityTheme.buttonColors?.primary?.background, baseTheme.components.cta.primary.background),
          text: toColorString(sanityTheme.buttonColors?.primary?.text, baseTheme.components.cta.primary.text),
          border: toSolidColor(sanityTheme.buttonColors?.primary?.background, baseTheme.components.cta.primary.background)
        },
        secondary: {
          background: toColorString(sanityTheme.buttonColors?.secondary?.background, baseTheme.components.cta.secondary.background),
          text: toColorString(sanityTheme.buttonColors?.secondary?.text, baseTheme.components.cta.secondary.text),
          border: toSolidColor(sanityTheme.buttonColors?.secondary?.background, baseTheme.components.cta.secondary.background)
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
