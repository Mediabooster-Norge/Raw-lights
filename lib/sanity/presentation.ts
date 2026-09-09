import { defineLocations } from 'sanity/presentation'

export const resolve = {
  locations: {
    // Settings documents affect all pages
    globalSettings: defineLocations({
      message: 'Globale innstillinger påvirker alle sider',
      tone: 'caution',
      locations: [{ title: 'Forside', href: '/' }]
    }),
    navigation: defineLocations({
      message: 'Navigasjon vises på alle sider',
      tone: 'caution', 
      locations: [{ title: 'Forside', href: '/' }]
    }),
    // Page locations
    page: defineLocations({
      select: { 
        slug: 'slug.current',
        title: 'title'
      },
      resolve: (doc) => {
        if (!doc?.slug) return { locations: [] }
        
        // Handle homepage slugs
        const isHomepage = doc.slug === 'home' || doc.slug === 'forside'
        const href = isHomepage ? '/' : `/${doc.slug}`
        const title = doc.title || (isHomepage ? 'Forside' : doc.slug)
        
        return {
          locations: [{ title, href }]
        }
      }
    }),
    // Post locations
    post: defineLocations({
      select: {
        slug: 'slug.current',
        postTypeSlug: 'postType->slug.current',
        title: 'title'
      },
      resolve: (doc) => ({
        locations: doc?.slug && doc?.postTypeSlug
          ? [{ title: doc.title || doc.slug, href: `/${doc.postTypeSlug}/${doc.slug}` }]
          : []
      })
    }),
    // PostType (archive) locations
    postType: defineLocations({
      select: { 
        slug: 'slug.current', 
        title: 'title' 
      },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [{ title: `${doc.title || doc.slug} (arkiv)`, href: `/${doc.slug}` }]
          : []
      })
    })
  }
}
