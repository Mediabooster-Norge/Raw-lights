/**
 * Imports the six products present in the original WordPress catalogue but
 * absent from Sanity. It deliberately creates the Norwegian published product,
 * the English published translation, and their translation metadata together.
 *
 * Run a preview first:
 *   set -a; source .env.local; set +a; npx tsx scripts/import-missing-products.ts
 *
 * Apply only after reviewing the preview:
 *   set -a; source .env.local; set +a; CONFIRM_MISSING_PRODUCTS=rawlights-products npx tsx scripts/import-missing-products.ts --apply
 */
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN must be set.')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false, perspective: 'raw' })

type Feature = { title: string; text: string }
type ProductDefinition = {
  sourceSlug: string
  slug: string
  title: string
  order: number
  keyStats: { value: string; label: string; labelNb: string }[]
  norwegian: { excerpt: string; features: Feature[] }
}

const products: ProductDefinition[] = [
  {
    sourceSlug: 'raw-novo-work-light-9', slug: 'raw-novo-work-light-9', title: 'RAW NOVO Work Light 9″', order: 9,
    keyStats: [
      { value: '54W', label: 'Power', labelNb: 'Effekt' },
      { value: '3 600 lm', label: 'Effective lumens', labelNb: 'Effektive lumen' },
      { value: 'IP67', label: 'IP rating', labelNb: 'IP-grad' },
      { value: '10–32V', label: 'Voltage', labelNb: 'Spenning' },
    ],
    norwegian: {
      excerpt: 'Kraftig 54W LED-arbeidslys med 3 600 effektive lumen, bredt flomlys og IP67-beskyttelse for krevende arbeidsområder.',
      features: [
        { title: 'Kraftig flomlys', text: '54W LED-arbeidslys med 3 600 effektive lumen for bred og jevn belysning.' },
        { title: 'Robust konstruksjon', text: 'Støpt aluminiumshus med IP67-beskyttelse mot støv og vann.' },
        { title: 'Fleksibel spenning', text: 'Kompatibelt med 10–32V DC-systemer.' },
        { title: 'Enkel montering', text: 'DT-kontakt og rustfritt feste gir sikker installasjon.' },
      ],
    },
  },
  {
    sourceSlug: 'raw-novo-work-light-4', slug: 'raw-novo-work-light-4', title: 'RAW NOVO Work Light 4″', order: 10,
    keyStats: [
      { value: '24W', label: 'Power', labelNb: 'Effekt' },
      { value: '2 200 lm', label: 'Effective lumens', labelNb: 'Effektive lumen' },
      { value: 'IP67', label: 'IP rating', labelNb: 'IP-grad' },
      { value: '10–32V', label: 'Voltage', labelNb: 'Spenning' },
    ],
    norwegian: {
      excerpt: 'Kompakt 75 mm LED-arbeidslys med 2 200 effektive lumen. Skapt for trange installasjoner der driftssikkerhet er avgjørende.',
      features: [
        { title: 'Kompakt flomlys', text: '3 520 teoretiske og 2 200 effektive lumen i et bredt flomlysmønster.' },
        { title: 'Liten og robust', text: '75 × 75 × 50 mm, kun 0,5 kg og IP67-beskyttet.' },
        { title: 'Effektiv drift', text: '24W, 2A ved 12V og fleksibelt spenningsområde på 10–32V.' },
        { title: 'Klar for krevende forhold', text: 'Drift fra −40°C til +60°C og ECE R10-godkjenning.' },
      ],
    },
  },
  {
    sourceSlug: 'raw-work-light-warning-45w', slug: 'raw-work-light-warning-45w', title: 'RAW SOLO Work Light w/ Warning Light 45W', order: 11,
    keyStats: [
      { value: '45W', label: 'Power', labelNb: 'Effekt' },
      { value: '4 032 lm', label: 'Effective lumens', labelNb: 'Effektive lumen' },
      { value: 'IP68/69K', label: 'IP rating', labelNb: 'IP-grad' },
      { value: '12–48V', label: 'Voltage', labelNb: 'Spenning' },
    ],
    norwegian: {
      excerpt: 'Kompakt 45W arbeidslys med varsellys, 4 032 effektive lumen og IP68/69K-beskyttelse for profesjonelt arbeid i krevende forhold.',
      features: [
        { title: 'Bred arbeidsbelysning', text: '5 220 teoretiske og 4 032 effektive lumen fra ni Osram LED-er.' },
        { title: 'Kompakt og lett', text: '102 × 102 × 62 mm og 0,77 kg for diskré montering med M10-bolt.' },
        { title: 'Ekstremt godt beskyttet', text: 'IP68/69K for nedsenking, høytrykksspyling og temperaturer fra −40°C til +60°C.' },
        { title: 'Klar for vei og arbeid', text: '12–48V, DT-kontakter og ECE R10, R7 og R23-godkjenning.' },
      ],
    },
  },
  {
    sourceSlug: 'raw-led-work-light-80w', slug: 'raw-led-work-light-80w', title: 'RAW TRIO XL Work Light 80W', order: 12,
    keyStats: [
      { value: '80W', label: 'Power', labelNb: 'Effekt' },
      { value: '6 146 lm', label: 'Effective lumens', labelNb: 'Effektive lumen' },
      { value: 'IP68/69K', label: 'IP rating', labelNb: 'IP-grad' },
      { value: '12–48V', label: 'Voltage', labelNb: 'Spenning' },
    ],
    norwegian: {
      excerpt: 'Kraftig 80W arbeidslys med integrert posisjonslys, 6 146 effektive lumen og robust IP68/69K-kapsling.',
      features: [
        { title: 'Arbeidslys og posisjonslys', text: '9 280 teoretiske og 6 146 effektive lumen med valgbart rødt, hvitt eller gult posisjonslys.' },
        { title: 'Kompakt arbeidskraft', text: '114 × 112 × 75 mm, 1,1 kg og M10-feste for kjøretøy og maskiner.' },
        { title: 'Tåler tøffe forhold', text: 'IP68/69K og stabil drift fra −40°C til +60°C.' },
        { title: 'Fleksibel tilkobling', text: '12–48V og tre separate DT-kontakter for lys og posisjonslys.' },
      ],
    },
  },
  {
    sourceSlug: 'raw-novo-pro-no-6-led', slug: 'raw-novo-pro-no-6-led', title: 'RAW NOVO PRO 6-LED', order: 13,
    keyStats: [
      { value: '6 LED', label: 'LEDs', labelNb: 'LED-er' },
      { value: '75 m', label: 'Range at 1 lux', labelNb: 'Rekkevidde ved 1 lux' },
      { value: 'IP67', label: 'IP rating', labelNb: 'IP-grad' },
      { value: '5 000K', label: 'Colour temperature', labelNb: 'Fargetemperatur' },
    ],
    norwegian: {
      excerpt: 'Robust og kompakt 6-LED arbeidslampe med bredt flomlys, slitesterkt aluminiumshus og klar 5 000K-belysning.',
      features: [
        { title: 'Bredt flomlysmønster', text: 'God områdedekning med 1 lux ved 75 meter.' },
        { title: 'Kompakt og slitesterk', text: '106 × 99 × 70 mm, 1,05 kg og IP67-beskyttelse.' },
        { title: 'For nordiske forhold', text: 'Stabil drift fra −40°C til +60°C.' },
        { title: 'Enkel installasjon', text: 'DT-kontakt med 0,5 m kabel og ECE R10-godkjenning.' },
      ],
    },
  },
  {
    sourceSlug: '66444', slug: 'raw-novo-pro-no-glare', title: 'RAW NOVO PRO NO-GLARE', order: 14,
    keyStats: [
      { value: '60W', label: 'Power', labelNb: 'Effekt' },
      { value: '3 200 lm', label: 'Effective lumens', labelNb: 'Effektive lumen' },
      { value: 'IP67', label: 'IP rating', labelNb: 'IP-grad' },
      { value: '10–32V', label: 'Voltage', labelNb: 'Spenning' },
    ],
    norwegian: {
      excerpt: 'Kraftig 60W arbeidslys med asymmetrisk, blendingsfri lysfordeling. Gir 3 200 effektive lumen og pålitelig drift i krevende miljøer.',
      features: [
        { title: 'Blendingsfri teknologi', text: 'Asymmetrisk flomlysmønster med skarp avgrensning som reduserer blending.' },
        { title: 'Kompakt og solid', text: '106 × 99 × 70 mm, 1,05 kg og IP67-beskyttelse mot støv og vann.' },
        { title: 'Effektiv drift', text: '60W med 10–32V spenningsområde og 3,6A ved 12V.' },
        { title: 'Klar for arbeid', text: 'DT-kontakt, 0,5 m kabel og ECE R10-godkjenning.' },
      ],
    },
  },
]

type WordPressProduct = {
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  link: string
  _embedded?: { 'wp:featuredmedia'?: { source_url?: string }[] }
}

function plainText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:8243|x2033);/gi, '″')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function englishFeatures(html: string): Feature[] {
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((match) => {
    const item = match[1]
    const heading = item.match(/<strong>([\s\S]*?)<\/strong>/i)?.[1] || 'Feature'
    const remainder = item.replace(/<strong>[\s\S]*?<\/strong>/i, '').replace(/^\s*:\s*/, '')
    return { title: plainText(heading), text: plainText(remainder) }
  }).filter((feature) => feature.text)
}

function keyStats(definition: ProductDefinition, locale: 'en' | 'nb') {
  return definition.keyStats.map((stat, index) => ({
    _key: `stat-${index + 1}`,
    _type: 'object',
    value: stat.value,
    label: locale === 'nb' ? stat.labelNb : stat.label,
  }))
}

function featureObjects(features: Feature[]) {
  return features.map((feature, index) => ({ _key: `feature-${index + 1}`, _type: 'object', ...feature }))
}

async function fetchWordPressProduct(sourceSlug: string) {
  const url = new URL('https://www.rawlightsgroup.com/wp-json/wp/v2/product')
  url.searchParams.set('slug', sourceSlug)
  url.searchParams.set('_embed', '1')
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load ${sourceSlug} from WordPress (${response.status}).`)
  const products = await response.json() as WordPressProduct[]
  const product = products[0]
  if (!product) throw new Error(`WordPress product ${sourceSlug} was not found.`)
  const imageUrl = product._embedded?.['wp:featuredmedia']?.[0]?.source_url
  if (!imageUrl) throw new Error(`WordPress product ${sourceSlug} has no featured image.`)
  return { product, imageUrl }
}

async function uploadImage(sourceSlug: string, imageUrl: string, alt: string) {
  const filename = `wordpress-${sourceSlug}.jpg`
  const existing = await client.fetch<string | null>('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', { filename })
  if (existing) return { _type: 'image', asset: { _type: 'reference', _ref: existing }, alt }

  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`Could not download image for ${sourceSlug} (${response.status}).`)
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), { filename })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt }
}

function relatedProducts(locale: 'en' | 'nb') {
  const prefix = locale === 'en' ? 'i18n.en.' : ''
  return ['raw-carbon-9', 'raw-duo-work-light-9', 'raw-work-light-warning-80w'].map((slug, index) => ({
    _key: `related-${index + 1}`,
    _type: 'reference',
    _ref: `${prefix}raw.product.${slug}`,
    _weak: true,
  }))
}

async function main() {
  const apply = process.argv.includes('--apply')
  if (apply && process.env.CONFIRM_MISSING_PRODUCTS !== 'rawlights-products') {
    throw new Error('Writing is locked. Set CONFIRM_MISSING_PRODUCTS=rawlights-products to apply the import.')
  }

  const ids = products.flatMap(({ slug }) => [
    `raw.product.${slug}`,
    `i18n.en.raw.product.${slug}`,
    `translation.metadata.raw.product.${slug}`,
  ])
  const existing = await client.fetch<{ _id: string }[]>('*[_id in $ids]{_id}', { ids })
  if (existing.length) throw new Error(`Import stopped to avoid duplicates: ${existing.map(({ _id }) => _id).join(', ')}`)

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    productCount: products.length,
    products: products.map(({ title, sourceSlug, slug }) => ({ title, sourceSlug, slug })),
  }, null, 2))
  if (!apply) return

  const prepared = await Promise.all(products.map(async (definition) => {
    const { product, imageUrl } = await fetchWordPressProduct(definition.sourceSlug)
    const title = definition.title || plainText(product.title.rendered)
    const englishExcerpt = plainText(product.excerpt.rendered)
    const englishFeatureList = englishFeatures(product.content.rendered)
    const heroImage = await uploadImage(definition.sourceSlug, imageUrl, title)
    const base = {
      _type: 'product',
      title,
      slug: { _type: 'slug', current: definition.slug },
      category: 'work',
      heroImage,
      visibility: 'public',
      order: definition.order,
      secondaryCta: { _type: 'link', type: 'external', label: 'Egil Verne AS', externalUrl: 'https://verne.no', openInNewTab: true },
    }
    return {
      nb: {
        ...base,
        _id: `raw.product.${definition.slug}`,
        language: 'nb',
        excerpt: definition.norwegian.excerpt,
        descriptionHeading: 'Bygget for nordiske forhold.',
        features: featureObjects(definition.norwegian.features),
        keyStats: keyStats(definition, 'nb'),
        primaryCta: { _type: 'link', type: 'internal', label: 'Kontakt en forhandler', internalLink: { _type: 'reference', _ref: 'raw.page.contact', _weak: true } },
        relatedProducts: relatedProducts('nb'),
        seo: { metaTitle: `${title} | RAW Lights`, metaDescription: definition.norwegian.excerpt },
      },
      en: {
        ...base,
        _id: `i18n.en.raw.product.${definition.slug}`,
        language: 'en',
        excerpt: englishExcerpt,
        descriptionHeading: 'Built for Nordic conditions.',
        features: featureObjects(englishFeatureList),
        keyStats: keyStats(definition, 'en'),
        primaryCta: { _type: 'link', type: 'internal', label: 'Contact a reseller', internalLink: { _type: 'reference', _ref: 'i18n.en.raw.page.contact', _weak: true } },
        relatedProducts: relatedProducts('en'),
        seo: { metaTitle: `${title} | RAW Lights`, metaDescription: englishExcerpt },
      },
    }
  }))

  let transaction = client.transaction()
  for (const pair of prepared) {
    transaction = transaction.create(pair.nb).create(pair.en).create({
      _id: `translation.metadata.${pair.nb._id.replace(/[^a-zA-Z0-9_.-]/g, '-')}`,
      _type: 'translation.metadata',
      translations: [
        { _key: 'nb', language: 'nb', value: { _type: 'reference', _ref: pair.nb._id, _weak: true } },
        { _key: 'en', language: 'en', value: { _type: 'reference', _ref: pair.en._id, _weak: true } },
      ],
    })
  }

  // WordPress gave this item a numeric slug. Keep it as a legacy redirect while
  // using a readable product URL on the new site.
  transaction = transaction.createOrReplace({
    _id: 'raw.redirect.product-66444',
    _type: 'redirect',
    source: '/product/66444',
    destination: '/produkter/raw-novo-pro-no-glare',
    permanent: true,
  })
  await transaction.commit()
  console.log(JSON.stringify({ imported: prepared.length, languages: ['nb', 'en'], redirect: '/product/66444 → /produkter/raw-novo-pro-no-glare' }, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
