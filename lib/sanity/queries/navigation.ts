import { groq } from 'next-sanity'
import { LANGUAGE_FILTER } from './page'

export const linkFields = groq`
  _type,
  type,
  label,
  openInNewTab,
  externalUrl,
  internalLink-> {
    _type,
    "slug": slug.current,
    "postTypeSlug": postType->slug.current
  }
`

export const navigationQuery = groq`
  *[_type == "navigation" && ${LANGUAGE_FILTER}][0] {
    language,
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
