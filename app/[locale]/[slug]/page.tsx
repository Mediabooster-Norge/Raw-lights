import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getHomePageSlug, getPage, getPageSlugs, getPostTypeBySlug, getPostsByType, getPostTypeSlugs } from '@/lib/sanity/fetcher'
import { PageRenderer } from '@/lib/components/blocks/PageRenderer'
import { PostArchive } from '@/lib/components/posts/PostArchive'
import { Breadcrumbs } from '@/lib/components/ui/Breadcrumbs'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { isLocale, locales, localizedPath, publicUrl, type Locale } from '@/lib/i18n'
import { metadataAlternates } from '@/lib/i18n/alternates'
import { buildCollectionJsonLd, buildPageJsonLd, parseJsonLdOverride } from '@/lib/seo/buildJsonLd'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const nested = await Promise.all(
      locales.map(async (locale) => {
        const [pageSlugs, postTypeSlugs, homeSlug] = await Promise.all([
          getPageSlugs(locale),
          getPostTypeSlugs(locale),
          getHomePageSlug(locale),
        ])
        const slugs = new Set<string>([
          ...pageSlugs.filter((slug) => slug && slug !== homeSlug && slug !== 'forside' && slug !== 'home'),
          ...postTypeSlugs
        ])
        return Array.from(slugs).map((slug) => ({ locale, slug }))
      })
    )
    return nested.flat()
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  if (!isLocale(localeParam)) return {}
  const locale = localeParam

  const [postType, page] = await Promise.all([
    getPostTypeBySlug(slug, locale),
    getPage(slug, locale)
  ])

  const baseUrl = getSiteUrl()
  const canonical = publicUrl(baseUrl, locale, `/${slug}`)

  if (postType && postType.hasArchive) {
    return {
      title: postType.seo?.metaTitle ?? postType.archiveTitle ?? postType.title,
      description: postType.seo?.metaDescription ?? postType.archiveDescription,
      openGraph: {
        title: postType.seo?.metaTitle ?? postType.archiveTitle ?? postType.title,
        description: postType.seo?.metaDescription ?? postType.archiveDescription,
        images: postType.seo?.metaImage?.asset?.url
          ? [{ url: postType.seo.metaImage.asset.url }]
          : []
      },
      alternates: await metadataAlternates(
        localizedPath(locale, `/${slug}`),
        postType.seo?.canonicalUrl ?? canonical
      ),
      robots: postType.seo?.robots
    }
  }

  if (!page) return {}

  return {
    title: page.seo?.metaTitle ?? page.title,
    description: page.seo?.metaDescription,
    openGraph: {
      title: page.seo?.metaTitle ?? page.title,
      description: page.seo?.metaDescription,
      images: page.seo?.metaImage?.asset?.url
        ? [{ url: page.seo.metaImage.asset.url }]
        : []
    },
    alternates: await metadataAlternates(
      localizedPath(locale, `/${slug}`),
      page.seo?.canonicalUrl ?? canonical
    ),
    robots: page.seo?.robots
  }
}

export default async function Page({ params }: Props) {
  const { locale: localeParam, slug } = await params
  if (!isLocale(localeParam)) notFound()
  const locale: Locale = localeParam

  const [postType, page, homeSlug] = await Promise.all([
    getPostTypeBySlug(slug, locale),
    getPage(slug, locale),
    getHomePageSlug(locale),
  ])

  if (!postType && (slug === homeSlug || slug === 'forside' || slug === 'home')) {
    redirect(localizedPath(locale, '/'))
  }

  const siteUrl = getSiteUrl()
  const url = publicUrl(siteUrl, locale, `/${slug}`)

  if (postType && postType.hasArchive) {
    const posts = await getPostsByType(slug, locale)
    return (
      <>
        <JsonLd
          data={buildCollectionJsonLd({
            title: postType.archiveTitle ?? postType.title,
            description: postType.archiveDescription,
            url,
            siteUrl,
            locale,
            items: posts.map((post: { title: string; slug: string }) => ({
              name: post.title,
              url: publicUrl(siteUrl, locale, `/${slug}/${post.slug}`),
            })),
          })}
        />
        <div className="sr-only">
          <Breadcrumbs items={[{ title: postType.title, slug }]} />
        </div>
        <PostArchive postType={postType} posts={posts} />
      </>
    )
  }

  if (!page) {
    notFound()
  }

  return (
    <>
      <JsonLd
        data={buildPageJsonLd({
          type: page.jsonLdType,
          override: parseJsonLdOverride(page.jsonLdOverride),
          title: page.seo?.metaTitle ?? page.title,
          description: page.seo?.metaDescription,
          url,
          siteUrl,
          locale,
          blocks: page.blocks,
          breadcrumbs: [{ name: page.title, path: localizedPath(locale, `/${slug}`) }],
        })}
      />
      <div className="sr-only">
        <Breadcrumbs items={[{ title: page.title, slug }]} />
      </div>
      <PageRenderer blocks={page.blocks ?? []} />
    </>
  )
}
