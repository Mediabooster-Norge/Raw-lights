import { Metadata } from 'next'
import { getPage } from '@/lib/sanity/fetcher'
import { PageRenderer } from '@/lib/components/blocks/PageRenderer'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

type Props = {
  params: Promise<{ site: string }>
}

const HOMEPAGE_SLUG = 'forside'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params
  const page = await getPage(HOMEPAGE_SLUG, site)

  if (!page) return {}

  const baseUrl = getSiteUrl(site) || 'http://localhost:3000'

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
      canonical: page.seo?.canonicalUrl ?? baseUrl
    },
    robots: page.seo?.robots
  }
}

export default async function HomePage({ params }: Props) {
  const { site } = await params
  const page = await getPage(HOMEPAGE_SLUG, site)

  // Show empty state if no page or no Sanity connection
  if (!page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Velkommen</h1>
          <p className="text-text-secondary">
            Konfigurer Sanity for å komme i gang.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            Sett NEXT_PUBLIC_SANITY_PROJECT_ID i .env.local
          </p>
        </div>
      </div>
    )
  }

  return <PageRenderer blocks={page.blocks ?? []} />
}
