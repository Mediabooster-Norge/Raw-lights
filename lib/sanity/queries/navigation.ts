import { groq } from 'next-sanity'

export const linkFields = groq`
  _type,
  type,
  label,
  openInNewTab,
  externalUrl,
  internalLink-> {
    _type,
    "slug": slug.current,
    // For posts: include the postType slug for building the full URL
    "postTypeSlug": postType->slug.current
  }
`

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    mainNav[] {
      label,
      link { ${linkFields} },
      children[] {
        label,
        link { ${linkFields} }
      }
    },
    headerCta {
      link { ${linkFields} },
      variant
    },
    footerNav[] {
      title,
      links[] { ${linkFields} }
    },
    socialLinks[] {
      platform,
      url
    }
  }
`
