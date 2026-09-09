import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getPageSlugs, getPostTypeBySlug, getPostsByType, getPostTypeSlugs } from '@/lib/sanity/fetcher'
import { PageRenderer } from '@/lib/components/blocks/PageRenderer'
import { PostArchive } from '@/lib/components/posts/PostArchive'
import { Breadcrumbs } from '@/lib/components/ui/Breadcrumbs'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const [pageSlugs, postTypeSlugs] = await Promise.all([
      getPageSlugs(),
      getPostTypeSlugs()
    ])

    const slugs = new Set<string>([
      ...pageSlugs.filter((slug) => slug && slug !== 'forside'),
      ...postTypeSlugs
    ])

    return Array.from(slugs).map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [postType, page] = await Promise.all([
    getPostTypeBySlug(slug),
    getPage(slug)
  ])

  if (postType && postType.hasArchive) {
    const baseUrl = getSiteUrl()
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
      alternates: {
        canonical: postType.seo?.canonicalUrl ?? `${baseUrl}/${slug}`
      },
      robots: postType.seo?.robots
    }
  }

  if (!page) return {}

  const baseUrl = getSiteUrl()

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
    alternates: {
      canonical: page.seo?.canonicalUrl ?? `${baseUrl}/${slug}`
    },
    robots: page.seo?.robots
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [postType, page] = await Promise.all([
    getPostTypeBySlug(slug),
    getPage(slug)
  ])

  if (postType && postType.hasArchive) {
    const posts = await getPostsByType(slug)
    return (
      <>
        <JsonLd jsonLd={postType.seo?.jsonLd} />
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
      <JsonLd jsonLd={page.seo?.jsonLd} />
      <div className="sr-only">
        <Breadcrumbs items={[{ title: page.title, slug }]} />
      </div>
      <PageRenderer blocks={page.blocks ?? []} />
    </>
  )
}
