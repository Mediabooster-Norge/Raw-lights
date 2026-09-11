import { ReactNode } from 'react'
import { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { notFound } from 'next/navigation'
import '../globals.css'
import { getNavigation, getGlobalSettings, getHomePageSlug, getPrivacyPageSlug } from '@/lib/sanity/fetcher'
import { mergeTheme } from '@/lib/theme/mergeTheme'
import { Header } from '@/lib/components/layout/Header'
import { Footer } from '@/lib/components/layout/Footer'
import { SkipToContent } from '@/lib/components/ui/SkipToContent'
import { PreviewBanner } from '@/lib/components/ui/PreviewBanner'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { CookieConsent } from '@/lib/components/ui/CookieConsent'
import { CustomCodeScripts } from '@/lib/components/ui/CustomCodeScripts'
import { RawChrome } from '@/lib/components/layout/RawChrome'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { LocaleProvider, isLocale, localizedPath, locales, type Locale } from '@/lib/i18n'
import { getAlternateUrls, languageMetadata } from '@/lib/i18n/alternates'
import { buildOrganizationGraph } from '@/lib/seo/buildJsonLd'
import { socialMetadata } from '@/lib/seo/socialMetadata'

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
  const title = settings?.seo?.metaTitle ?? siteName
  const description = settings?.seo?.metaDescription ?? ''
  const imageUrl = settings?.seo?.metaImage?.asset?.url

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${title}`,
      default: title
    },
    description,
    ...socialMetadata({
      title,
      description,
      imageUrl,
      locale: localeParam,
      url: baseUrl,
    }),
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
  const [navigation, settings, homeSlug, privacySlug] = await Promise.all([
    getNavigation(locale),
    getGlobalSettings(),
    getHomePageSlug(locale),
    getPrivacyPageSlug(locale),
  ])

  const theme = mergeTheme(settings?.siteTheme)
  const homeHref = localizedPath(locale, '/')
  const cookieEnabled = settings?.enableCookieConsent !== false
  const privacyHref = privacySlug ? localizedPath(locale, `/${privacySlug}`) : null
  const sameAs = (navigation?.socialLinks ?? [])
    .map((link: { url?: string }) => link.url)
    .filter((url: string | undefined): url is string => Boolean(url))

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
      sameAs,
      contact: settings?.schemaOrganization,
    }),
  }

  return (
    <LocaleProvider locale={locale} homeSlug={homeSlug}>
      <div className="raw-site" style={cssVariables}>
        <link rel="stylesheet" href="/fonts/google-fonts.css" />
        <RawChrome logo={settings?.siteTheme?.logo} />
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
        <CookieConsent locale={locale} enabled={cookieEnabled} privacyHref={privacyHref} />
        {isDraftMode && <VisualEditing />}
      </div>
    </LocaleProvider>
  )
}
