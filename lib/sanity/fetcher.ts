import { draftMode } from 'next/headers'
import { getClient } from './client'
import { getPreviewClient } from './preview'
import { pageQuery, pagePreviewQuery, pageSlugsQuery, pageByIdQuery } from './queries/page'
import { navigationQuery } from './queries/navigation'
import { globalSettingsQuery } from './queries/globalSettings'
import {
  allPostTypesQuery,
  postTypeBySlugQuery,
  postsByTypeQuery,
  singlePostQuery,
  singlePostPreviewQuery,
  postSlugsByTypeQuery,
  allPostTypeSlugsQuery
} from './queries/posts'
import { translationsQuery, formByIdQuery, sitemapQuery } from './queries/i18n'
import { defaultLocale, parseLocale, type Locale } from '@/lib/i18n/config'

function isAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  return message.includes('Unauthorized') || message.includes('Session')
}

async function publishedOrPreview() {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient() : getClient()
  return { isPreview, client }
}

export async function getPage(slug: string, locale: Locale) {
  const { isPreview, client } = await publishedOrPreview()
  if (!client) return null

  const query = isPreview ? pagePreviewQuery : pageQuery

  try {
    return await client.fetch(
      query,
      { slug, locale },
      isPreview ? {} : { next: { tags: ['pages', `page-${slug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallbackClient = getClient()
      if (!fallbackClient) return null
      return fallbackClient.fetch(pageQuery, { slug, locale }, { next: { tags: ['pages', `page-${slug}`] } })
    }
    throw error
  }
}

export async function getPageById(id: string, locale: Locale) {
  const { isPreview, client } = await publishedOrPreview()
  if (!client) return null

  try {
    return await client.fetch(
      pageByIdQuery,
      { id, locale },
      isPreview ? {} : { next: { tags: ['pages', `page-${id}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) return null
    throw error
  }
}

export async function getPageSlugs(locale: Locale) {
  const client = getClient()
  if (!client) return []
  return client.fetch<string[]>(pageSlugsQuery, { locale })
}

export async function getNavigation(locale: Locale) {
  const client = getClient()
  if (!client) return null
  try {
    const nav = await client.fetch(navigationQuery, { locale }, {
      next: { tags: ['navigation'] }
    })
    if (nav || locale === defaultLocale) return nav
    return client.fetch(navigationQuery, { locale: defaultLocale }, {
      next: { tags: ['navigation'] }
    })
  } catch (error: unknown) {
    if (isAuthError(error)) return null
    throw error
  }
}

export async function getGlobalSettings() {
  const client = getClient()
  if (!client) return null

  try {
    return await client.fetch(globalSettingsQuery, {}, {
      next: { tags: ['global-settings'] }
    })
  } catch (error: unknown) {
    if (isAuthError(error)) return null
    throw error
  }
}

async function getTranslatedId(id: string, locale: Locale): Promise<string | null> {
  const translations = await getTranslations(id)
  const match = translations.find((item) => parseLocale(item.language) === locale)
  return match?._id ?? null
}

export async function getHomePage(locale: Locale) {
  const settings = await getGlobalSettings()
  const homeId = settings?.homePageId as string | undefined

  if (homeId) {
    const translatedId = locale === defaultLocale ? homeId : (await getTranslatedId(homeId, locale)) ?? homeId
    const page = await getPageById(translatedId, locale)
    if (page) return page
  }

  return getPage('forside', locale)
}

export async function getNotFoundPage(locale: Locale) {
  const settings = await getGlobalSettings()
  const notFoundId = settings?.notFoundPageId as string | undefined
  if (!notFoundId) return null
  const translatedId = locale === defaultLocale ? notFoundId : (await getTranslatedId(notFoundId, locale)) ?? notFoundId
  return getPageById(translatedId, locale)
}

export function isHomePageSlug(slug: string, homeSlug?: string | null) {
  return slug === 'forside' || slug === 'home' || (homeSlug ? slug === homeSlug : false)
}

export { getHomePageSlug, getHomePageSlugs, getPrivacyPageSlug } from './home'

export async function getAllPostTypes(locale: Locale) {
  const { isPreview, client } = await publishedOrPreview()
  if (!client) return []

  try {
    return await client.fetch(
      allPostTypesQuery,
      { locale },
      isPreview ? {} : { next: { tags: ['post-types'] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallbackClient = getClient()
      if (!fallbackClient) return []
      return fallbackClient.fetch(allPostTypesQuery, { locale }, { next: { tags: ['post-types'] } })
    }
    throw error
  }
}

export async function getPostTypeBySlug(slug: string, locale: Locale) {
  const { isPreview, client } = await publishedOrPreview()
  if (!client) return null

  try {
    return await client.fetch(
      postTypeBySlugQuery,
      { slug, locale },
      isPreview ? {} : { next: { tags: ['post-types', `post-type-${slug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallbackClient = getClient()
      if (!fallbackClient) return null
      return fallbackClient.fetch(
        postTypeBySlugQuery,
        { slug, locale },
        { next: { tags: ['post-types', `post-type-${slug}`] } }
      )
    }
    throw error
  }
}

export async function getPostTypeSlugs(locale: Locale): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  return client.fetch(allPostTypeSlugsQuery, { locale }, {
    next: { tags: ['post-types'] }
  })
}

export async function getPostsByType(postTypeSlug: string, locale: Locale) {
  const { isPreview, client } = await publishedOrPreview()
  if (!client) return []

  try {
    return await client.fetch(
      postsByTypeQuery,
      { postTypeSlug, locale },
      isPreview ? {} : { next: { tags: ['posts', `posts-${postTypeSlug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallbackClient = getClient()
      if (!fallbackClient) return []
      return fallbackClient.fetch(
        postsByTypeQuery,
        { postTypeSlug, locale },
        { next: { tags: ['posts', `posts-${postTypeSlug}`] } }
      )
    }
    throw error
  }
}

export async function getSinglePost(postTypeSlug: string, postSlug: string, locale: Locale) {
  const { isPreview, client } = await publishedOrPreview()
  if (!client) return null

  const query = isPreview ? singlePostPreviewQuery : singlePostQuery

  try {
    return await client.fetch(
      query,
      { postTypeSlug, postSlug, locale },
      isPreview ? {} : { next: { tags: ['posts', `post-${postSlug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallback = getClient()
      if (!fallback) return null
      return fallback.fetch(
        singlePostQuery,
        { postTypeSlug, postSlug, locale },
        { next: { tags: ['posts', `post-${postSlug}`] } }
      )
    }
    throw error
  }
}

export async function getPostSlugsByType(postTypeSlug: string, locale: Locale): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  const posts = await client.fetch(postSlugsByTypeQuery, { postTypeSlug, locale }, {
    next: { tags: ['posts', `posts-${postTypeSlug}`] }
  })
  return posts.map((p: { slug: string }) => p.slug)
}

export type TranslationDoc = {
  _id: string
  _type?: string
  language?: string
  slug?: string
  title?: string
  postTypeSlug?: string
}

export async function getTranslations(id: string): Promise<TranslationDoc[]> {
  const client = getClient()
  if (!client) return []
  const result = await client.fetch(translationsQuery, { id }, {
    next: { tags: ['translations', `translation-${id}`] }
  })
  return (result?.translations ?? [])
    .map((item: { language?: string; doc?: TranslationDoc }) => {
      const language = item.language || item.doc?.language
      if (!item.doc) return null
      return { ...item.doc, language }
    })
    .filter((item: TranslationDoc | null): item is TranslationDoc => Boolean(item))
}

export { getRedirects } from './redirects'

export async function getForm(id: string) {
  const client = getClient()
  if (!client) return null
  return client.fetch(formByIdQuery, { id }, { next: { tags: ['forms', `form-${id}`] } })
}

export async function getSitemapEntries() {
  const client = getClient()
  if (!client) return { pages: [], postTypes: [], posts: [] }
  return client.fetch(sitemapQuery)
}
