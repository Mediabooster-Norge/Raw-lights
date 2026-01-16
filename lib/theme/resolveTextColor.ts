import type { Theme } from './baseTheme'

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
