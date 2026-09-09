export const locales = ['nb', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'nb'

export const localeLabels: Record<Locale, string> = {
  nb: 'Norsk',
  en: 'English',
}

export const htmlLangs: Record<Locale, string> = {
  nb: 'nb',
  en: 'en',
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'nb' || value === 'en'
}

export function parseLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale
}

export function htmlLang(locale?: string | null): string {
  return htmlLangs[parseLocale(locale)]
}

function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  const withSlash = path.startsWith('/') ? path : `/${path}`
  return withSlash.replace(/\/+$/, '') || '/'
}

export function localizedPath(locale: Locale, path = '/'): string {
  const normalized = normalizePath(path)
  if (locale === defaultLocale) return normalized
  return normalized === '/' ? '/en' : `/en${normalized}`
}

export function stripLocalePrefix(pathname: string): { locale: Locale; path: string } {
  const clean = pathname.split('?')[0] || '/'
  if (clean === '/en' || clean.startsWith('/en/')) {
    const rest = clean.slice(3) || '/'
    return { locale: 'en', path: normalizePath(rest) }
  }
  return { locale: defaultLocale, path: normalizePath(clean) }
}

export function publicUrl(baseUrl: string, locale: Locale, path = '/'): string {
  return `${baseUrl.replace(/\/+$/, '')}${localizedPath(locale, path)}`
}
