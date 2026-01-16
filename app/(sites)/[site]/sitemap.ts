import { MetadataRoute } from 'next'
import { getClient } from '@/lib/sanity/client'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { PUBLISH_FILTER } from '@/lib/sanity/queries/page'
import { groq } from 'next-sanity'

type Props = {
  params: Promise<{ site: string }>
}

export async function generateSitemaps() {
  return [
    { id: 'landstreff' },
    { id: 'ypsilon' },
    { id: 'julivinterland' }
  ]
}

export default async function sitemap({ params }: Props): Promise<MetadataRoute.Sitemap> {
  const { site } = await params
  const client = getClient(site)
  const baseUrl = getSiteUrl(site)

  const pages = await client.fetch<{ slug: string; _updatedAt: string }[]>(
    groq`*[_type == "page" && defined(slug.current) && ${PUBLISH_FILTER}] {
      "slug": slug.current,
      _updatedAt
    }`
  )

  // Fetch all post types
  const postTypes = await client.fetch<{ slug: string }[]>(
    groq`*[_type == "postType" && hasArchive == true] {
      "slug": slug.current
    }`
  )

  // Fetch all posts with their post type slug
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

  // Archive pages for each post type
  const archiveEntries = postTypes.map((postType) => ({
    url: `${baseUrl}/${postType.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))

  // Individual post pages
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/${post.postTypeSlug}/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))

  return [...pageEntries, ...archiveEntries, ...postEntries]
}
