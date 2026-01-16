import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getPageSlugs, getPostTypeBySlug, getPostsByType } from '@/lib/sanity/fetcher'
import { PageRenderer } from '@/lib/components/blocks/PageRenderer'
import { PostArchive } from '@/lib/components/posts/PostArchive'
import { Breadcrumbs } from '@/lib/components/ui/Breadcrumbs'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

type Props = {
  params: Promise<{ site: string; slug: string }>
}

export async function generateStaticParams() {
  const sites = ['landstreff', 'ypsilon', 'julivinterland']
  const allParams: { site: string; slug: string }[] = []

  for (const site of sites) {
    try {
      const slugs = await getPageSlugs(site)
      for (const slug of slugs) {
        if (slug !== 'forside') {
          allParams.push({ site, slug })
        }
      }
    } catch {
      // Skip site if Sanity is not configured
    }
  }

  return allParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, slug } = await params
  
  // First check if it's a post type archive
  const postType = await getPostTypeBySlug(slug, site)
  if (postType && postType.hasArchive) {
    const baseUrl = getSiteUrl(site)
    return {
      title: postType.archiveTitle ?? postType.title,
      description: postType.archiveDescription,
      alternates: {
        canonical: `${baseUrl}/${slug}`
      }
    }
  }
  
  // Otherwise, it's a regular page
  const page = await getPage(slug, site)

  if (!page) return {}

  const baseUrl = getSiteUrl(site)

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
  const { site, slug } = await params
  
  // First check if it's a post type archive
  const postType = await getPostTypeBySlug(slug, site)
  if (postType && postType.hasArchive) {
    const posts = await getPostsByType(slug, site)
    return (
      <>
        {/* Breadcrumbs - visually hidden, accessible for screen readers */}
        <div className="sr-only">
          <Breadcrumbs items={[{ title: postType.title, slug }]} />
        </div>
        <PostArchive postType={postType} posts={posts} />
      </>
    )
  }
  
  // Otherwise, try to get a regular page
  const page = await getPage(slug, site)

  if (!page) {
    notFound()
  }

  return (
    <>
      {/* Breadcrumbs - visually hidden, accessible for screen readers */}
      <div className="sr-only">
        <Breadcrumbs items={[{ title: page.title, slug }]} />
      </div>
      <PageRenderer blocks={page.blocks ?? []} />
    </>
  )
}
