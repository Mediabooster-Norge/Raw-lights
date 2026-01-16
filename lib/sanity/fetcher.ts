import { draftMode } from 'next/headers'
import { getClient } from './client'
import { getPreviewClient } from './preview'
import { 
  pageQuery, 
  pagePreviewQuery, 
  pageFields,
  PUBLISH_FILTER,
  pageSlugsQuery 
} from './queries/page'
import { navigationQuery } from './queries/navigation'
import { globalSettingsQuery } from './queries/globalSettings'
import {
  allPostTypesQuery,
  postTypeBySlugQuery,
  postsByTypeQuery,
  singlePostQuery,
  postSlugsByTypeQuery,
  allPostTypeSlugsQuery
} from './queries/posts'

export async function getPage(slug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  
  if (!client) {
    console.log('[getPage] No client available')
    return null
  }
  
  // DEBUG: Hent alle sider for å se hva som finnes
  const allPages = await client.fetch(`*[_type == "page"]{ title, "slug": slug.current, visibility }`)
  console.log('[getPage] All pages in database:', JSON.stringify(allPages, null, 2))
  
  const query = isPreview ? pagePreviewQuery : pageQuery
  
  console.log('[getPage] Looking for slug:', slug)
  
  const result = await client.fetch(
    query,
    { slug },
    isPreview ? {} : { next: { tags: ['pages', `page-${slug}`] } }
  )
  
  console.log('[getPage] Result:', result ? 'Found' : 'Not found')
  
  return result
}

export async function getPageSlugs(site: string) {
  const client = getClient(site)
  if (!client) return []
  return client.fetch<string[]>(pageSlugsQuery)
}

export async function getNavigation(site: string) {
  const client = getClient(site)
  if (!client) return null
  return client.fetch(navigationQuery, {}, {
    next: { tags: ['navigation'] }
  })
}

export async function getGlobalSettings(site: string) {
  const client = getClient(site)
  if (!client) return null
  
  const result = await client.fetch(globalSettingsQuery, {}, {
    next: { tags: ['global-settings'] }
  })
  
  console.log('[getGlobalSettings] Result:', JSON.stringify(result, null, 2))
  
  return result
}

// Post Types

export async function getAllPostTypes(site: string) {
  const client = getClient(site)
  if (!client) return []
  return client.fetch(allPostTypesQuery, {}, {
    next: { tags: ['post-types'] }
  })
}

export async function getPostTypeBySlug(slug: string, site: string) {
  const client = getClient(site)
  if (!client) return null
  return client.fetch(postTypeBySlugQuery, { slug }, {
    next: { tags: ['post-types', `post-type-${slug}`] }
  })
}

export async function getPostTypeSlugs(site: string): Promise<string[]> {
  const client = getClient(site)
  if (!client) return []
  return client.fetch(allPostTypeSlugsQuery, {}, {
    next: { tags: ['post-types'] }
  })
}

// Posts

export async function getPostsByType(postTypeSlug: string, site: string) {
  const client = getClient(site)
  if (!client) return []
  return client.fetch(postsByTypeQuery, { postTypeSlug }, {
    next: { tags: ['posts', `posts-${postTypeSlug}`] }
  })
}

export async function getSinglePost(postTypeSlug: string, postSlug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  if (!client) return null
  return client.fetch(singlePostQuery, { postTypeSlug, postSlug }, 
    isPreview ? {} : { next: { tags: ['posts', `post-${postSlug}`] } }
  )
}

export async function getPostSlugsByType(postTypeSlug: string, site: string): Promise<string[]> {
  const client = getClient(site)
  if (!client) return []
  const posts = await client.fetch(postSlugsByTypeQuery, { postTypeSlug }, {
    next: { tags: ['posts', `posts-${postTypeSlug}`] }
  })
  return posts.map((p: { slug: string }) => p.slug)
}
