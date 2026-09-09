import { Metadata } from 'next'
import { getPage } from '@/lib/sanity/fetcher'
import { PageRenderer } from '@/lib/components/blocks/PageRenderer'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'

const HOMEPAGE_SLUG = 'forside'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(HOMEPAGE_SLUG)

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
      canonical: page.seo?.canonicalUrl ?? baseUrl
    },
    robots: page.seo?.robots
  }
}

export default async function HomePage() {
  const page = await getPage(HOMEPAGE_SLUG)

  if (!page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Velkommen</h1>
          <p className="text-text-secondary">
            Opprett en side med slug <code>forside</code> i Studio for å komme i gang.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <JsonLd jsonLd={page.seo?.jsonLd} />
      <PageRenderer blocks={page.blocks ?? []} />
    </>
  )
}
