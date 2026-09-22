import { createClient } from '@sanity/client'

type Seo = {
  metaTitle?: string
  metaDescription?: string
  metaImage?: unknown
  canonicalUrl?: string
  robots?: string
}

type GlobalSettings = {
  _id: string
  seo?: Seo
  seoNb?: Seo
  seoEn?: Seo
}

const apply = process.argv.includes('--apply')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function norwegianSeo(seo: Seo): Seo {
  return {
    ...seo,
    metaDescription: seo.metaDescription === 'Born in Norway, built for anywhere.'
      ? 'Født i Norge, bygget for alle steder.'
      : seo.metaDescription,
  }
}

async function main() {
  const settings = await client.fetch<GlobalSettings | null>(
    '*[_type == "globalSettings"][0]{_id, seo, seoNb, seoEn}',
  )

  if (!settings) throw new Error('Fant ingen globale innstillinger.')
  if (!settings.seo) throw new Error('Fant ingen eldre SEO-data å migrere.')

  const set: Record<string, Seo> = {}
  if (!settings.seoNb) set.seoNb = norwegianSeo(settings.seo)
  if (!settings.seoEn) set.seoEn = settings.seo

  if (!Object.keys(set).length) {
    console.log('Norsk og engelsk SEO er allerede fylt ut. Ingen endringer.')
  } else if (!apply) {
    console.log(`Forhåndsvisning: ville oppdatert ${Object.keys(set).join(' og ')}. Kjør med --apply for å lagre.`)
  } else {
    await client.patch(settings._id).set(set).commit()
    console.log(`Oppdatert ${Object.keys(set).join(' og ')}.`)
  }
}

void main()
