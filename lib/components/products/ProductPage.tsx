'use client'

/* Product records are projected Sanity documents. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SanityImage } from '@/lib/components/ui/SanityImage'
import { SanityLink } from '@/lib/components/ui/SanityLink'
import { LocaleLink, productPath, productsPath, useLocale, useSiteCopy } from '@/lib/i18n'

type ProductPageProps = { product: any }

export function ProductPage({ product }: ProductPageProps) {
  const locale = useLocale()
  const copy = useSiteCopy()
  const title = String(product.title || '').replace(/["″]$/, '')
  const titleWords = title.split(' ')
  const accentTitle = titleWords.slice(0, 2).join(' ')
  const titleRest = titleWords.slice(2).join(' ')
  return <>
    <section className="raw-product-hero">
      <figure className="raw-pdp-visual">{product.heroImage && <SanityImage image={product.heroImage} width={1200} height={960} sizes="(min-width: 900px) 50vw, 100vw" priority />}</figure>
      <div className="raw-pdp-copy">
        <nav className="raw-breadcrumb" aria-label="Breadcrumb"><LocaleLink href={productsPath(locale)}>{copy.productBreadcrumb}</LocaleLink><span>/</span><span>{product.category} {copy.productCategorySuffix}</span></nav>
        <p className="raw-eyebrow">{product.category} {copy.productCategorySuffix} {product.sku && `— ${product.sku}`}</p>
        <h1 className="raw-display"><em>{accentTitle}</em>{titleRest && ` ${titleRest}`}</h1>
        {product.price && <p className="raw-product-price">{product.price}</p>}
        <p className="raw-lede">{product.excerpt}</p>
        <div className="raw-actions">
          {product.primaryCta && <SanityLink link={product.primaryCta} className="raw-button" />}
          {product.secondaryCta && <SanityLink link={product.secondaryCta} className="raw-button raw-button--ghost" />}
        </div>
      </div>
    </section>
    {product.keyStats?.length > 0 && <section className="raw-product-stats" aria-label={copy.productKeySpecifications}>{product.keyStats.map((stat: any) => <article key={stat.label}><b>{stat.value}</b><span>{stat.label}</span></article>)}</section>}
    <section className="raw-section"><div className="raw-shell raw-product-body"><div><p className="raw-eyebrow">{copy.productDescription}</p><h2 className="raw-display">{product.descriptionHeading}</h2></div><ul className="raw-feature-list">{product.features?.map((feature: any) => <li key={feature.title}><strong>{feature.title}</strong><span>{feature.text}</span></li>)}</ul></div></section>
    {product.specifications?.length > 0 && <section className="raw-section"><div className="raw-shell raw-specifications"><p className="raw-eyebrow">{copy.productInformation}</p><h2 className="raw-display">{copy.productSpecifications}</h2><div className="raw-spec-table">{product.specifications.map((specification: any) => <p className="raw-spec-row" key={specification.label}><span>{specification.label}</span><b>{specification.value}</b></p>)}</div></div></section>}
    {product.relatedProducts?.length > 0 && <section className="raw-related"><div className="raw-section"><div className="raw-shell"><p className="raw-eyebrow">{copy.productRelatedEyebrow}</p><h2 className="raw-display">{copy.productRelatedHeading}</h2></div></div><div className="raw-catalog">{product.relatedProducts.map((related: any) => <LocaleLink key={related._id} className="raw-card" href={productPath(locale, related.slug)}>{related.heroImage && <SanityImage image={related.heroImage} width={760} height={560} sizes="(min-width: 900px) 33vw, 100vw" />}<p className="raw-kicker">{related.sku}</p><h3>{related.title}</h3><p>{related.excerpt}</p></LocaleLink>)}</div></section>}
  </>
}
