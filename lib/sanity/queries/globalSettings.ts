import { groq } from 'next-sanity'

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    siteName,
    enableCookieConsent,
    "homePageId": homePage._ref,
    "homePageSlug": homePage->slug.current,
    "notFoundPageId": notFoundPage._ref,
    "privacyPageId": privacyPage._ref,
    "privacyPageSlug": privacyPage->slug.current,
    siteTheme {
      logo { asset->, alt },
      favicon { asset-> },
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
    seoNb {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      canonicalUrl,
      robots
    },
    seoEn {
      metaTitle,
      metaDescription,
      metaImage { asset-> },
      canonicalUrl,
      robots
    },
    localizedSeo[] {
      language,
      seo {
        metaTitle,
        metaDescription,
        metaImage { asset-> },
        canonicalUrl,
        robots
      }
    },
    localizedUiCopy[] { language, copy },
    schemaOrganization {
      legalName,
      email,
      telephone,
      address {
        streetAddress,
        postalCode,
        addressLocality,
        addressCountry
      }
    },
    customCode {
      consentScript { enabled, scriptUrl, inlineScript },
      headScripts,
      bodyStartScripts,
      footerScripts
    }
  }
`
