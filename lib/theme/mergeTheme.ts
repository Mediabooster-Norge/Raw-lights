import { baseTheme, type Theme } from './baseTheme'

type SanityColor = {
  hex?: string
  alpha?: number
}

type SanityTheme = {
  colors?: {
    primary?: SanityColor
    background?: SanityColor
    textPrimary?: SanityColor
  }
  typography?: {
    headingFont?: string
    bodyFont?: string
    customHeadingFont?: string
    customBodyFont?: string
  }
}

function toColorString(color: SanityColor | undefined, fallback: string): string {
  if (!color?.hex) return fallback

  if (color.alpha !== undefined && color.alpha < 1) {
    const hex = color.hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${color.alpha})`
  }

  return color.hex
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '')
  if (cleaned.length !== 6 || /[^0-9a-f]/i.test(cleaned)) return null
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16)
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

function mixHex(a: string, b: string, amount: number): string {
  const from = hexToRgb(a)
  const to = hexToRgb(b)
  if (!from || !to) return a
  return rgbToHex(
    from.r + (to.r - from.r) * amount,
    from.g + (to.g - from.g) * amount,
    from.b + (to.b - from.b) * amount
  )
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const toLinear = (channel: number) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b)
}

function onColor(hex: string): string {
  return relativeLuminance(hex) > 0.45 ? '#0f172a' : '#ffffff'
}

function toHex(color: SanityColor | undefined, fallback: string): string {
  return color?.hex ?? fallback
}

export function mergeTheme(sanityTheme?: SanityTheme): Theme {
  if (!sanityTheme) return baseTheme

  const primarySolid = toHex(sanityTheme.colors?.primary, baseTheme.palette.primary)
  const backgroundSolid = toHex(sanityTheme.colors?.background, baseTheme.palette.background)
  const textPrimarySolid = toHex(sanityTheme.colors?.textPrimary, baseTheme.palette.textPrimary)

  const primary = toColorString(sanityTheme.colors?.primary, primarySolid)
  const background = toColorString(sanityTheme.colors?.background, backgroundSolid)
  const textPrimary = toColorString(sanityTheme.colors?.textPrimary, textPrimarySolid)

  const secondary = mixHex(primarySolid, textPrimarySolid, 0.28)
  const tertiary = mixHex(primarySolid, backgroundSolid, 0.4)
  const surface = mixHex(backgroundSolid, textPrimarySolid, 0.06)
  const textSecondary = mixHex(textPrimarySolid, backgroundSolid, 0.42)
  const onPrimary = onColor(primarySolid)
  const onSecondary = onColor(secondary)

  return {
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
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
    components: {
      ...baseTheme.components,
      cta: {
        primary: {
          background: primary,
          text: onPrimary,
          border: primary
        },
        secondary: {
          background: secondary,
          text: onSecondary,
          border: secondary
        }
      }
    },
    typography: {
      ...baseTheme.typography,
      fontFamily: {
        heading: sanityTheme.typography?.headingFont
          ?? sanityTheme.typography?.customHeadingFont
          ?? baseTheme.typography.fontFamily.heading,
        body: sanityTheme.typography?.bodyFont
          ?? sanityTheme.typography?.customBodyFont
          ?? baseTheme.typography.fontFamily.body
      }
    }
  }
}
