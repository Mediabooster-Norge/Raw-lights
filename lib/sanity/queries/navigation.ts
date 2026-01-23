import { groq } from 'next-sanity'

// Site filter - betinget basert på om siteId er gitt
// Hvis siteId er null (single-site modus), hent første navigation dokument
const SITE_FILTER = `(!defined($siteId) || site->siteId.current == $siteId)`

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
  *[_type == "navigation" && ${SITE_FILTER}][0] {
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
