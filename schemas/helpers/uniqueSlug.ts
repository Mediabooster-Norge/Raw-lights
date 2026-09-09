import type { SlugValue, ValidationContext } from 'sanity'

const API_VERSION = '2024-01-01'

function publishedId(id?: string) {
  return (id ?? '').replace(/^drafts\./, '')
}

function languageOf(document: { language?: unknown } | undefined) {
  return typeof document?.language === 'string' && document.language
    ? document.language
    : 'nb'
}

export async function uniqueLocalizedSlug(
  slug: SlugValue | undefined,
  context: ValidationContext
) {
  const current = slug?.current
  if (!current) return true

  const document = context.document as
    | { _id?: string; _type?: string; language?: string; postType?: { _ref?: string } }
    | undefined
  const type = document?._type
  if (!type) return true

  const client = context.getClient({ apiVersion: API_VERSION })
  const id = publishedId(document?._id)
  const language = languageOf(document)
  const params: Record<string, string> = {
    slug: current,
    language,
    draftId: `drafts.${id}`,
    publishedId: id,
  }

  let query: string
  if (type === 'post') {
    const postTypeId = document?.postType?._ref
    if (!postTypeId) return true
    params.postTypeId = postTypeId
    query = `count(*[_type == "post" && slug.current == $slug && postType._ref == $postTypeId && (!defined(language) || language == $language) && !(_id in [$draftId, $publishedId])])`
  } else if (type === 'page' || type === 'postType') {
    query = `count(*[(_type == "page" || _type == "postType") && slug.current == $slug && (!defined(language) || language == $language) && !(_id in [$draftId, $publishedId])])`
  } else {
    return true
  }

  const count = await client.fetch<number>(query, params)
  return count === 0 || 'URL er allerede i bruk på dette språket'
}
