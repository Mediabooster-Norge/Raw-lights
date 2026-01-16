import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/']
      }
    ],
    sitemap: [
      'https://landstreffstavanger.no/sitemap.xml',
      'https://ypsilonfestivalen.no/sitemap.xml',
      'https://julivinterland.no/sitemap.xml'
    ]
  }
}
