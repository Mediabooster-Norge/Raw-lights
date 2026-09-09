import { getHomePage, getPage, getPostTypeBySlug, getSinglePost, getTranslations } from '@/lib/sanity/fetcher'
import { defaultLocale, localizedPath, locales, parseLocale, stripLocalePrefix, type Locale } from './config'

export type AlternateMap = Record<Locale, string>

function emptyAlternates(): AlternateMap {
  return {
    nb: localizedPath('nb', '/'),
    en: localizedPath('en', '/'),
  }
}

export async function getAlternateUrls(pathname: string): Promise<AlternateMap> {
  const { locale, path } = stripLocalePrefix(pathname)
  const segments = path.split('/').filter(Boolean)
  const result = emptyAlternates()

  if (segments.length === 0) {
    const home = await getHomePage(locale)
    if (!home?._id) return result
    const translations = await getTranslations(home._id)
    for (const doc of translations) {
      const docLocale = parseLocale(doc.language)
      result[docLocale] = localizedPath(docLocale, '/')
    }
    result[locale] = localizedPath(locale, '/')
    return result
  }

  if (segments.length === 1) {
    const [slug] = segments
    const page = await getPage(slug, locale)
    if (page?._id) {
      const translations = await getTranslations(page._id)
      for (const doc of translations) {
        const docLocale = parseLocale(doc.language)
        result[docLocale] = localizedPath(docLocale, doc.slug ? `/${doc.slug}` : '/')
      }
      result[locale] = localizedPath(locale, `/${slug}`)
      return result
    }

    const postType = await getPostTypeBySlug(slug, locale)
    if (postType?._id) {
      const translations = await getTranslations(postType._id)
      for (const doc of translations) {
        const docLocale = parseLocale(doc.language)
        if (doc.slug) result[docLocale] = localizedPath(docLocale, `/${doc.slug}`)
      }
      result[locale] = localizedPath(locale, `/${slug}`)
    }
    return result
  }

  const [typeSlug, postSlug] = segments
  const post = await getSinglePost(typeSlug, postSlug, locale)
  if (post?._id) {
    const translations = await getTranslations(post._id)
    for (const doc of translations) {
      const docLocale = parseLocale(doc.language)
      if (doc.slug && doc.postTypeSlug) {
        result[docLocale] = localizedPath(docLocale, `/${doc.postTypeSlug}/${doc.slug}`)
      }
    }
    result[locale] = localizedPath(locale, `/${typeSlug}/${postSlug}`)
  }

  return result
}

export function languageMetadata(alternates: AlternateMap) {
  return {
    'nb': alternates.nb,
    'en': alternates.en,
    'x-default': alternates[defaultLocale],
  }
}

export async function metadataAlternates(pathname: string, canonical?: string) {
  const alternates = await getAlternateUrls(pathname)
  return {
    canonical,
    languages: languageMetadata(alternates),
  }
}

export { locales }
