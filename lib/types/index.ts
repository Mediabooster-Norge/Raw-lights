// Page types
export type Page = {
  _id: string
  _type: 'page'
  title: string
  slug: string
  blocks: SanityBlock[]
  visibility: 'public' | 'hidden'
  publishDate?: string
  jsonLdType?: string
  jsonLdOverride?: string
  seo?: SEO
}

export type SEO = {
  metaTitle?: string
  metaDescription?: string
  metaImage?: SanityImage
  canonicalUrl?: string
  robots?: string
  jsonLd?: string
}

export type SanityBlock = {
  _key: string
  _type: string
  children?: SanityBlock[]
  [key: string]: unknown
}

export type SanityImage = {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions: {
        width: number
        height: number
      }
    }
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export type SanityLink = {
  _type: 'link'
  type: 'internal' | 'external'
  label?: string
  internalLink?: {
    _type: string
    slug: { current: string }
  }
  externalUrl?: string
  openInNewTab?: boolean
}

export type NavItem = {
  label: string
  link?: SanityLink
  children?: NavItem[]
}

export type Navigation = {
  mainNav?: NavItem[]
  headerCta?: {
    link: SanityLink
    variant: 'primary' | 'secondary'
  }
  footerNav?: {
    title: string
    links: SanityLink[]
  }[]
  socialLinks?: {
    platform: string
    url: string
  }[]
}

export type PostType = {
  _id: string
  _type: 'postType'
  title: string
  singularTitle: string
  slug: string
  description?: string
  hasArchive: boolean
  hasSingleView: boolean
  archiveLayout?: 'grid' | 'list' | 'masonry'
  archiveColumns?: number
  archiveTitle?: string
  archiveDescription?: string
  showExcerpt?: boolean
  showImage?: boolean
  showDate?: boolean
  jsonLdType?: string
  seo?: SEO
}

export type Post = {
  _id: string
  _type: 'post'
  title: string
  slug: string
  postType: PostType
  featuredImage?: SanityImage
  excerpt?: string
  content?: any
  gallery?: SanityImage[]
  externalUrl?: string
  externalUrlLabel?: string
  publishDate?: string
  _updatedAt?: string
  jsonLdType?: string
  visibility: 'public' | 'hidden'
  order?: number
  seo?: SEO
}

export type SiteTheme = {
  logo?: SanityImage
  favicon?: SanityImage
  colors?: {
    primary?: { hex: string; alpha?: number }
    background?: { hex: string; alpha?: number }
    textPrimary?: { hex: string; alpha?: number }
  }
  typography?: {
    headingFont?: string
    bodyFont?: string
    customHeadingFont?: string
    customBodyFont?: string
  }
}

export type GlobalSettings = {
  siteName?: string
  enableCookieConsent?: boolean
  homePageId?: string
  homePageSlug?: string
  notFoundPageId?: string
  siteTheme?: SiteTheme
  seo?: SEO
  customCode?: {
    headScripts?: string
    bodyStartScripts?: string
    footerScripts?: string
  }
}
