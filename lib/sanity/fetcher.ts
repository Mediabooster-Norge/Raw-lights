import { draftMode } from 'next/headers'
import { getClient } from './client'
import { getPreviewClient } from './preview'
import { pageQuery, pagePreviewQuery, pageSlugsQuery } from './queries/page'
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

function isAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  return message.includes('Unauthorized') || message.includes('Session')
}

export async function getPage(slug: string) {
  const { isEnabled: isPreview } = await draftMode()
  let client = isPreview ? getPreviewClient() : getClient()

  if (!client) {
    return null
  }

  const query = isPreview ? pagePreviewQuery : pageQuery

  try {
    return await client.fetch(
      query,
      { slug },
      isPreview ? {} : { next: { tags: ['pages', `page-${slug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      client = getClient()
      if (!client) return null
      return client.fetch(pageQuery, { slug }, { next: { tags: ['pages', `page-${slug}`] } })
    }
    throw error
  }
}

export async function getPageSlugs() {
  const client = getClient()
  if (!client) return []
  return client.fetch<string[]>(pageSlugsQuery)
}

export async function getNavigation() {
  const client = getClient()
  if (!client) return null
  try {
    return await client.fetch(navigationQuery, {}, {
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

export async function getAllPostTypes() {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient() : getClient()
  if (!client) return []

  try {
    return await client.fetch(
      allPostTypesQuery,
      {},
      isPreview ? {} : { next: { tags: ['post-types'] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallbackClient = getClient()
      if (!fallbackClient) return []
      return fallbackClient.fetch(allPostTypesQuery, {}, { next: { tags: ['post-types'] } })
    }
    throw error
  }
}

export async function getPostTypeBySlug(slug: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient() : getClient()
  if (!client) return null

  try {
    return await client.fetch(
      postTypeBySlugQuery,
      { slug },
      isPreview ? {} : { next: { tags: ['post-types', `post-type-${slug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallbackClient = getClient()
      if (!fallbackClient) return null
      return fallbackClient.fetch(
        postTypeBySlugQuery,
        { slug },
        { next: { tags: ['post-types', `post-type-${slug}`] } }
      )
    }
    throw error
  }
}

export async function getPostTypeSlugs(): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  return client.fetch(allPostTypeSlugsQuery, {}, {
    next: { tags: ['post-types'] }
  })
}

export async function getPostsByType(postTypeSlug: string) {
  const { isEnabled: isPreview } = await draftMode()
  const client = isPreview ? getPreviewClient() : getClient()
  if (!client) return []

  try {
    return await client.fetch(
      postsByTypeQuery,
      { postTypeSlug },
      isPreview ? {} : { next: { tags: ['posts', `posts-${postTypeSlug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      const fallbackClient = getClient()
      if (!fallbackClient) return []
      return fallbackClient.fetch(
        postsByTypeQuery,
        { postTypeSlug },
        { next: { tags: ['posts', `posts-${postTypeSlug}`] } }
      )
    }
    throw error
  }
}

export async function getSinglePost(postTypeSlug: string, postSlug: string) {
  const { isEnabled: isPreview } = await draftMode()
  let client = isPreview ? getPreviewClient() : getClient()
  if (!client) return null

  const query = isPreview ? singlePostPreviewQuery : singlePostQuery

  try {
    return await client.fetch(
      query,
      { postTypeSlug, postSlug },
      isPreview ? {} : { next: { tags: ['posts', `post-${postSlug}`] } }
    )
  } catch (error: unknown) {
    if (isAuthError(error)) {
      client = getClient()
      if (!client) return null
      return client.fetch(
        singlePostQuery,
        { postTypeSlug, postSlug },
        { next: { tags: ['posts', `post-${postSlug}`] } }
      )
    }
    throw error
  }
}

export async function getPostSlugsByType(postTypeSlug: string): Promise<string[]> {
  const client = getClient()
  if (!client) return []
  const posts = await client.fetch(postSlugsByTypeQuery, { postTypeSlug }, {
    next: { tags: ['posts', `posts-${postTypeSlug}`] }
  })
  return posts.map((p: { slug: string }) => p.slug)
}
