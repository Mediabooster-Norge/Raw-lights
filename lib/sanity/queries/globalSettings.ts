import { groq } from 'next-sanity'

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
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
