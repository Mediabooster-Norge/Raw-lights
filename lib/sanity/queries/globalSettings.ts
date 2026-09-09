import { groq } from 'next-sanity'

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    siteName,
    enableCookieConsent,
    "homePageId": homePage._ref,
    "homePageSlug": homePage->slug.current,
    "notFoundPageId": notFoundPage._ref,
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
      robots
    },
    customCode {
      headScripts,
      bodyStartScripts,
      footerScripts
    }
  }
`
