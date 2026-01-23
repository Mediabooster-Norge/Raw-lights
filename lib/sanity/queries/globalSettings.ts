import { groq } from 'next-sanity'

// Site filter - betinget basert på om siteId er gitt
// Hvis siteId er null (single-site modus), hent første globalSettings dokument
const SITE_FILTER = `(!defined($siteId) || site->siteId.current == $siteId)`

export const globalSettingsQuery = groq`
  *[_type == "globalSettings" && ${SITE_FILTER}][0] {
    siteTheme {
      logo { asset->, alt },
      logoDark { asset-> },
      favicon { asset-> },
      ogImage { asset-> },
      colors {
        primary { hex, alpha },
        secondary { hex, alpha },
        tertiary { hex, alpha },
        background { hex, alpha },
        surface { hex, alpha },
        textPrimary { hex, alpha },
        textSecondary { hex, alpha }
      },
      buttonColors {
        primary { background { hex, alpha }, text { hex, alpha } },
        secondary { background { hex, alpha }, text { hex, alpha } }
      },
      typography {
        headingFont,
        bodyFont,
        customHeadingFont,
        customBodyFont
      },
      navigation {
        linkColor,
        hoverColor
      },
      headerMarquee {
        enabled,
        contentType,
        textItems[] { 
          text,
          link {
            type,
            internalLink-> { _type, slug },
            externalUrl,
            label,
            openInNewTab
          }
        },
        imageItems[] { 
          image { asset-> },
          alt,
          link {
            type,
            internalLink-> { _type, slug },
            externalUrl,
            label,
            openInNewTab
          }
        },
        speed,
        direction,
        backgroundColor,
        textColor,
        separator
      }
    },
    seo {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      robots
    },
    customCode {
      headScripts,
      bodyStartScripts,
      footerScripts
    }
  }
`
