import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  }
}
