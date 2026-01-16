import Link from 'next/link'
import { CSSProperties, ReactNode } from 'react'

type SanityLinkType = {
  type?: 'internal' | 'external'
  internalLink?: {
    _type?: string
    slug?: string | { current: string }
    postTypeSlug?: string  // For post references
  }
  externalUrl?: string
  label?: string
  openInNewTab?: boolean
}

type SanityLinkProps = {
  link: SanityLinkType | null | undefined
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

function buildInternalUrl(internalLink: SanityLinkType['internalLink']): string | null {
  if (!internalLink) return null
  
  // Handle slug that can be string or object
  const slug = typeof internalLink.slug === 'string' 
    ? internalLink.slug 
    : internalLink.slug?.current
  
  if (!slug) return null
  
  // For posts: include the postType slug in the URL
  // e.g., /artister/aurora
  if (internalLink._type === 'post' && internalLink.postTypeSlug) {
    return `/${internalLink.postTypeSlug}/${slug}`
  }
  
  // For pages and postTypes (archive pages): just use the slug
  // e.g., /om-oss or /artister
  return `/${slug}`
}

export function SanityLink({ link, children, className, style }: SanityLinkProps) {
  if (!link) return null

  // Get the label content
  const content = children || link.label
  if (!content) return null

  const isExternal = link.type === 'external'
  
  const href = isExternal 
    ? link.externalUrl 
    : buildInternalUrl(link.internalLink)

  // If no href but has label, render as span (for preview/placeholder)
  if (!href) {
    return (
      <span className={className} style={style}>
        {content}
      </span>
    )
  }

  if (isExternal) {
    return (
      <a 
        href={href} 
        target={link.openInNewTab ? '_blank' : undefined} 
        rel={link.openInNewTab ? 'noopener noreferrer' : undefined} 
        className={className}
        style={style}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className} style={style}>
      {content}
    </Link>
  )
}
