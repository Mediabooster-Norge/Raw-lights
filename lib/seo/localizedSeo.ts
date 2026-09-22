import type { Locale } from '@/lib/i18n/config'

type Seo = {
  metaTitle?: string
  metaDescription?: string
  metaImage?: { asset?: { url?: string } }
  canonicalUrl?: string
  robots?: string
}

export function localizedSeo<T extends { seoNb?: Seo; seoEn?: Seo; localizedSeo?: { language?: string; seo?: Seo }[]; seo?: Seo }>(settings: T | null | undefined, locale: Locale): Seo | undefined {
  const explicitSeo = locale === 'nb' ? settings?.seoNb : settings?.seoEn
  return explicitSeo ?? settings?.localizedSeo?.find((entry) => entry.language === locale)?.seo ?? settings?.seo
}
