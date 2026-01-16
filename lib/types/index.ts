// Page types
export type Page = {
  _id: string
  _type: 'page'
  title: string
  slug: string
  blocks: SanityBlock[]
  visibility: 'public' | 'private'
  publishDate?: string
  seo?: SEO
}

// SEO types
export type SEO = {
  metaTitle?: string
  metaDescription?: string
  metaImage?: SanityImage
  canonicalUrl?: string
  robots?: string
}

// Block types
export type SanityBlock = {
  _key: string
  _type: string
  children?: SanityBlock[]
  [key: string]: unknown
}

// Image types
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

// Link types
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

// Navigation types
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

// Post Type types
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
}

// Post types
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
  visibility: 'public' | 'hidden'
  order?: number
  seo?: SEO
}

// Theme types
export type SiteTheme = {
  logo?: SanityImage
  logoDark?: SanityImage
  favicon?: SanityImage
  ogImage?: SanityImage
  colors?: {
    primary?: { hex: string }
    secondary?: { hex: string }
    tertiary?: { hex: string }
    background?: { hex: string }
    surface?: { hex: string }
    textPrimary?: { hex: string }
    textSecondary?: { hex: string }
  }
  buttonColors?: {
    primary?: { background?: { hex: string }; text?: { hex: string } }
    secondary?: { background?: { hex: string }; text?: { hex: string } }
  }
  typography?: {
    headingFont?: string
    bodyFont?: string
    customHeadingFont?: string
    customBodyFont?: string
  }
}

// Global settings types
export type GlobalSettings = {
  siteTheme?: SiteTheme
  seo?: SEO
  customCode?: {
    headScripts?: string
    bodyStartScripts?: string
    footerScripts?: string
  }
}
