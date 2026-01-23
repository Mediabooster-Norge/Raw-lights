import { draftMode } from 'next/headers'
import { getClient } from './client'
import { getPreviewClient } from './preview'
import { datasetRouter } from './datasetRouter'
import { 
  pageQuery, 
  pagePreviewQuery, 
  pageSlugsQuery 
} from './queries/page'
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

/**
 * Hent siteId fra site-parameter
 * Returnerer null for single-site modus (ingen filtrering)
 * Returnerer siteId string for multisite modus
 */
function getSiteId(site: string): string | null {
  const config = datasetRouter(site)
  return config.siteId
}

export async function getPage(slug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const siteId = getSiteId(site)
  
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
      { slug, siteId },
      usePreviewQuery ? {} : { next: { tags: ['pages', `page-${slug}`] } }
    )
    return result
  } catch (error: any) {
    // If preview fails due to auth, fall back to published content
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      console.warn('[getPage] Preview auth failed, falling back to published content')
      client = getClient(site)
      if (!client) return null
      return client.fetch(pageQuery, { slug, siteId }, { next: { tags: ['pages', `page-${slug}`] } })
    }
    throw error
  }
}

export async function getPageSlugs(site: string) {
  const client = getClient(site)
  const siteId = getSiteId(site)
  if (!client) return []
  return client.fetch<string[]>(pageSlugsQuery, { siteId })
}

export async function getNavigation(site: string) {
  const client = getClient(site)
  const siteId = getSiteId(site)
  if (!client) return null
  return client.fetch(navigationQuery, { siteId }, {
    next: { tags: ['navigation'] }
  })
}

export async function getGlobalSettings(site: string) {
  const client = getClient(site)
  const siteId = getSiteId(site)
  if (!client) return null
  
  const result = await client.fetch(globalSettingsQuery, { siteId }, {
    next: { tags: ['global-settings'] }
  })
  
  console.log('[getGlobalSettings] Result:', JSON.stringify(result, null, 2))
  
  return result
}

// Post Types

export async function getAllPostTypes(site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  const siteId = getSiteId(site)
  if (!client) return []
  
  try {
    return await client.fetch(allPostTypesQuery, { siteId }, 
      isPreview ? {} : { next: { tags: ['post-types'] } }
    )
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      const fallbackClient = getClient(site)
      if (!fallbackClient) return []
      return fallbackClient.fetch(allPostTypesQuery, { siteId }, { next: { tags: ['post-types'] } })
    }
    throw error
  }
}

export async function getPostTypeBySlug(slug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  const siteId = getSiteId(site)
  if (!client) return null
  
  try {
    return await client.fetch(postTypeBySlugQuery, { slug, siteId }, 
      isPreview ? {} : { next: { tags: ['post-types', `post-type-${slug}`] } }
    )
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      const fallbackClient = getClient(site)
      if (!fallbackClient) return null
      return fallbackClient.fetch(postTypeBySlugQuery, { slug, siteId }, { next: { tags: ['post-types', `post-type-${slug}`] } })
    }
    throw error
  }
}

export async function getPostTypeSlugs(site: string): Promise<string[]> {
  const client = getClient(site)
  const siteId = getSiteId(site)
  if (!client) return []
  return client.fetch(allPostTypeSlugsQuery, { siteId }, {
    next: { tags: ['post-types'] }
  })
}

// Posts

export async function getPostsByType(postTypeSlug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient(site) : getClient(site)
  const siteId = getSiteId(site)
  if (!client) return []
  
  try {
    return await client.fetch(postsByTypeQuery, { postTypeSlug, siteId }, 
      isPreview ? {} : { next: { tags: ['posts', `posts-${postTypeSlug}`] } }
    )
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      const fallbackClient = getClient(site)
      if (!fallbackClient) return []
      return fallbackClient.fetch(postsByTypeQuery, { postTypeSlug, siteId }, { next: { tags: ['posts', `posts-${postTypeSlug}`] } })
    }
    throw error
  }
}

export async function getSinglePost(postTypeSlug: string, postSlug: string, site: string) {
  const { isEnabled: isPreview } = await draftMode()
  const siteId = getSiteId(site)
  let client = isPreview ? getPreviewClient(site) : getClient(site)
  if (!client) return null
  
  const query = isPreview ? singlePostPreviewQuery : singlePostQuery
  
  try {
    return await client.fetch(query, { postTypeSlug, postSlug, siteId }, 
      isPreview ? {} : { next: { tags: ['posts', `post-${postSlug}`] } }
    )
  } catch (error: any) {
    // If preview fails due to auth, fall back to published content
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Session')) {
      console.warn('[getSinglePost] Preview auth failed, falling back to published content')
      client = getClient(site)
      if (!client) return null
      return client.fetch(singlePostQuery, { postTypeSlug, postSlug, siteId }, { next: { tags: ['posts', `post-${postSlug}`] } })
    }
    throw error
  }
}

export async function getPostSlugsByType(postTypeSlug: string, site: string): Promise<string[]> {
  const client = getClient(site)
  const siteId = getSiteId(site)
  if (!client) return []
  const posts = await client.fetch(postSlugsByTypeQuery, { postTypeSlug, siteId }, {
    next: { tags: ['posts', `posts-${postTypeSlug}`] }
  })
  return posts.map((p: { slug: string }) => p.slug)
}
