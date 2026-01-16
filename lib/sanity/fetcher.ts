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
  
  // Try preview client first, fall back to regular client if it fails
  let client = isPreview ? getPreviewClient(site) : getClient(site)
  let usePreviewQuery = isPreview
  
  if (!client) {
    console.log('[getPage] No client available')
    return null
  }
  
  const query = usePreviewQuery ? pagePreviewQuery : pageQuery
  
  try {
    const result = await client.fetch(
      query,
      { slug },
      usePreviewQuery ? {} : { next: { tags: ['pages', `page-${slug}`] } }
    )
    return result
  } catch (error: any) {
    // If preview fails due to auth, fall back to published content
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      console.warn('[getPage] Preview auth failed, falling back to published content')
      client = getClient(site)
      if (!client) return null
      return client.fetch(pageQuery, { slug }, { next: { tags: ['pages', `page-${slug}`] } })
    }
    throw error
  }
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
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  if (!client) return []
  
  try {
    return await client.fetch(allPostTypesQuery, {}, 
      isPreview ? {} : { next: { tags: ['post-types'] } }
    )
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      const fallbackClient = getClient(site)
      if (!fallbackClient) return []
      return fallbackClient.fetch(allPostTypesQuery, {}, { next: { tags: ['post-types'] } })
    }
    throw error
  }
}

export async function getPostTypeBySlug(slug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  if (!client) return null
  
  try {
    return await client.fetch(postTypeBySlugQuery, { slug }, 
      isPreview ? {} : { next: { tags: ['post-types', `post-type-${slug}`] } }
    )
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      const fallbackClient = getClient(site)
      if (!fallbackClient) return null
      return fallbackClient.fetch(postTypeBySlugQuery, { slug }, { next: { tags: ['post-types', `post-type-${slug}`] } })
    }
    throw error
  }
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
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  if (!client) return []
  
  try {
    return await client.fetch(postsByTypeQuery, { postTypeSlug }, 
      isPreview ? {} : { next: { tags: ['posts', `posts-${postTypeSlug}`] } }
    )
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      const fallbackClient = getClient(site)
      if (!fallbackClient) return []
      return fallbackClient.fetch(postsByTypeQuery, { postTypeSlug }, { next: { tags: ['posts', `posts-${postTypeSlug}`] } })
    }
    throw error
  }
}

export async function getSinglePost(postTypeSlug: string, postSlug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  let client = isPreview ? getPreviewClient(site) : getClient(site)
  if (!client) return null
  
  try {
    return await client.fetch(singlePostQuery, { postTypeSlug, postSlug }, 
      isPreview ? {} : { next: { tags: ['posts', `post-${postSlug}`] } }
    )
  } catch (error: any) {
    // If preview fails due to auth, fall back to published content
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      console.warn('[getSinglePost] Preview auth failed, falling back to published content')
      client = getClient(site)
      if (!client) return null
      return client.fetch(singlePostQuery, { postTypeSlug, postSlug }, { next: { tags: ['posts', `post-${postSlug}`] } })
    }
    throw error
  }
}

export async function getPostSlugsByType(postTypeSlug: string, site: string): Promise<string[]> {
  const client = getClient(site)
  if (!client) return []
  const posts = await client.fetch(postSlugsByTypeQuery, { postTypeSlug }, {
    next: { tags: ['posts', `posts-${postTypeSlug}`] }
  })
  return posts.map((p: { slug: string }) => p.slug)
}
