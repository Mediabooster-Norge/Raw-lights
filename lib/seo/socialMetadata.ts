import type { Metadata } from 'next'
import type { Locale } from '../i18n/config'

export function openGraphLocale(locale: Locale) {
  return locale === 'en' ? 'en_US' : 'nb_NO'
}

export function socialMetadata(input: {
  title: string
  description?: string
  imageUrl?: string
  locale: Locale
  url?: string
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const images = input.imageUrl ? [{ url: input.imageUrl }] : []
  return {
    openGraph: {
      title: input.title,
      description: input.description,
      images,
      locale: openGraphLocale(input.locale),
      alternateLocale: input.locale === 'en' ? ['nb_NO'] : ['en_US'],
      url: input.url,
      type: 'website',
    },
    twitter: {
      card: images.length ? 'summary_large_image' : 'summary',
      title: input.title,
      description: input.description,
      images: input.imageUrl ? [input.imageUrl] : undefined,
    },
  }
}
