import { MetadataRoute } from 'next'
import { getHomePageSlugs, getSitemapEntries } from '@/lib/sanity/fetcher'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { localizedPath, parseLocale } from '@/lib/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const [{ pages = [], postTypes = [], posts = [] }, homeSlugs] = await Promise.all([
    getSitemapEntries(),
    getHomePageSlugs(),
  ])

  const pageEntries = pages.map((page: { slug: string; language?: string; _updatedAt: string }) => {
    const locale = parseLocale(page.language)
    const isHome = homeSlugs.has(page.slug)
    const path = localizedPath(locale, isHome ? '/' : `/${page.slug}`)
    return {
      url: `${baseUrl}${path === '/' ? '' : path}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: isHome ? 1 : 0.8
    }
  })

  const archiveEntries = postTypes.map((postType: { slug: string; language?: string }) => {
    const locale = parseLocale(postType.language)
    return {
      url: `${baseUrl}${localizedPath(locale, `/${postType.slug}`)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }
  })

  const postEntries = posts.map((post: { slug: string; postTypeSlug: string; language?: string; _updatedAt: string }) => {
    const locale = parseLocale(post.language)
    return {
      url: `${baseUrl}${localizedPath(locale, `/${post.postTypeSlug}/${post.slug}`)}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }
  })

  return [...pageEntries, ...archiveEntries, ...postEntries]
}
