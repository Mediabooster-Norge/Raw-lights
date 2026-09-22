import { baseTheme, type Theme } from './baseTheme'

type SanityTheme = {
  typography?: {
    headingFont?: string
    bodyFont?: string
    customHeadingFont?: string
    customBodyFont?: string
  }
}

/**
 * RAW's palette is a fixed part of the design system. Sanity can still select
 * the available fonts, but it can no longer override brand colours globally.
 */
export function mergeTheme(sanityTheme?: SanityTheme): Theme {
  return {
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      fontFamily: {
        heading: sanityTheme?.typography?.headingFont
          ?? sanityTheme?.typography?.customHeadingFont
          ?? baseTheme.typography.fontFamily.heading,
        body: sanityTheme?.typography?.bodyFont
          ?? sanityTheme?.typography?.customBodyFont
          ?? baseTheme.typography.fontFamily.body,
      },
    },
  }
}
