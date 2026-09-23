const VERNE = 'https://verne.no'

/** Canonical Verne PDP paths keyed by VareNr / SKU. */
export const VERNE_PRODUCT_PATHS: Record<string, string> = {
  '11801': '/rawlights/11801/raw-trio-arbeidslys-m-parklys-rødt-hvit-gult-parklys-5220-lm-45w',
  '11802': '/rawlights/11802/raw-trio-xl-arbeidslys-m-parklys-rødt-hvit-gult-parklys-9280-lm-80w',
  '11803': '/rawlights/11803/raw-duo-arbeidslys-m-varsellys-103mm-5220-lm-45w',
  '11804': '/rawlights/11804/raw-duo-xl-arbeidslys-m-varsellys-114mm-9280-lm-80w',
  '11805': '/rawlights/11805/raw-safelite-arbeidslys-m-varsellys-led-2105-effektive-lumen-ece-r65',
  '11806': '/rawlights/11806/raw-solo-arbeidslys-102mm-5220-lm-45w',
  '11807': '/rawlights/11807/raw-solo-xl-arbeidslys-114mm-9280-lm-80w',
  '15501': '/rawlights/15501/raw-nebula-micro-varsellysbjelke-254mm-m-magnet-10-30v',
  '15502': '/rawlights/15502/raw-nebula-mini-varsellysbjelke-381mm-m-magnet-10-30v',
  '66101': '/rawlights/66101/raw-carbon-fjernlys-9-m-gult-hvitt-parklys-13260-lumen-170w',
  '66401': '/rawlights/66401/raw-novo-arbeidslys-flood-24w-3520-lm-75mm',
  '66402': '/rawlights/66402/raw-novo-arbeidslys-flood-54w-5400-lm-100mm',
  '66403': '/rawlights/66403/raw-novo-arbeidslys-flood-96w-9600-lm-110mm',
  '66442': '/rawlights/66442/raw-novo-pro-arbeidslys-flood-60w-6000-lm-106mm-wide-flood',
  '66444': '/rawlights/66444/raw-novo-pro-arbeidslys-no-glare-60w-5600-lm-106mm-flood-assymetric',
}

/** Slugs imported without SKU, mapped to the matching Verne article. */
export const SLUG_TO_SKU: Record<string, string> = {
  'raw-novo-work-light-4': '66401',
  'raw-novo-work-light-9': '66402',
  'raw-led-work-light-80w': '11802',
  'raw-work-light-warning-45w': '11806',
  'raw-novo-pro-no-6-led': '66442',
  'raw-novo-pro-no-glare': '66444',
}

export function contactDocumentId(language: string) {
  return language === 'en' ? 'i18n.en.raw.page.contact' : 'raw.page.contact'
}

export function verneProductUrl(sku: string | null | undefined, slug?: string | null) {
  const resolved = sku || (slug ? SLUG_TO_SKU[slug] : undefined)
  const path = resolved ? VERNE_PRODUCT_PATHS[resolved] : undefined
  return { sku: resolved || sku || null, url: path ? `${VERNE}${path}` : null }
}

export function productCtas(language: string, verneUrl: string) {
  const english = language === 'en'
  return {
    primaryCta: {
      _type: 'link' as const,
      type: 'external' as const,
      label: english ? 'Buy' : 'Kjøp',
      externalUrl: verneUrl,
      openInNewTab: true,
    },
    secondaryCta: {
      _type: 'link' as const,
      type: 'internal' as const,
      label: english ? 'Contact us' : 'Kontakt oss',
      internalLink: { _type: 'reference' as const, _ref: contactDocumentId(language), _weak: true as const },
      openInNewTab: false,
    },
  }
}
