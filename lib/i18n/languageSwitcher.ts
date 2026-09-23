import { localizedPath, stripLocalePrefix, type Locale } from './config'
import { routeSegments } from './routes'

export type LanguageUrls = Record<Locale, string>

function equivalentPath(pathname: string, targetLocale: Locale): string {
  const { locale, path } = stripLocalePrefix(pathname)
  const segments = path.split('/').filter(Boolean)

  if (segments[0] === routeSegments[locale].products) {
    segments[0] = routeSegments[targetLocale].products
  }

  return localizedPath(targetLocale, segments.length ? `/${segments.join('/')}` : '/')
}

export function fallbackLanguageUrls(pathname: string): LanguageUrls {
  return {
    nb: equivalentPath(pathname, 'nb'),
    en: equivalentPath(pathname, 'en'),
  }
}

function comparablePath(value: string): string {
  try {
    const url = new URL(value, 'https://rawlights.invalid')
    return `${url.pathname.replace(/\/+$/, '') || '/'}${url.search}`
  } catch {
    return value.split('#')[0].replace(/\/+$/, '') || '/'
  }
}

export function languageUrlsMatchPath(
  urls: LanguageUrls | null | undefined,
  pathname: string,
  locale: Locale
): urls is LanguageUrls {
  return Boolean(urls && comparablePath(urls[locale]) === comparablePath(pathname))
}
