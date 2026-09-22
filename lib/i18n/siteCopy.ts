import type { Locale } from './config'

export type SiteCopy = Record<string, string>

const defaults: Record<Locale, SiteCopy> = {
  nb: {
    loaderLabel: 'Født i Norge', scrollStory: 'Bla gjennom historien', scrollOrigin: 'Bla gjennom opprinnelsen',
    themeToggleToLight: 'Bytt til lys modus', themeToggleToDark: 'Bytt til mørk modus',
    footerTagline: 'Født i Norge,\nbygget for alle veier.', footerContactLabel: 'Kontakt', footerFollowLabel: 'Følg oss', footerResellerLabel: 'Norsk forhandler ↗', footerCopyright: '© {year} RAW Lights',
    catalogFilterLabel: 'Filtrer produkter', catalogAll: 'Alle', catalogDriving: 'Kjørelys', catalogWork: 'Arbeidslys', catalogWarning: 'Varsellys',
    productLabel: 'Produkt', productViewLabel: 'Se', productHoverLabel: 'Hold over for å tenne', productLampFallback: 'Lampen', contactEyebrow: 'Kontakt', productBreadcrumb: 'Produkter', productCategorySuffix: 'lys', productKeySpecifications: 'Nøkkelspesifikasjoner', productDescription: 'Beskrivelse', productInformation: 'Tilleggsinformasjon', productSpecifications: 'Spesifikasjoner.', productRelatedEyebrow: 'Flere i serien', productRelatedHeading: 'Relaterte lykter.',
  },
  en: {
    loaderLabel: 'Born in Norway', scrollStory: 'Scroll the story', scrollOrigin: 'Scroll the origin',
    themeToggleToLight: 'Switch to light mode', themeToggleToDark: 'Switch to dark mode',
    footerTagline: 'Born in Norway,\nbuilt for anywhere.', footerContactLabel: 'Contact', footerFollowLabel: 'Follow', footerResellerLabel: 'Norwegian reseller ↗', footerCopyright: '© {year} RAW Lights',
    catalogFilterLabel: 'Filter products', catalogAll: 'All', catalogDriving: 'Driving', catalogWork: 'Work', catalogWarning: 'Warning',
    productLabel: 'Product', productViewLabel: 'View', productHoverLabel: 'Hover to ignite', productLampFallback: 'The lamp', contactEyebrow: 'Contact', productBreadcrumb: 'Products', productCategorySuffix: 'lights', productKeySpecifications: 'Key specifications', productDescription: 'Description', productInformation: 'Additional information', productSpecifications: 'Specifications.', productRelatedEyebrow: 'Also in the range', productRelatedHeading: 'Related lamps.',
  },
}

export function siteCopy(locale: Locale, settings?: { localizedUiCopy?: { language?: string; copy?: SiteCopy }[] } | null): SiteCopy {
  return { ...defaults[locale], ...settings?.localizedUiCopy?.find((item) => item.language === locale)?.copy }
}
