'use client'

/* Sanity's untyped portable document data is narrowed at each block boundary. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react'
import { SanityImage, IMAGE_SIZES } from '@/lib/components/ui/SanityImage'
import { SanityLink } from '@/lib/components/ui/SanityLink'
import { PortableText } from '@/lib/components/ui/PortableText'
import { FormRenderer } from '@/lib/components/forms/FormRenderer'
import { LocaleLink, productPath, useLocale, useSiteCopy } from '@/lib/i18n'
import { formatPostalAddress, mapsEmbedUrl, type PostalAddress } from '@/lib/maps/postalAddress'

type Image = { alt?: string; asset?: { url?: string } }
type Product = { title?: string; slug?: string; sku?: string; excerpt?: string; category?: string; heroImage?: Image; keyStats?: { value?: string; label?: string }[]; features?: { title?: string; text?: string }[] }

const chapters = [
  ['origin', '01'], ['inspiration', '02'], ['carbon', '03'],
  ['range', '04'], ['compass', '05'], ['path', '06'],
] as const

function RawChapters() {
  const [active, setActive] = useState('origin')
  useEffect(() => {
    const update = () => {
      const visible = chapters.findLast(([id]) => {
        const section = document.getElementById(id)
        return section ? section.getBoundingClientRect().top <= innerHeight * .45 : false
      })
      if (visible) setActive(visible[0])
    }
    addEventListener('scroll', update, { passive: true }); update()
    return () => removeEventListener('scroll', update)
  }, [])
  return <nav className="raw-chapters" aria-label="Story chapters">{chapters.map(([id, index]) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''}><span>{index}</span><i /></a>)}</nav>
}

export function RawStoryHero({ data }: { data: { eyebrow?: string; headingLines?: string[]; layout?: 'story' | 'about'; chapter?: string; chapterTitle?: string; aside?: string; showScrollCue?: boolean; showChapters?: boolean; image?: Image; animate?: boolean } }) {
  const isAbout = data.layout === 'about'
  const copy = useSiteCopy()
  return <><section className={`raw-story-hero ${isAbout ? 'raw-story-hero--about' : ''} ${data.animate === false ? 'raw-no-motion' : ''}`} id="origin">
    {data.image && <SanityImage image={data.image} fill priority sizes={IMAGE_SIZES.hero} className="raw-story-hero__image" />}
    <div className="raw-story-hero__shade" />
    {!isAbout && <div className="raw-story-hero__mark" aria-hidden="true"><svg viewBox="0 0 240 120"><path d="M8 112 L72 8 L118 86 L156 28 L232 112 Z" /></svg></div>}
    <div className="raw-shell raw-story-hero__content">
      <div><p className="raw-eyebrow">{data.eyebrow}</p><h1 className="raw-display">{data.headingLines?.map((line) => <span key={line}>{line}</span>)}</h1>{data.showScrollCue !== false && <p className="raw-scroll-cue"><i />{isAbout ? copy.scrollOrigin : copy.scrollStory}</p>}</div>
      {!isAbout && <aside>{data.chapter}<strong>{data.chapterTitle}</strong>{data.aside}</aside>}
    </div>
  </section>{data.showChapters && <RawChapters />}</>
}

export function RawFillStatement({ data }: { data: { eyebrow?: string; heading?: string; text?: string; animate?: boolean } }) {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (data.animate === false || !root.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const update = () => {
      const section = root.current
      if (!section) return
      const max = Math.max(1, section.offsetHeight - innerHeight)
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / max))
      section.style.setProperty('--raw-fill', String(progress))
    }
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update()
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [data.animate])
  return <section ref={root} className={`raw-fill-statement ${data.animate === false ? 'raw-no-motion' : ''}`}><div className="raw-fill-statement__sticky raw-shell"><p className="raw-eyebrow">{data.eyebrow}</p><h2 className="raw-display raw-fill-text"><span>{data.heading}</span><b aria-hidden="true">{data.heading}</b></h2>{data.text && <p className="raw-lede">{data.text}</p>}</div></section>
}

export function RawPinnedStories({ data }: { data: { slides?: { eyebrow?: string; title?: string; text?: string; image?: Image }[]; animate?: boolean } }) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (data.animate === false || !root.current || !track.current || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (track.current) {
        track.current.style.transform = 'none'
      }
      return
    }
    let frame = 0
    const update = () => { frame = 0; const el = root.current; const content = track.current; if (!el || !content) return; const distance = Math.max(0, el.offsetHeight - innerHeight); const progress = distance ? Math.max(0, Math.min(1, -el.getBoundingClientRect().top / distance)) : 0; content.style.setProperty('transform', `translate3d(${-progress * Math.max(0, content.scrollWidth - innerWidth)}px,0,0)`, 'important') }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }; addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); update(); return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [data.animate])
  return <section id="inspiration" ref={root} className={`raw-pinned-stories ${data.animate === false ? 'raw-no-motion' : ''}`}><div className="raw-pinned-stories__sticky"><div className="raw-pinned-stories__track" ref={track}>{data.slides?.map((slide, index) => <article key={`${slide.title}-${index}`} className={`raw-scene raw-scene--${index + 1}`}>{slide.image && <SanityImage image={slide.image} fill sizes="100vw" className="raw-scene__image" />}<div className="raw-scene__shade" /><div className="raw-shell raw-scene__copy"><p className="raw-eyebrow">{slide.eyebrow}</p><h2 className="raw-display">{slide.title}</h2><p className="raw-lede">{slide.text}</p></div></article>)}</div></div></section>
}

export function RawProductSpotlight({ data }: { data: { product?: Product; eyebrow?: string; heading?: string; text?: string; animate?: boolean } }) {
  const product = data.product
  const [illuminated, setIlluminated] = useState(false)
  const locale = useLocale()
  const copy = useSiteCopy()
  if (!product) return null
  const productName = data.heading || product.title?.replace(/["″]$/, '') || copy.productLabel
  return <section id="carbon" className="raw-section raw-carbon"><div className="raw-shell raw-product-spotlight"><button className={`raw-lamp ${illuminated ? 'is-on' : ''}`} type="button" aria-label={`${copy.productViewLabel} ${productName}`} onPointerEnter={() => setIlluminated(true)} onPointerLeave={() => setIlluminated(false)} onClick={() => setIlluminated((value) => !value)}>{product.heroImage && <SanityImage image={product.heroImage} width={840} height={720} sizes="(min-width: 900px) 50vw, 100vw" />}</button><div><p className="raw-eyebrow">{data.eyebrow || copy.productLampFallback}</p><h2 className="raw-display">{productName}</h2><p className="raw-lede">{data.text || product.excerpt}</p><ul className="raw-feature-list">{product.features?.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul><LocaleLink className="raw-button" href={productPath(locale, product.slug || '')}>{copy.productViewLabel} {productName}</LocaleLink></div></div></section>
}

export function RawStats({ data }: { data: { stats?: { value?: string; label?: string }[]; animate?: boolean } }) {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (data.animate === false || !root.current || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (root.current) {
        root.current.querySelectorAll<HTMLElement>('.raw-stat').forEach((stat) => {
          stat.style.setProperty('--raw-stat-fill', '1')
        })
      }
      return
    }
    const update = () => {
      const element = root.current; if (!element) return
      element.querySelectorAll<HTMLElement>('.raw-stat').forEach((stat, index, all) => {
        const mobile = matchMedia('(max-width: 800px)').matches
        const progress = mobile
          ? Math.max(0, Math.min(1, (innerHeight * .78 - stat.getBoundingClientRect().top) / (innerHeight * .32)))
          : Math.max(0, Math.min(1, -element.getBoundingClientRect().top / Math.max(1, element.offsetHeight - innerHeight)))
        const value = mobile ? progress : Math.max(0, Math.min(1, (progress - index / all.length) * all.length))
        stat.style.setProperty('--raw-stat-fill', String(value * value * (3 - 2 * value)))
      })
    }
    addEventListener('scroll', update, { passive: true }); update(); return () => removeEventListener('scroll', update)
  }, [data.animate])
  return <section ref={root} className={`raw-pinned-stats ${data.animate === false ? 'raw-no-motion' : ''}`}><div className="raw-pinned-stats__sticky"><div>{data.stats?.map((stat) => <article className="raw-stat" key={stat.label}><b aria-label={stat.value}><i aria-hidden="true">{stat.value}</i></b><span>{stat.label}</span></article>)}</div></div></section>
}

export function RawBeamSection({ data }: { data: { eyebrow?: string; heading?: string; text?: string; image?: Image } }) {
  return <section className="raw-section"><div className="raw-shell raw-beam"><div><p className="raw-eyebrow">{data.eyebrow}</p><h2 className="raw-display">{data.heading}</h2><p className="raw-lede">{data.text}</p></div>{data.image && <SanityImage image={data.image} width={1000} height={800} sizes="(min-width: 900px) 40vw, 100vw" />}</div></section>
}

export function RawProductFamilies({ data }: { data: { eyebrow?: string; heading?: string; text?: string; items?: { kicker?: string; title?: string; text?: string; image?: Image; link?: any }[] } }) {
  return <><section id="range" className="raw-section raw-range"><div className="raw-shell"><p className="raw-eyebrow">{data.eyebrow}</p><h2 className="raw-display">{data.heading}</h2><p className="raw-lede">{data.text}</p></div></section><section className="raw-families">{data.items?.map((item) => <SanityLink link={item.link} key={item.title} className="raw-family"><p className="raw-kicker">{item.kicker}</p>{item.image && <SanityImage image={item.image} width={960} height={660} sizes="(min-width: 900px) 33vw, 100vw" />}<div><h3>{item.title}</h3><p>{item.text}</p></div></SanityLink>)}</section></>
}

export function RawRules({ data }: { data: { eyebrow?: string; heading?: string; text?: string; items?: { kicker?: string; title?: string; text?: string }[] } }) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const itemCount = data.items?.length || 0
  useEffect(() => {
    if (!root.current || itemCount < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const update = () => {
      const section = root.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (innerHeight * .55 - rect.top) / Math.max(1, rect.height)))
      section.style.setProperty('--raw-rules-fill', String(progress))
      setActive(Math.min(itemCount - 1, Math.floor(progress * itemCount)))
    }
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update()
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [itemCount])
  return <><section id="compass" className="raw-section raw-rules"><div className="raw-shell"><p className="raw-eyebrow">{data.eyebrow}</p><h2 className="raw-display">{data.heading}</h2><p className="raw-lede">{data.text}</p></div></section><section ref={root} className="raw-rules__grid">{data.items?.map((item, index) => <article className={active === index ? 'is-active' : ''} key={item.title}><p className="raw-kicker">{item.kicker}</p><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</section></>
}

export function RawFinale({ data }: { data: { eyebrow?: string; heading?: string; text?: string; primaryCta?: any; secondaryCta?: any } }) {
  return <section id="path" className="raw-finale"><div className="raw-shell"><p className="raw-eyebrow">{data.eyebrow}</p><h2 className="raw-display">{data.heading}</h2><p className="raw-lede">{data.text}</p><div className="raw-actions">{data.primaryCta && <SanityLink link={data.primaryCta} className="raw-button" />}{data.secondaryCta && <SanityLink link={data.secondaryCta} className="raw-button raw-button--ghost" />}</div></div></section>
}

export function RawContactInfo({ data }: { data: { eyebrow?: string; heading?: string; text?: string; phone?: string; email?: string } }) {
  return <section className="raw-section raw-contact-info"><div className="raw-shell"><p className="raw-eyebrow">{data.eyebrow}</p><h1 className="raw-display">{data.heading}</h1><p className="raw-lede">{data.text}</p><div className="raw-contact-info__details">{data.phone && <a href={`tel:${data.phone.replace(/\s/g, '')}`}>{data.phone}</a>}{data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}</div></div></section>
}

export function RawContactForm({ data }: { data: { heading?: string; form?: { _id?: string; submitLabel?: string; successMessage?: string; fields?: any[] } } }) {
  const copy = useSiteCopy()
  if (!data.form?._id) return null
  return <section className="raw-section raw-contact-form"><div className="raw-shell"><p className="raw-eyebrow">{copy.contactEyebrow}</p><h2 className="raw-display">{data.heading}</h2><FormRenderer formId={data.form._id} fields={data.form.fields || []} submitButtonText={data.form.submitLabel} successMessage={data.form.successMessage} /></div></section>
}

export function RawReseller({ data }: { data: { eyebrow?: string; heading?: string; text?: string; cta?: any; address?: PostalAddress } }) {
  const mapUrl = mapsEmbedUrl(data.address)
  const mapQuery = formatPostalAddress(data.address)
  const street = data.address?.streetAddress?.trim()
  const cityLine = [data.address?.postalCode, data.address?.addressLocality].filter((part) => part?.trim()).join(' ')
  return (
    <section id="resellers" className="raw-reseller">
      <div className={mapUrl ? 'raw-shell raw-reseller__layout' : 'raw-shell'}>
        <div className="raw-reseller__copy">
          <p className="raw-eyebrow">{data.eyebrow}</p>
          <h2 className="raw-display">{data.heading}</h2>
          {data.text && <p className="raw-lede">{data.text}</p>}
          {mapQuery && (
            <address className="raw-reseller__address">
              {street && <span>{street}</span>}
              {cityLine && <span>{cityLine}</span>}
            </address>
          )}
          {data.cta && <SanityLink link={data.cta} className="raw-button" />}
        </div>
        {mapUrl && (
          <div className="raw-reseller__map">
            <iframe
              title={mapQuery}
              src={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  )
}

export function RawFaq({ data }: { data: { eyebrow?: string; heading?: string; text?: string; items?: { _key?: string; question?: string; answer?: any }[] } }) {
  if (!data.items?.length) return null
  return <section className="raw-faq"><div className="raw-shell raw-faq__layout"><header><p className="raw-eyebrow">{data.eyebrow}</p><h2 className="raw-display">{data.heading}</h2>{data.text && <p className="raw-lede">{data.text}</p>}</header><div className="raw-faq__list">{data.items.map((item, index) => <details className="raw-faq__item" key={item._key || item.question || index}><summary><span>{item.question}</span><i aria-hidden="true" /></summary><PortableText value={item.answer} className="raw-faq__answer" /></details>)}</div></div></section>
}

export function RawTimeline({ data }: { data: { items?: { index?: string; eyebrow?: string; title?: string; text?: string; image?: Image }[] } }) {
  return <section className="raw-timeline raw-shell">{data.items?.map((item) => <article key={item.title}><div>{item.index && <p className="raw-kicker">{item.index}</p>}<p className="raw-eyebrow">{item.eyebrow}</p><h2 className="raw-display">{item.title}</h2><p className="raw-lede">{item.text}</p></div>{item.image && <SanityImage image={item.image} width={1000} height={700} sizes="(min-width: 900px) 45vw, 100vw" />}</article>)}</section>
}

export function ProductCatalog({ data }: { data: { products?: Product[]; fallbackProducts?: Product[]; showFilters?: boolean } }) {
  const [filter, setFilter] = useState('all')
  const locale = useLocale()
  const copy = useSiteCopy()
  const products = (data.products?.length ? data.products : data.fallbackProducts || []).filter((product) => filter === 'all' || product.category === filter)
  const excerpt = (value?: string) => value && (value.length > 115 ? `${value.slice(0, 112).trimEnd()}…` : value)
  return <section className="raw-catalog-section">{data.showFilters !== false && <div className="raw-filters" role="group" aria-label={copy.catalogFilterLabel}>{[['all', copy.catalogAll], ['driving', copy.catalogDriving], ['work', copy.catalogWork], ['warning', copy.catalogWarning]].map(([value, label]) => <button key={value} className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div>}<div className="raw-catalog">{products.map((product) => <LocaleLink key={product.slug} className="raw-card" href={productPath(locale, product.slug || '')}>{product.heroImage && <SanityImage image={product.heroImage} width={760} height={560} sizes="(min-width: 900px) 33vw, 100vw" />}<p className="raw-kicker">{product.sku}</p><h2>{product.title}</h2><p>{excerpt(product.excerpt)}</p></LocaleLink>)}</div></section>
}
