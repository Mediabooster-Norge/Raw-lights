import { defineLocations } from 'sanity/presentation'
import { localizedPath, parseLocale } from '@/lib/i18n/config'

function pageHref(slug?: string, language?: string) {
  const locale = parseLocale(language)
  const isHomepage = slug === 'home' || slug === 'forside'
  return localizedPath(locale, isHomepage ? '/' : `/${slug}`)
}

export const resolve = {
  locations: {
    globalSettings: defineLocations({
      message: 'Globale innstillinger påvirker alle sider',
      tone: 'caution',
      locations: [{ title: 'Forside', href: '/' }]
    }),
    navigation: defineLocations({
      select: { language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Forside', href: localizedPath(parseLocale(doc?.language), '/') }]
      })
    }),
    page: defineLocations({
      select: {
        slug: 'slug.current',
        title: 'title',
        language: 'language'
      },
      resolve: (doc) => {
        if (!doc?.slug) return { locations: [] }
        return {
          locations: [{ title: doc.title || doc.slug, href: pageHref(doc.slug, doc.language) }]
        }
      }
    }),
    post: defineLocations({
      select: {
        slug: 'slug.current',
        postTypeSlug: 'postType->slug.current',
        title: 'title',
        language: 'language'
      },
      resolve: (doc) => ({
        locations: doc?.slug && doc?.postTypeSlug
          ? [{
              title: doc.title || doc.slug,
              href: localizedPath(parseLocale(doc.language), `/${doc.postTypeSlug}/${doc.slug}`)
            }]
          : []
      })
    }),
    postType: defineLocations({
      select: {
        slug: 'slug.current',
        title: 'title',
        language: 'language'
      },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [{
              title: `${doc.title || doc.slug} (arkiv)`,
              href: localizedPath(parseLocale(doc.language), `/${doc.slug}`)
            }]
          : []
      })
    })
  }
}
