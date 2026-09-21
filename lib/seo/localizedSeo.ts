import type { Locale } from '@/lib/i18n/config'

type Seo = {
  metaTitle?: string
  metaDescription?: string
  metaImage?: { asset?: { url?: string } }
  canonicalUrl?: string
  robots?: string
}

export function localizedSeo<T extends { localizedSeo?: { language?: string; seo?: Seo }[]; seo?: Seo }>(settings: T | null | undefined, locale: Locale): Seo | undefined {
  return settings?.localizedSeo?.find((entry) => entry.language === locale)?.seo ?? settings?.seo
}
