import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHomePage } from '@/lib/sanity/fetcher'
import { PageRenderer } from '@/lib/components/blocks/PageRenderer'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { isLocale, localizedPath, t, type Locale } from '@/lib/i18n'
import { metadataAlternates } from '@/lib/i18n/alternates'
import { buildPageJsonLd, parseJsonLdOverride } from '@/lib/seo/buildJsonLd'
import { socialMetadata } from '@/lib/seo/socialMetadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}
  const page = await getHomePage(localeParam)
  if (!page) return {}

  const baseUrl = getSiteUrl()
  const url = localizedPath(localeParam, '/')
  const title = page.seo?.metaTitle ?? page.title
  const description = page.seo?.metaDescription
  const canonical = page.seo?.canonicalUrl ?? `${baseUrl}${url === '/' ? '' : url}`

  return {
    title,
    description,
    ...socialMetadata({
      title,
      description,
      imageUrl: page.seo?.metaImage?.asset?.url,
      locale: localeParam,
      url: canonical,
    }),
    alternates: await metadataAlternates(
      localizedPath(localeParam, '/'),
      canonical
    ),
    robots: page.seo?.robots
  }
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale: Locale = localeParam
  const page = await getHomePage(locale)

  if (!page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t(locale, 'welcome')}</h1>
          <p className="text-text-secondary">{t(locale, 'missingHome')}</p>
        </div>
      </div>
    )
  }

  const siteUrl = getSiteUrl()
  const url = `${siteUrl}${localizedPath(locale, '/') === '/' ? '' : localizedPath(locale, '/')}`

  return (
    <>
      <JsonLd
        data={buildPageJsonLd({
          type: page.jsonLdType,
          override: parseJsonLdOverride(page.jsonLdOverride),
          title: page.seo?.metaTitle ?? page.title,
          description: page.seo?.metaDescription,
          url,
          siteUrl: siteUrl,
          locale,
          slug: page.slug,
          blocks: page.blocks,
        })}
      />
      <PageRenderer blocks={page.blocks ?? []} />
    </>
  )
}
