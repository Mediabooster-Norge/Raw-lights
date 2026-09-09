import { MetadataRoute } from 'next'
import { getClient } from '@/lib/sanity/client'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { PUBLISH_FILTER } from '@/lib/sanity/queries/page'
import { groq } from 'next-sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getClient()
  const baseUrl = getSiteUrl()

  if (!client) return []

  const pages = await client.fetch<{ slug: string; _updatedAt: string }[]>(
    groq`*[_type == "page" && defined(slug.current) && ${PUBLISH_FILTER}] {
      "slug": slug.current,
      _updatedAt
    }`
  )

  const postTypes = await client.fetch<{ slug: string }[]>(
    groq`*[_type == "postType" && hasArchive == true] {
      "slug": slug.current
    }`
  )

  const posts = await client.fetch<{ slug: string; postTypeSlug: string; _updatedAt: string }[]>(
    groq`*[_type == "post" && visibility == "public" && defined(slug.current)] {
      "slug": slug.current,
      "postTypeSlug": postType->slug.current,
      _updatedAt
    }`
  )

  const pageEntries = pages.map((page) => ({
    url: page.slug === 'forside' ? baseUrl : `${baseUrl}/${page.slug}`,
    lastModified: new Date(page._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: page.slug === 'forside' ? 1 : 0.8
  }))

  const archiveEntries = postTypes.map((postType) => ({
    url: `${baseUrl}/${postType.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/${post.postTypeSlug}/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))

  return [...pageEntries, ...archiveEntries, ...postEntries]
}
