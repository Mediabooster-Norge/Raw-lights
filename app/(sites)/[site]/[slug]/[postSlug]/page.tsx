import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSinglePost, getPostTypeBySlug, getPostSlugsByType } from '@/lib/sanity/fetcher'
import { PostSingle } from '@/lib/components/posts/PostSingle'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

type Props = {
  params: Promise<{ site: string; slug: string; postSlug: string }>
}

export async function generateStaticParams() {
  // This can be expanded later to pre-generate post pages
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, slug: postTypeSlug, postSlug } = await params
  
  // First check if it's a valid post type
  const postType = await getPostTypeBySlug(postTypeSlug, site)
  if (!postType || !postType.hasSingleView) {
    return {}
  }
  
  const post = await getSinglePost(postTypeSlug, postSlug, site)
  if (!post) return {}

  const baseUrl = getSiteUrl(site)

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
  const { site, slug: postTypeSlug, postSlug } = await params
  
  // Check if it's a valid post type with single view enabled
  const postType = await getPostTypeBySlug(postTypeSlug, site)
  if (!postType || !postType.hasSingleView) {
    notFound()
  }
  
  const post = await getSinglePost(postTypeSlug, postSlug, site)

  if (!post) {
    notFound()
  }

  return <PostSingle post={post} />
}
