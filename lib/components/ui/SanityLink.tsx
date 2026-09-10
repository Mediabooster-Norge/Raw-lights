'use client'

import { CSSProperties, ReactNode } from 'react'
import { LocaleLink, useHomeSlug } from '@/lib/i18n'

type SanityLinkType = {
  type?: 'internal' | 'external'
  internalLink?: {
    _type?: string
    slug?: string | { current: string }
    postTypeSlug?: string
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

function buildInternalUrl(
  internalLink: SanityLinkType['internalLink'],
  homeSlug?: string | null
): string | null {
  if (!internalLink) return null

  const slug = typeof internalLink.slug === 'string'
    ? internalLink.slug
    : internalLink.slug?.current

  if (!slug) return null

  if (
    slug === 'forside' ||
    slug === 'home' ||
    (homeSlug && slug === homeSlug) ||
    internalLink._type === 'globalSettings'
  ) {
    return '/'
  }

  if (internalLink._type === 'post' && internalLink.postTypeSlug) {
    return `/${internalLink.postTypeSlug}/${slug}`
  }

  if (internalLink._type === 'product') {
    return `/products/${slug}`
  }

  return `/${slug}`
}

export function SanityLink({ link, children, className, style }: SanityLinkProps) {
  const homeSlug = useHomeSlug()
  if (!link) return null

  const content = children || link.label
  if (!content) return null

  const isExternal = link.type === 'external'
  const href = isExternal
    ? link.externalUrl
    : buildInternalUrl(link.internalLink, homeSlug)

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
    <LocaleLink href={href} className={className} style={style}>
      {content}
    </LocaleLink>
  )
}
