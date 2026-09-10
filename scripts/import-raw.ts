/**
 * Idempotently imports the editable RAW reference site into Sanity.
 * Run with SANITY_API_TOKEN set: npx tsx scripts/import-raw.ts
 * RAW_SOURCE_DIR can point at another checkout; it defaults to ../Raw.
 */
/* The importer assembles heterogeneous Sanity documents before validation in Studio. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const rawRoot = resolve(process.env.RAW_SOURCE_DIR || '../Raw')

if (!projectId || !token) throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN before importing.')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })
const assetCache = new Map<string, string>()

function text(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()
}

function match(source: string, expression: RegExp) {
  return text(source.match(expression)?.[1] || '')
}

async function image(relativePath: string, alt = '') {
  const filename = basename(relativePath)
  const cached = assetCache.get(filename)
  if (cached) return { _type: 'image', asset: { _type: 'reference', _ref: cached }, alt }
  const existing = await client.fetch<string | null>('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', { filename })
  const asset = existing ? { _id: existing } : await client.assets.upload('image', createReadStream(resolve(rawRoot, 'assets/images', filename)), { filename })
  assetCache.set(filename, asset._id)
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt }
}

const productFiles = [
  'raw-carbon-9.html', 'raw-duo-work-light-9.html', 'raw-work-light-warning-80w.html', 'raw-solo-work-light-80w.html',
  'raw-led-work-light-45w.html', 'raw-work-light-warning-30w.html', 'raw-novo-work-light-16.html', 'raw-nebula-micro.html', 'raw-nebula-mini.html',
]

async function seedProducts() {
  const products: any[] = []
  for (const filename of productFiles) {
    const html = await readFile(resolve(rawRoot, 'products', filename), 'utf8')
    const title = match(html, /<h1 class="display">([\s\S]*?)<\/h1>/)
    const description = match(html, /<p class="lede">([\s\S]*?)<\/p>/)
    const sku = match(html, /<p class="eyebrow">[^—<]*—\s*([^<]+)<\/p>/)
    const categoryText = match(html, /<p class="eyebrow">([^—<]+)/).toLowerCase()
    const category = categoryText.includes('warning') ? 'warning' : categoryText.includes('work') ? 'work' : 'driving'
    const sourceImage = html.match(/<figure class="pdp-visual">\s*<img src="\.\.\/assets\/images\/([^"]+)"/)?.[1] || 'carbon.jpg'
    const features = [...html.matchAll(/<li><strong>([\s\S]*?)<\/strong><span>([\s\S]*?)<\/span><\/li>/g)].map((item) => ({ _key: `feature-${item.index}`, _type: 'object', title: text(item[1]), text: text(item[2]) }))
    const specifications = [...html.matchAll(/<div class="spec-row"><span>([\s\S]*?)<\/span><b>([\s\S]*?)<\/b><\/div>/g)].map((item) => ({ _key: `spec-${item.index}`, _type: 'object', label: text(item[1]), value: text(item[2]) }))
    const keyStats = [...html.matchAll(/<div class="stat"><b>([\s\S]*?)<\/b><span>([\s\S]*?)<\/span><\/div>/g)].map((item) => ({ _key: `stat-${item.index}`, _type: 'object', value: text(item[1]), label: text(item[2]) }))
    const slug = filename.replace(/\.html$/, '')
    const id = `raw.product.${slug}`
    const product = { _id: id, _type: 'product', language: 'en', title, slug: { _type: 'slug', current: slug }, category, sku, price: match(html, /<p class="pdp-price">([\s\S]*?)<\/p>/), excerpt: description, descriptionHeading: 'Built for Nordic conditions.', heroImage: await image(sourceImage, title), features, specifications, keyStats, primaryCta: { _type: 'link', type: 'internal', label: 'Contact a reseller', internalLink: { _type: 'reference', _ref: 'raw.page.contact', _weak: true } }, secondaryCta: { _type: 'link', type: 'external', label: 'Egil Verne AS', externalUrl: 'https://verne.no', openInNewTab: true }, visibility: 'public', order: products.length, seo: { metaTitle: `${title} — RAW Lights`, metaDescription: description } }
    products.push(product)
  }
  const transaction = client.transaction()
  products.forEach((product, index) => transaction.createOrReplace({ ...product, relatedProducts: products.filter((_, candidate) => candidate !== index).slice(0, 3).map((related) => ({ _type: 'reference', _ref: related._id })) }))
  await transaction.commit()
  return products
}

const reference = (id: string) => ({ _type: 'reference', _ref: id })
const internal = (id: string, label: string) => ({ _type: 'link', type: 'internal', label, internalLink: reference(id) })

async function seedContactForm() {
  await client.createOrReplace({
    _id: 'raw.form.contact',
    _type: 'form',
    language: 'en',
    title: 'Contact',
    submitLabel: 'Send',
    successMessage: 'Thank you for your message.',
    fields: [
      { _key: 'name', _type: 'object', name: 'name', label: 'Name', fieldType: 'text', required: true },
      { _key: 'email', _type: 'object', name: 'email', label: 'Email', fieldType: 'email', required: true },
      { _key: 'subject', _type: 'object', name: 'subject', label: 'Title', fieldType: 'text' },
      { _key: 'message', _type: 'object', name: 'message', label: 'Message', fieldType: 'textarea', required: true },
    ],
  })
}

async function seedPages(products: any[]) {
  const fjord = await image('fjord.webp', 'Norwegian fjord landscape')
  const landscape = await image('landscape.webp', 'Nordic landscape')
  const carbon = await image('carbon.jpg', 'RAW Carbon 9')
  const carbonLifestyle = await image('carbon-lifestyle.jpg', 'RAW Carbon driving light on a vehicle')
  const carbonAlt = await image('carbon-alt.jpg', 'RAW Carbon 9 driving light')
  const carbonSide = await image('carbon-side.jpg', 'RAW Carbon 9 beam pattern reaching 565 meters at 1 lux')
  const pages: any[] = [
    { _id: 'raw.page.home', _type: 'page', language: 'en', title: 'Home', slug: { _type: 'slug', current: 'home' }, visibility: 'public', blocks: [
      { _key: 'hero', _type: 'rawStoryHero', eyebrow: 'RAWlights Group', headingLines: ['Born in Norway.', 'Built for anywhere.'], chapter: 'Chapter 01', chapterTitle: 'Origin', aside: 'Premium driving, working\nand warning lights.', showChapters: true, image: fjord, animate: true },
      { _key: 'marquee', _type: 'marqueeBlock', contentType: 'text', textItems: ['Born in Norway', 'Built for Anywhere', 'Mountains', 'Fjords', 'Northern Lights', 'Carbon 9'].map((value) => ({ _key: value.toLowerCase().replaceAll(' ', '-'), _type: 'object', text: value })), size: 'medium', speed: 'slow', direction: 'left', separator: '/', spacing: 'none' },
      { _key: 'statement', _type: 'rawFillStatement', eyebrow: 'We are RAWlights Group', heading: 'Inspired by the raw beauty and power of Norwegian nature.', text: 'RAWlights designs and develops premium driving lights, working lights, and warning lights inspired by the raw beauty and power of Norwegian nature. Built to endure the harshest Nordic conditions, our products combine innovative technology with rugged durability.', animate: true },
      { _key: 'stories', _type: 'rawPinnedStories', animate: true, slides: [{ _key: 'mountains', _type: 'object', eyebrow: 'Powered by inspiration — 01', title: 'Mountains', text: 'With lines and shapes inspired by Norway’s majestic mountains, this lamp adds a touch of Norwegian soul to your vehicle.', image: fjord }, { _key: 'fjords', _type: 'object', eyebrow: 'Powered by inspiration — 02', title: 'Fjords', text: 'Deep fjords cut sharp lines through the landscape. The compact 9-inch size combines that geometry with practical functionality.', image: landscape }, { _key: 'aurora', _type: 'object', eyebrow: 'Powered by inspiration — 03', title: 'Northern lights', text: 'Dancing northern lights. Dynamic white or amber position light — a signal that moves like the sky it was born under.' }] },
      { _key: 'spotlight', _type: 'rawProductSpotlight', product: reference(products[0]._id), eyebrow: 'The lamp', heading: 'RAW Carbon 9' },
      { _key: 'stats', _type: 'rawStats', animate: true, stats: [{ _key: 'compact', _type: 'object', value: '9"', label: 'Compact driving light' }, { _key: 'lumens', _type: 'object', value: '6 203', label: 'Effective lumens' }, { _key: 'range', _type: 'object', value: '565 m', label: 'Range at 1 lux' }, { _key: 'temperature', _type: 'object', value: '−40°C', label: 'To +65°C operating' }] },
      { _key: 'beam', _type: 'rawBeamSection', eyebrow: 'Long-range beam', heading: '1 lux at 565 meters.', text: 'Crafted from thermal polyamide housing, polycarbonate lens, and stainless steel bracket, it delivers intense, long-range illumination while meeting ECE R10, R148, and R149 for safety and performance in the harshest Nordic winters and beyond.', image: carbonSide },
      { _key: 'families', _type: 'rawProductFamilies', eyebrow: 'The range', heading: 'Driving. Working. Warning.', text: 'Around thirty lamp variants for vehicles and machines — tested for Norwegian conditions, built to illuminate the path ahead.', items: [{ _key: 'driving', _type: 'object', kicker: '01 — Driving', title: 'Carbon 9', text: 'World’s first carbon-inspired driving light. Style with practical functionality.', image: carbonAlt, link: internal(products[0]._id, 'Carbon 9') }, { _key: 'work', _type: 'object', kicker: '02 — Working', title: 'Work lights', text: 'NOVO, SOLO, DUO, TRIO, SAFELITE — flood, compact, and dual-function work lamps.', image: await image('duo-xl.jpg', 'RAW DUO XL work light'), link: internal('raw.page.products', 'Work lights') }, { _key: 'warning', _type: 'object', kicker: '03 — Warning', title: 'Nebula', text: 'Magnetic warning bars engineered for instant safety and road-legal signaling.', image: await image('nebula.jpg', 'RAW NEBULA warning light bar'), link: internal(products[7]._id, 'Nebula') }] },
      { _key: 'rules', _type: 'rawRules', eyebrow: 'Team Rules', heading: 'Our Nordic Compass', text: 'Four rules that shape every lamp we put on the road.', items: [{ _key: 'rule-1', _type: 'object', kicker: 'Team Rule (No. 01)', title: 'Embrace the Wild', text: 'We draw inspiration from the rugged beauty of Norwegian nature. Team members are encouraged to think boldly, explore creative solutions, and approach challenges with the resilience of the Nordic landscape.' }, { _key: 'rule-2', _type: 'object', kicker: 'Team Rule (No. 02)', title: 'Build with Purpose', text: 'Every product, idea, and action should reflect our commitment to quality and durability. We work with intention, ensuring our lights meet the highest standards for adventurers and professionals in extreme conditions.' }, { _key: 'rule-3', _type: 'object', kicker: 'Team Rule (No. 03)', title: 'Illuminate Together', text: 'Collaboration lights the way. We share knowledge, support one another, and combine our strengths to create innovative solutions that shine in even the toughest environments.' }, { _key: 'rule-4', _type: 'object', kicker: 'Team Rule (No. 04)', title: 'Own the Outcome', text: 'We take pride in our work and accountability for our results. Like our lights built to withstand harsh Nordic conditions, we stand by our commitments and deliver excellence every time.' }] },
      { _key: 'finale', _type: 'rawFinale', eyebrow: 'Wherever your journey takes you', heading: 'Illuminate the path ahead.', text: 'At RAWlights, we are driven by a passion for quality, reliability, and illuminating the path ahead.', primaryCta: internal('raw.page.products', 'See products'), secondaryCta: internal('raw.page.contact', 'Get in touch') },
    ] },
    { _id: 'raw.page.products', _type: 'page', language: 'en', title: 'Products', slug: { _type: 'slug', current: 'products' }, visibility: 'public', blocks: [{ _key: 'hero', _type: 'rawStoryHero', eyebrow: 'The catalog', headingLines: ['Lights for the road,', 'the site, and the dark.'], chapter: 'RAW', chapterTitle: 'Products', aside: 'Built for Norway.', image: landscape, animate: true }, { _key: 'catalog', _type: 'productCatalogBlock', showFilters: true }] },
    { _id: 'raw.page.about', _type: 'page', language: 'en', title: 'About', slug: { _type: 'slug', current: 'about' }, visibility: 'public', blocks: [
      { _key: 'hero', _type: 'rawStoryHero', layout: 'about', eyebrow: 'About Us', headingLines: ['We are', 'RAWlights Group.'], image: fjord, animate: true },
      { _key: 'country', _type: 'rawFillStatement', eyebrow: 'Chapter 01 — The country', heading: 'Born in Norway.', text: 'RAWlights designs and develops premium driving lights, working lights, and warning lights inspired by the raw beauty and power of Norwegian nature. Built to endure the harshest Nordic conditions, our products combine innovative technology with rugged durability.', animate: true },
      { _key: 'timeline', _type: 'rawTimeline', items: [
        { _key: 'wild', _type: 'object', index: '01', eyebrow: 'The wild', title: 'The raw beauty and power of Norwegian nature.', text: 'With lines and shapes inspired by Norway’s majestic mountains, deep fjords, and dancing northern lights.', image: landscape },
        { _key: 'work', _type: 'object', index: '02', eyebrow: 'The work', title: 'Driving. Working. Warning.', text: 'RAWlights designs and develops premium driving lights, working lights, and warning lights for vehicles and machines — tested for Norwegian conditions.', image: carbonLifestyle },
        { _key: 'path', _type: 'object', index: '03', eyebrow: 'The path', title: 'Illuminate the path ahead.', text: 'We are driven by a passion for quality, reliability, and illuminating the path ahead — wherever your journey takes you.', image: carbon },
      ] },
      { _key: 'promise', _type: 'rawFillStatement', eyebrow: 'Chapter 02 — The promise', heading: 'Built for anywhere.', text: 'Built to endure the harshest Nordic conditions, our products combine innovative technology with rugged durability to deliver unmatched performance for adventurers, professionals, and safety-conscious drivers.', animate: true },
      { _key: 'rules', _type: 'rawRules', eyebrow: 'Team Rules', heading: 'Our Nordic Compass', text: 'Four rules that shape every lamp we put on the road.', items: [
        { _key: 'about-rule-1', _type: 'object', kicker: 'Team Rule (No. 01)', title: 'Embrace the Wild', text: 'We draw inspiration from the rugged beauty of Norwegian nature. Team members are encouraged to think boldly, explore creative solutions, and approach challenges with the resilience of the Nordic landscape.' },
        { _key: 'about-rule-2', _type: 'object', kicker: 'Team Rule (No. 02)', title: 'Build with Purpose', text: 'Every product, idea, and action should reflect our commitment to quality and durability. We work with intention, ensuring our lights meet the highest standards for adventurers and professionals in extreme conditions.' },
        { _key: 'about-rule-3', _type: 'object', kicker: 'Team Rule (No. 03)', title: 'Illuminate Together', text: 'Collaboration lights the way. We share knowledge, support one another, and combine our strengths to create innovative solutions that shine in even the toughest environments.' },
        { _key: 'about-rule-4', _type: 'object', kicker: 'Team Rule (No. 04)', title: 'Own the Outcome', text: 'We take pride in our work and accountability for our results. Like our lights built to withstand harsh Nordic conditions, we stand by our commitments and deliver excellence every time.' },
      ] },
      { _key: 'finale', _type: 'rawFinale', eyebrow: 'Want to become a reseller?', heading: 'Get in touch with us.', primaryCta: internal('raw.page.contact', 'Contact'), secondaryCta: { _type: 'link', type: 'external', label: 'Egil Verne AS', externalUrl: 'https://verne.no', openInNewTab: true } },
    ] },
    { _id: 'raw.page.contact', _type: 'page', language: 'en', title: 'Contact', slug: { _type: 'slug', current: 'contact' }, visibility: 'public', blocks: [
      { _key: 'hero', _type: 'rawStoryHero', eyebrow: 'Contact', headingLines: ['Get in touch', 'with us.'], chapter: 'RAW', chapterTitle: 'Contact', aside: 'Born in Norway.', image: fjord, animate: true },
      { _key: 'intro', _type: 'rawContactInfo', eyebrow: 'RAWlights Group', heading: 'Light the way with us.', text: 'RAWlights designs and develops premium driving, working, and warning lights for demanding Nordic conditions.', phone: '+47 22 30 68 00', email: 'contact@rawlightsgroup.com' },
      { _key: 'form', _type: 'rawContactForm', heading: 'Send a message.', form: reference('raw.form.contact') },
      { _key: 'reseller', _type: 'rawReseller', eyebrow: 'Norwegian reseller', heading: 'Egil Verne AS.', text: 'For product advice, availability, and local support, visit our Norwegian reseller.', cta: { _type: 'link', type: 'external', label: 'Visit Verne', externalUrl: 'https://verne.no', openInNewTab: true } },
    ] },
  ]
  const transaction = client.transaction()
  pages.forEach((page) => transaction.createOrReplace(page))
  await transaction.commit()
  return pages
}

async function main() {
  const products = await seedProducts()
  await seedContactForm()
  const pages = await seedPages(products)
  const logo = await image('logo-raw.webp', 'RAW Lights')
  await client.transaction()
    .createOrReplace({ _id: 'globalSettings', _type: 'globalSettings', siteName: 'RAW Lights', homePage: reference('raw.page.home'), siteTheme: { logo, colors: { primary: { hex: '#c6e000' }, background: { hex: '#07080a' }, textPrimary: { hex: '#f3efe4' } }, typography: { headingFont: 'Syne', bodyFont: 'Outfit' } }, seo: { metaTitle: 'RAW Lights', metaDescription: 'Born in Norway, built for anywhere.', metaImage: logo } })
    .createOrReplace({ _id: 'raw.navigation.en', _type: 'navigation', language: 'en', mainNav: [{ _key: 'home', _type: 'object', label: 'Home', link: internal('raw.page.home', 'Home') }, { _key: 'about', _type: 'object', label: 'About', link: internal('raw.page.about', 'About') }, { _key: 'products', _type: 'object', label: 'Products', link: internal('raw.page.products', 'Products') }, { _key: 'resellers', _type: 'object', label: 'Resellers', link: internal('raw.page.contact', 'Resellers') }], headerCta: { link: internal('raw.page.contact', 'Contact') }, footerNav: [{ _key: 'contact', _type: 'object', links: [internal('raw.page.contact', 'Get in touch')] }], socialLinks: [{ _key: 'instagram', _type: 'object', platform: 'instagram', url: 'https://www.instagram.com/rawlightsnorway/' }] })
    .commit()
  console.log(`Imported ${products.length} products and ${pages.length} pages into ${projectId}/${dataset}.`)
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
