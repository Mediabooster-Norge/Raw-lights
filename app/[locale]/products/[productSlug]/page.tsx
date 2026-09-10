import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductPage } from '@/lib/components/products/ProductPage'
import { getProductBySlug, getProductSlugs } from '@/lib/sanity/fetcher'
import { isLocale, locales, publicUrl, type Locale } from '@/lib/i18n'
import { getSiteUrl } from '@/lib/utils/getSiteUrl'
import { socialMetadata } from '@/lib/seo/socialMetadata'
import { JsonLd } from '@/lib/components/seo/JsonLd'
import { buildProductJsonLd } from '@/lib/seo/buildJsonLd'

type Props = { params: Promise<{ locale: string; productSlug: string }> }

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (locale) => (await getProductSlugs(locale)).map((productSlug) => ({ locale, productSlug }))))
  return all.flat()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, productSlug } = await params
  if (!isLocale(localeParam)) return {}
  const product = await getProductBySlug(productSlug, localeParam)
  if (!product) return {}
  const url = publicUrl(getSiteUrl(), localeParam, `/products/${productSlug}`)
  const title = product.seo?.metaTitle ?? product.title
  const description = product.seo?.metaDescription ?? product.excerpt
  return { title, description, ...socialMetadata({ title, description, imageUrl: product.seo?.metaImage?.asset?.url ?? product.heroImage?.asset?.url, locale: localeParam, url }) }
}

export default async function ProductRoute({ params }: Props) {
  const { locale: localeParam, productSlug } = await params
  if (!isLocale(localeParam)) notFound()
  const product = await getProductBySlug(productSlug, localeParam as Locale)
  if (!product) notFound()
  const url = publicUrl(getSiteUrl(), localeParam as Locale, `/products/${productSlug}`)
  return <>
    <JsonLd data={buildProductJsonLd({ title: product.title, description: product.seo?.metaDescription ?? product.excerpt, url, siteUrl: getSiteUrl(), locale: localeParam, imageUrl: product.heroImage?.asset?.url, sku: product.sku, price: product.price })} />
    <ProductPage product={product} />
  </>
}
