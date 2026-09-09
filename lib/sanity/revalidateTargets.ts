import { localizedPath, locales } from '../i18n/config'

export type RevalidateBody = {
  _type?: string
  slug?: string | { current?: string } | null
  language?: string
  postTypeSlug?: string | null
}

export function slugValue(slug: RevalidateBody['slug']): string | undefined {
  if (!slug) return undefined
  return typeof slug === 'string' ? slug : slug.current
}

export type RevalidatePath = {
  path: string
  type?: 'layout' | 'page'
}

export type RevalidateSpec = {
  tags: string[]
  paths: RevalidatePath[]
}

export function revalidateSpec(body: RevalidateBody): RevalidateSpec {
  const slug = slugValue(body.slug)
  const tags = new Set<string>()
  const paths: RevalidatePath[] = [
    { path: '/', type: 'layout' },
    { path: '/en', type: 'layout' },
    { path: '/sitemap.xml' },
  ]

  const localePaths = (path: string) => {
    for (const locale of locales) {
      paths.push({ path: localizedPath(locale, path) })
    }
  }

  switch (body._type) {
    case 'page':
      tags.add('pages')
      if (slug) {
        tags.add(`page-${slug}`)
        localePaths(`/${slug}`)
      }
      break
    case 'post':
      tags.add('posts')
      if (slug) tags.add(`post-${slug}`)
      if (body.postTypeSlug) {
        localePaths(`/${body.postTypeSlug}`)
        if (slug) localePaths(`/${body.postTypeSlug}/${slug}`)
      }
      break
    case 'postType':
      tags.add('post-types')
      if (slug) localePaths(`/${slug}`)
      break
    case 'navigation':
      tags.add('navigation')
      break
    case 'globalSettings':
      tags.add('global-settings')
      break
    case 'redirect':
      tags.add('redirects')
      break
    case 'form':
      tags.add('forms')
      break
    default:
      tags.add('pages')
      tags.add('posts')
      tags.add('post-types')
      tags.add('navigation')
      tags.add('global-settings')
      tags.add('redirects')
      tags.add('forms')
  }

  return { tags: [...tags], paths }
}
