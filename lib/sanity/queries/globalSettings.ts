import { groq } from 'next-sanity'

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    siteName,
    siteTheme {
      logo { asset->, alt },
      favicon { asset-> },
      colors {
        primary { hex, alpha },
        background { hex, alpha },
        textPrimary { hex, alpha }
      },
      typography {
        headingFont,
        bodyFont,
        customHeadingFont,
        customBodyFont
      }
    },
    seo {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      canonicalUrl,
      robots,
      jsonLd
    },
    customCode {
      headScripts,
      bodyStartScripts,
      footerScripts
    }
  }
`
