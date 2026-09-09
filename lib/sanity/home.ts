import { defaultLocale, parseLocale, type Locale } from '@/lib/i18n/config'
import { getClient } from './client'
import { globalSettingsQuery } from './queries/globalSettings'
import { translationsQuery } from './queries/i18n'

const FALLBACK_HOME_SLUGS = ['forside', 'home'] as const

function translationDocs(result: {
  translations?: { language?: string; doc?: { slug?: string; language?: string } }[]
}) {
  return (result?.translations ?? [])
    .map((item) => {
      const language = item.language || item.doc?.language
      if (!item.doc) return null
      return { ...item.doc, language }
    })
    .filter((item): item is { slug?: string; language?: string } => Boolean(item))
}

export async function getHomePageSlug(locale: Locale): Promise<string> {
  const client = getClient()
  if (!client) return 'forside'

  const settings = await client.fetch(
    globalSettingsQuery,
    {},
    { next: { tags: ['global-settings'] } }
  )

  if (!settings?.homePageId) return 'forside'
  if (locale === defaultLocale) return settings.homePageSlug ?? 'forside'

  const result = await client.fetch(
    translationsQuery,
    { id: settings.homePageId },
    { next: { tags: ['translations', `translation-${settings.homePageId}`] } }
  )
  const match = translationDocs(result).find((item) => parseLocale(item.language) === locale)
  return match?.slug ?? settings.homePageSlug ?? 'forside'
}

export async function getHomePageSlugs(): Promise<Set<string>> {
  const client = getClient()
  const slugs = new Set<string>(FALLBACK_HOME_SLUGS)
  if (!client) return slugs

  const settings = await client.fetch(
    globalSettingsQuery,
    {},
    { next: { tags: ['global-settings'] } }
  )
  if (settings?.homePageSlug) slugs.add(settings.homePageSlug)
  if (!settings?.homePageId) return slugs

  const result = await client.fetch(
    translationsQuery,
    { id: settings.homePageId },
    { next: { tags: ['translations', `translation-${settings.homePageId}`] } }
  )
  for (const doc of translationDocs(result)) {
    if (doc.slug) slugs.add(doc.slug)
  }
  return slugs
}
