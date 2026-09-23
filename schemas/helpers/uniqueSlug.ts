import type { SlugIsUniqueValidator, SlugValidationContext, SlugValue, ValidationContext } from 'sanity'

const API_VERSION = '2024-01-01'

function publishedId(id?: string) {
  return (id ?? '').replace(/^drafts\./, '')
}

function languageOf(document: { language?: unknown } | undefined) {
  return typeof document?.language === 'string' && document.language
    ? document.language
    : 'nb'
}

type SlugDocument = {
  _id?: string
  _type?: string
  language?: string
  postType?: { _ref?: string }
}

type LocalizedSlugContext = Pick<ValidationContext, 'document' | 'getClient'>

async function localizedSlugCollisionCount(
  slug: string,
  context: LocalizedSlugContext
): Promise<number | null> {
  const document = context.document as SlugDocument | undefined
  const type = document?._type
  if (!type) return null

  const id = publishedId(document._id)
  const language = languageOf(document)
  const languageConstraint =
    language === 'nb'
      ? '(!defined(language) || language == $language)'
      : 'language == $language'
  const params: Record<string, string> = {
    slug,
    language,
    draftId: `drafts.${id}`,
    publishedId: id,
  }

  let query: string
  if (type === 'post') {
    const postTypeId = document.postType?._ref
    if (!postTypeId) return null
    params.postTypeId = postTypeId
    query = `count(*[_type == "post" && slug.current == $slug && postType._ref == $postTypeId && ${languageConstraint} && !sanity::versionOf($publishedId) && !(_id in [$draftId, $publishedId])])`
  } else if (type === 'page' || type === 'postType') {
    query = `count(*[(_type == "page" || _type == "postType") && slug.current == $slug && ${languageConstraint} && !sanity::versionOf($publishedId) && !(_id in [$draftId, $publishedId])])`
  } else if (type === 'product') {
    query = `count(*[_type == "product" && slug.current == $slug && ${languageConstraint} && !sanity::versionOf($publishedId) && !(_id in [$draftId, $publishedId])])`
  } else {
    return null
  }

  const client = context.getClient({ apiVersion: API_VERSION }).withConfig({ perspective: 'raw' })
  return client.fetch<number>(query, params)
}

export const isUniqueLocalizedSlug: SlugIsUniqueValidator = async (
  slug: string,
  context: SlugValidationContext
) => {
  const count = await localizedSlugCollisionCount(slug, context)
  return count === null ? context.defaultIsUnique(slug, context) : count === 0
}

export async function uniqueLocalizedSlug(
  slug: SlugValue | undefined,
  context: ValidationContext
) {
  const current = slug?.current
  if (!current) return true

  const count = await localizedSlugCollisionCount(current, context)
  if (count === null) return true
  return count === 0 || 'URL er allerede i bruk på dette språket'
}
