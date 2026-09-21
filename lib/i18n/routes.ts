import { localizedPath, type Locale } from './config'

/** Public route names. The matching App Router routes remain language-neutral. */
export const routeSegments = {
  nb: { products: 'produkter' },
  en: { products: 'products' },
} as const

export function productsPath(locale: Locale): string {
  return localizedPath(locale, `/${routeSegments[locale].products}`)
}

export function productPath(locale: Locale, slug: string): string {
  return localizedPath(locale, `/${routeSegments[locale].products}/${slug}`)
}

export function internalPathForLocale(locale: Locale, path: string): string {
  const normalized = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  // The catalog landing page is a CMS page with the Norwegian slug
  // `/produkter`; only individual product routes need the internal
  // `/products/[slug]` App Router segment.
  if (locale === 'nb' && normalized.startsWith('/produkter/')) {
    return normalized.replace(/^\/produkter(?=\/|$)/, '/products')
  }
  return normalized
}
