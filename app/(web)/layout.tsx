import { ReactNode } from 'react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import { getNavigation, getGlobalSettings } from '@/lib/sanity/fetcher'
import { mergeTheme } from '@/lib/theme/mergeTheme'
import { Header } from '@/lib/components/layout/Header'
import { Footer } from '@/lib/components/layout/Footer'
import { SkipToContent } from '@/lib/components/ui/SkipToContent'
import { PreviewBanner } from '@/lib/components/ui/PreviewBanner'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

type Props = {
  children: ReactNode
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings()
  const baseUrl = getSiteUrl()
  const siteName = settings?.siteName ?? settings?.seo?.metaTitle ?? 'Nettsted'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${settings?.seo?.metaTitle ?? siteName}`,
      default: settings?.seo?.metaTitle ?? siteName
    },
    description: settings?.seo?.metaDescription ?? '',
    openGraph: {
      images: settings?.seo?.metaImage?.asset?.url
        ? [{ url: settings.seo.metaImage.asset.url }]
        : []
    },
    icons: settings?.siteTheme?.favicon?.asset?.url
      ? { icon: settings.siteTheme.favicon.asset.url }
      : undefined
  }
}

export default async function WebLayout({ children }: Props) {
  const draft = await draftMode()
  const isDraftMode = draft.isEnabled

  const [navigation, settings] = await Promise.all([
    getNavigation(),
    getGlobalSettings()
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
    <div className={`${inter.variable} min-h-screen bg-background text-text-primary font-body`} style={cssVariables}>
      <JsonLd jsonLd={settings?.seo?.jsonLd} />
      {settings?.customCode?.headScripts && (
        <Script id="head-scripts" strategy="afterInteractive">
          {settings.customCode.headScripts}
        </Script>
      )}
      {settings?.customCode?.bodyStartScripts && (
        <Script id="body-start-scripts" strategy="afterInteractive">
          {settings.customCode.bodyStartScripts}
        </Script>
      )}
      <SkipToContent />
      <PreviewBanner />
      <Header
        logo={settings?.siteTheme?.logo}
        mainNav={navigation?.mainNav}
        headerCta={navigation?.headerCta}
      />
      <main id="main-content">
        {children}
      </main>
      <Footer
        logo={settings?.siteTheme?.logo}
        footerNav={navigation?.footerNav}
        socialLinks={navigation?.socialLinks}
      />
      {settings?.customCode?.footerScripts && (
        <Script id="footer-scripts" strategy="afterInteractive">
          {settings.customCode.footerScripts}
        </Script>
      )}
      {isDraftMode && <VisualEditing />}
    </div>
  )
}
