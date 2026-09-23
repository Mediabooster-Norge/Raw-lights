import { CogIcon, TranslateIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { brandGroup, codeGroup, seoGroup } from '../studio/groups'
import { altField } from '../helpers/altField'
import { fontOptions } from '@/lib/theme/fontOptions'

export default defineType({
  name: 'globalSettings',
  title: 'Globale innstillinger',
  type: 'document',
  icon: CogIcon,
  groups: [brandGroup, seoGroup, codeGroup, { name: 'copy', title: 'Språk og UI-tekst', icon: TranslateIcon }],
  fields: [
    defineField({
      name: 'localizedUiCopy', title: 'Global tekst per språk', type: 'array', group: 'copy',
      description: 'Redaksjonell tekst som ellers ville vært fast i designet. Velg språk og fyll kun ut verdiene dere vil overstyre.',
      validation: (Rule) => Rule.max(2),
      of: [{ type: 'object', fields: [
        defineField({ name: 'language', title: 'Språk', type: 'string', options: { list: [{ title: 'Norsk', value: 'nb' }, { title: 'English', value: 'en' }] }, validation: (Rule) => Rule.required() }),
        defineField({ name: 'copy', title: 'Tekst', type: 'object', fields: [
          defineField({ name: 'scrollStory', title: 'Scroll-cue: historie', type: 'string' }), defineField({ name: 'scrollOrigin', title: 'Scroll-cue: opprinnelse', type: 'string' }),
          defineField({ name: 'themeToggleToLight', title: 'Tema: tilgjengelighetsnavn for lys modus', type: 'string' }), defineField({ name: 'themeToggleToDark', title: 'Tema: tilgjengelighetsnavn for mørk modus', type: 'string' }),
          defineField({ name: 'footerTagline', title: 'Footer: slagord', type: 'text', rows: 3 }), defineField({ name: 'footerContactLabel', title: 'Footer: kontakt', type: 'string' }), defineField({ name: 'footerFollowLabel', title: 'Footer: følg', type: 'string' }), defineField({ name: 'footerResellerLabel', title: 'Footer: forhandlerlenke', type: 'string' }), defineField({ name: 'footerCopyright', title: 'Footer: copyright ({year} erstattes automatisk)', type: 'string' }),
          defineField({ name: 'catalogFilterLabel', title: 'Produkter: filtertittel', type: 'string' }), defineField({ name: 'catalogAll', title: 'Filter: alle', type: 'string' }), defineField({ name: 'catalogDriving', title: 'Filter: kjørelys', type: 'string' }), defineField({ name: 'catalogWork', title: 'Filter: arbeidslys', type: 'string' }), defineField({ name: 'catalogWarning', title: 'Filter: varsellys', type: 'string' }),
          defineField({ name: 'productLabel', title: 'Produktetikett', type: 'string' }), defineField({ name: 'productViewLabel', title: 'Produkt: se-knapp', type: 'string' }), defineField({ name: 'productHoverLabel', title: 'Produkt: hover-tekst', type: 'string' }), defineField({ name: 'contactEyebrow', title: 'Kontakt: etikett', type: 'string' }),
          defineField({ name: 'productLampFallback', title: 'Produkt: standard etikett', type: 'string' }), defineField({ name: 'productBreadcrumb', title: 'Produktside: brødsmule', type: 'string' }), defineField({ name: 'productCategorySuffix', title: 'Produktside: kategorisuffiks', type: 'string' }), defineField({ name: 'productKeySpecifications', title: 'Produktside: nøkkelspesifikasjoner', type: 'string' }), defineField({ name: 'productDescription', title: 'Produktside: beskrivelse', type: 'string' }), defineField({ name: 'productInformation', title: 'Produktside: tilleggsinformasjon', type: 'string' }), defineField({ name: 'productSpecifications', title: 'Produktside: spesifikasjoner', type: 'string' }), defineField({ name: 'productRelatedEyebrow', title: 'Produktside: relaterte etikett', type: 'string' }), defineField({ name: 'productRelatedHeading', title: 'Produktside: relaterte overskrift', type: 'string' }),
        ] }),
      ], preview: { select: { title: 'language' }, prepare: ({ title }) => ({ title: title === 'nb' ? 'Norsk' : 'English' }) } }],
    }),
    defineField({
      name: 'siteName',
      title: 'Nettstednavn',
      type: 'string',
      group: 'brand'
    }),
    defineField({
      name: 'siteTheme',
      title: 'Tema',
      type: 'object',
      group: 'brand',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo for mørk modus',
          type: 'image',
          options: { hotspot: true },
          fields: [altField]
        }),
        defineField({
          name: 'logoLight',
          title: 'Logo for lys modus',
          type: 'image',
          options: { hotspot: true },
          fields: [altField],
          description: 'Bruk den svarte RAW-logoen. Faller tilbake til logoen for mørk modus hvis dette feltet er tomt.',
        }),
        defineField({
          name: 'favicon',
          title: 'Favicon',
          type: 'image'
        }),
        defineField({
          name: 'typography',
          title: 'Typografi',
          type: 'object',
          options: { collapsible: true, collapsed: false },
          fields: [
            {
              name: 'headingFont',
              title: 'Overskriftsfont',
              type: 'string',
              options: { list: fontOptions, layout: 'dropdown' },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'bodyFont',
              title: 'Brødtekstfont',
              type: 'string',
              options: { list: fontOptions, layout: 'dropdown' },
              validation: (Rule) => Rule.required(),
            }
          ]
        })
      ]
    }),
    defineField({
      name: 'enableLightMode',
      title: 'Aktiver lys modus',
      type: 'boolean',
      group: 'brand',
      initialValue: false,
      description: 'Når denne er av, skjules temabryteren og nettstedet låses helt til mørk modus. Lagret lysmodus hos besøkende blir ignorert og fjernet.',
    }),
    defineField({
      name: 'homePage',
      title: 'Forside',
      type: 'reference',
      weak: true,
      to: [{ type: 'page' }],
      group: 'brand',
      validation: (Rule) => Rule.required(),
      description: 'Siden som vises på /. Oversettelser av denne siden brukes på /en.',
    }),
    defineField({
      name: 'notFoundPage',
      title: '404-side',
      type: 'reference',
      weak: true,
      to: [{ type: 'page' }],
      group: 'brand',
      description: 'Valgfri CMS-side for 404. Oversettelser brukes per språk.',
    }),
    defineField({
      name: 'privacyPage',
      title: 'Personvernside',
      type: 'reference',
      weak: true,
      to: [{ type: 'page' }],
      group: 'brand',
      description: 'Lenkes fra cookie-banneret. Oversettelser brukes per språk.',
    }),
    defineField({
      name: 'enableCookieConsent',
      title: 'Cookie-samtykke',
      type: 'boolean',
      group: 'code',
      initialValue: true,
      description: 'Vis samtykke-banner før egendefinerte scripts lastes. Slå av for å laste scripts med en gang.',
    }),
    defineField({
      name: 'seo',
      title: 'Standard SEO (eldre fallback)',
      type: 'seo',
      group: 'seo',
      hidden: true,
      description: 'Beholdes som fallback. Bruk språkspesifikk standard-SEO under for nytt innhold.',
    }),
    defineField({
      name: 'seoNb',
      title: 'Norsk SEO',
      type: 'seo',
      group: 'seo',
      description: 'Standard metadata for den norske versjonen av nettstedet.',
    }),
    defineField({
      name: 'seoEn',
      title: 'English SEO',
      type: 'seo',
      group: 'seo',
      description: 'Default metadata for the English version of the website.',
    }),
    defineField({
      name: 'localizedSeo',
      title: 'Språkspesifikk standard-SEO (eldre fallback)',
      type: 'array',
      group: 'seo',
      hidden: true,
      of: [{ type: 'object', fields: [
        defineField({ name: 'language', type: 'string' }),
        defineField({ name: 'seo', type: 'seo' }),
      ] }],
    }),
    defineField({
      name: 'schemaOrganization',
      title: 'Virksomhetsdata i schema',
      type: 'object',
      group: 'seo',
      description: 'Valgfrie, faktiske kontaktopplysninger som publiseres på alle sider i Organization-schema.',
      fields: [
        defineField({ name: 'legalName', title: 'Juridisk navn', type: 'string' }),
        defineField({ name: 'email', title: 'E-post', type: 'string', validation: (Rule) => Rule.email().warning('Skriv en gyldig e-postadresse') }),
        defineField({ name: 'telephone', title: 'Telefon', type: 'string' }),
        defineField({
          name: 'address', title: 'Adresse', type: 'object',
          fields: [
            defineField({ name: 'streetAddress', title: 'Gateadresse', type: 'string' }),
            defineField({ name: 'postalCode', title: 'Postnummer', type: 'string' }),
            defineField({ name: 'addressLocality', title: 'Poststed', type: 'string' }),
            defineField({ name: 'addressCountry', title: 'Landkode', type: 'string', initialValue: 'NO', validation: (Rule) => Rule.length(2).warning('Bruk ISO-landkode, f.eks. NO') }),
          ]
        }),
      ]
    }),
    defineField({
      name: 'customCode',
      title: 'Egendefinert kode',
      type: 'customCode',
      group: 'code'
    })
  ],
  preview: {
    select: {
      title: 'siteName'
    },
    prepare({ title }) {
      return {
        title: title ?? 'Globale innstillinger'
      }
    }
  }
})
