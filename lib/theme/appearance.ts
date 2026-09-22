export const THEME_STORAGE_KEY = 'raw-theme'

export type Appearance = 'dark' | 'light'

export function isAppearance(value: unknown): value is Appearance {
  return value === 'dark' || value === 'light'
}

export function nextAppearance(current: Appearance): Appearance {
  return current === 'dark' ? 'light' : 'dark'
}
