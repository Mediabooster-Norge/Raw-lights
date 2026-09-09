import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSinglePost, getPostTypeBySlug, getPostSlugsByType, getPostTypeSlugs } from '@/lib/sanity/fetcher'
import { PostSingle } from '@/lib/components/posts/PostSingle'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { isLocale, locales, localizedPath, publicUrl, type Locale } from '@/lib/i18n'
import { metadataAlternates } from '@/lib/i18n/alternates'
import { buildPostJsonLd, imageAssetUrl, parseJsonLdOverride } from '@/lib/seo/buildJsonLd'

type Props = {
  params: Promise<{ locale: string; slug: string; postSlug: string }>
}

export async function generateStaticParams() {
  try {
    const nested = await Promise.all(
      locales.map(async (locale) => {
        const postTypeSlugs = await getPostTypeSlugs(locale)
        const posts = await Promise.all(
          postTypeSlugs.map(async (slug) => {
            const postSlugs = await getPostSlugsByType(slug, locale)
            return postSlugs.map((postSlug) => ({ locale, slug, postSlug }))
          })
        )
        return posts.flat()
      })
    )
    return nested.flat()
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug: postTypeSlug, postSlug } = await params
  if (!isLocale(localeParam)) return {}
  const locale = localeParam

  const [postType, post] = await Promise.all([
    getPostTypeBySlug(postTypeSlug, locale),
    getSinglePost(postTypeSlug, postSlug, locale)
  ])

  if (!postType || !postType.hasSingleView || !post) {
    return {}
  }

  const baseUrl = getSiteUrl()

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      images: (post.seo?.metaImage?.asset?.url || post.featuredImage?.asset?.url)
        ? [{ url: post.seo?.metaImage?.asset?.url || post.featuredImage?.asset?.url }]
        : []
    },
    alternates: await metadataAlternates(
      localizedPath(locale, `/${postTypeSlug}/${postSlug}`),
      post.seo?.canonicalUrl ?? publicUrl(baseUrl, locale, `/${postTypeSlug}/${postSlug}`)
    ),
    robots: post.seo?.robots
  }
}

export default async function PostPage({ params }: Props) {
  const { locale: localeParam, slug: postTypeSlug, postSlug } = await params
  if (!isLocale(localeParam)) notFound()
  const locale: Locale = localeParam

  const [postType, post] = await Promise.all([
    getPostTypeBySlug(postTypeSlug, locale),
    getSinglePost(postTypeSlug, postSlug, locale)
  ])

  if (!postType || !postType.hasSingleView || !post) {
    notFound()
  }

  const siteUrl = getSiteUrl()
  const url = publicUrl(siteUrl, locale, `/${postTypeSlug}/${postSlug}`)

  return (
    <>
      <JsonLd
        data={buildPostJsonLd({
          type: post.postType?.jsonLdType,
          override: parseJsonLdOverride(post.seo?.jsonLd),
          title: post.title,
          description: post.seo?.metaDescription ?? post.excerpt,
          url,
          siteUrl,
          locale,
          imageUrl: imageAssetUrl(post.seo?.metaImage) || imageAssetUrl(post.featuredImage),
          datePublished: post.publishDate,
        })}
      />
      <PostSingle post={post} />
    </>
  )
}
