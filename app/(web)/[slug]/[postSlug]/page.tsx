import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSinglePost, getPostTypeBySlug, getPostSlugsByType, getPostTypeSlugs } from '@/lib/sanity/fetcher'
import { PostSingle } from '@/lib/components/posts/PostSingle'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

type Props = {
  params: Promise<{ slug: string; postSlug: string }>
}

export async function generateStaticParams() {
  try {
    const postTypeSlugs = await getPostTypeSlugs()
    const nested = await Promise.all(
      postTypeSlugs.map(async (slug) => {
        const postSlugs = await getPostSlugsByType(slug)
        return postSlugs.map((postSlug) => ({ slug, postSlug }))
      })
    )
    return nested.flat()
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: postTypeSlug, postSlug } = await params

  const [postType, post] = await Promise.all([
    getPostTypeBySlug(postTypeSlug),
    getSinglePost(postTypeSlug, postSlug)
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
    alternates: {
      canonical: post.seo?.canonicalUrl ?? `${baseUrl}/${postTypeSlug}/${postSlug}`
    },
    robots: post.seo?.robots
  }
}

export default async function PostPage({ params }: Props) {
  const { slug: postTypeSlug, postSlug } = await params

  const [postType, post] = await Promise.all([
    getPostTypeBySlug(postTypeSlug),
    getSinglePost(postTypeSlug, postSlug)
  ])

  if (!postType || !postType.hasSingleView || !post) {
    notFound()
  }

  return (
    <>
      <JsonLd jsonLd={post.seo?.jsonLd} />
      <PostSingle post={post} />
    </>
  )
}
