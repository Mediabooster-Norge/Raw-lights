import { ReactNode } from 'react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { draftMode, headers } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { notFound } from 'next/navigation'
import '../globals.css'
import { getNavigation, getGlobalSettings, getHomePageSlug } from '@/lib/sanity/fetcher'
import { mergeTheme } from '@/lib/theme/mergeTheme'
import { googleFontsHref } from '@/lib/theme/loadFonts'
import { Header } from '@/lib/components/layout/Header'
import { Footer } from '@/lib/components/layout/Footer'
import { SkipToContent } from '@/lib/components/ui/SkipToContent'
import { PreviewBanner } from '@/lib/components/ui/PreviewBanner'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { CookieConsent } from '@/lib/components/ui/CookieConsent'
import { CustomCodeScripts } from '@/lib/components/ui/CustomCodeScripts'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { LocaleProvider, isLocale, localizedPath, locales, type Locale } from '@/lib/i18n'
import { getAlternateUrls, languageMetadata } from '@/lib/i18n/alternates'
import { buildOrganizationGraph } from '@/lib/seo/buildJsonLd'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}

  const settings = await getGlobalSettings()
  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || localizedPath(localeParam, '/')
  const alternates = await getAlternateUrls(pathname)
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
      : undefined,
    alternates: {
      languages: languageMetadata(alternates)
    }
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale: Locale = localeParam

  const draft = await draftMode()
  const isDraftMode = draft.isEnabled
  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || localizedPath(locale, '/')

  const [navigation, settings, alternates, homeSlug] = await Promise.all([
    getNavigation(locale),
    getGlobalSettings(),
    getAlternateUrls(pathname),
    getHomePageSlug(locale),
  ])

  const theme = mergeTheme(settings?.siteTheme)
  const fontsHref = googleFontsHref([
    theme.typography.fontFamily.heading,
    theme.typography.fontFamily.body,
  ])
  const homeHref = localizedPath(locale, '/')
  const cookieEnabled = settings?.enableCookieConsent !== false

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

  const organizationGraph = {
    '@context': 'https://schema.org',
    '@graph': buildOrganizationGraph({
      siteName: settings?.siteName,
      siteUrl: getSiteUrl(),
      logoUrl: settings?.siteTheme?.logo?.asset?.url,
      locale,
    }),
  }

  return (
    <LocaleProvider locale={locale} homeSlug={homeSlug}>
      <div className={`${inter.variable} min-h-screen bg-background text-text-primary font-body`} style={cssVariables}>
        {fontsHref ? (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link rel="stylesheet" href={fontsHref} />
        ) : null}
        <JsonLd data={organizationGraph} />
        <CustomCodeScripts
          enabled={cookieEnabled}
          headScripts={settings?.customCode?.headScripts}
          bodyStartScripts={settings?.customCode?.bodyStartScripts}
          footerScripts={settings?.customCode?.footerScripts}
        />
        <SkipToContent />
        <PreviewBanner locale={locale} />
        <Header
          logo={settings?.siteTheme?.logo}
          mainNav={navigation?.mainNav}
          headerCta={navigation?.headerCta}
          homeHref={homeHref}
          alternates={alternates}
        />
        <main id="main-content">
          {children}
        </main>
        <Footer
          logo={settings?.siteTheme?.logo}
          footerNav={navigation?.footerNav}
          socialLinks={navigation?.socialLinks}
          homeHref={homeHref}
        />
        <CookieConsent locale={locale} enabled={cookieEnabled} />
        {isDraftMode && <VisualEditing />}
      </div>
    </LocaleProvider>
  )
}
