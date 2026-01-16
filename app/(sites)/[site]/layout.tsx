import { ReactNode } from 'react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getNavigation, getGlobalSettings } from '@/lib/sanity/fetcher'
import { mergeTheme } from '@/lib/theme/mergeTheme'
import { Header } from '@/lib/components/layout/Header'
import { Footer } from '@/lib/components/layout/Footer'
import { SkipToContent } from '@/lib/components/ui/SkipToContent'
import { PreviewBanner } from '@/lib/components/ui/PreviewBanner'
import { HeaderMarquee } from '@/lib/components/ui/HeaderMarquee'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

type Props = {
  children: ReactNode
  params: Promise<{ site: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params
  const settings = await getGlobalSettings(site)
  const baseUrl = getSiteUrl(site) || 'http://localhost:3000'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${settings?.seo?.metaTitle ?? site}`,
      default: settings?.seo?.metaTitle ?? site
    },
    description: settings?.seo?.metaDescription ?? '',
    openGraph: {
      images: settings?.seo?.metaImage?.asset?.url 
        ? [{ url: settings.seo.metaImage.asset.url }] 
        : []
    }
  }
}

export default async function SiteLayout({ children, params }: Props) {
  const { site } = await params
  const [navigation, settings] = await Promise.all([
    getNavigation(site),
    getGlobalSettings(site)
  ])

  const theme = mergeTheme(settings?.siteTheme)
  
  const cssVariables = {
    '--color-primary': theme.palette.primary,
    '--color-secondary': theme.palette.secondary,
    '--color-tertiary': theme.palette.tertiary,
    '--color-background': theme.palette.background,
    '--color-surface': theme.palette.surface,
    '--color-text-primary': theme.palette.textPrimary,
    '--color-text-secondary': theme.palette.textSecondary,
    '--color-on-primary': theme.palette.onPrimary,
    '--color-on-secondary': theme.palette.onSecondary,
    // CTA/Button colors
    '--color-cta-primary-bg': theme.components.cta.primary.background,
    '--color-cta-primary-text': theme.components.cta.primary.text,
    '--color-cta-primary-border': theme.components.cta.primary.border,
    '--color-cta-secondary-bg': theme.components.cta.secondary.background,
    '--color-cta-secondary-text': theme.components.cta.secondary.text,
    '--color-cta-secondary-border': theme.components.cta.secondary.border,
    '--font-heading': theme.typography.fontFamily.heading,
    '--font-body': theme.typography.fontFamily.body
  } as React.CSSProperties

  return (
    <html lang="no" className={inter.variable}>
      <head>
        {settings?.customCode?.headScripts && (
          <Script id="head-scripts" strategy="afterInteractive">
            {settings.customCode.headScripts}
          </Script>
        )}
      </head>
      <body style={cssVariables}>
        {settings?.customCode?.bodyStartScripts && (
          <Script id="body-start-scripts" strategy="afterInteractive">
            {settings.customCode.bodyStartScripts}
          </Script>
        )}
        <SkipToContent />
        <PreviewBanner />
        <Header
          logo={settings?.siteTheme?.logo}
          logoDark={settings?.siteTheme?.logoDark}
          mainNav={navigation?.mainNav}
          headerCta={navigation?.headerCta}
          navColors={settings?.siteTheme?.navigation}
        />
        {settings?.siteTheme?.headerMarquee?.enabled && (
          <HeaderMarquee
            contentType={settings.siteTheme.headerMarquee.contentType}
            textItems={settings.siteTheme.headerMarquee.textItems}
            imageItems={settings.siteTheme.headerMarquee.imageItems}
            speed={settings.siteTheme.headerMarquee.speed}
            direction={settings.siteTheme.headerMarquee.direction}
            backgroundColor={settings.siteTheme.headerMarquee.backgroundColor}
            textColor={settings.siteTheme.headerMarquee.textColor}
            separator={settings.siteTheme.headerMarquee.separator}
          />
        )}
        <main id="main-content">
          {children}
        </main>
        <Footer
          logo={settings?.siteTheme?.logo}
          logoDark={settings?.siteTheme?.logoDark}
          footerNav={navigation?.footerNav}
          socialLinks={navigation?.socialLinks}
        />
        {settings?.customCode?.footerScripts && (
          <Script id="footer-scripts" strategy="afterInteractive">
            {settings.customCode.footerScripts}
          </Script>
        )}
      </body>
    </html>
  )
}
