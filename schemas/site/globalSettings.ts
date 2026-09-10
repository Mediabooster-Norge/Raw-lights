import { CogIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { brandGroup, codeGroup, seoGroup } from '../studio/groups'
import { altField } from '../helpers/altField'
import { fontOptions } from '@/lib/theme/fontOptions'

export default defineType({
  name: 'globalSettings',
  title: 'Globale innstillinger',
  type: 'document',
  icon: CogIcon,
  groups: [brandGroup, seoGroup, codeGroup],
  fields: [
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
          title: 'Logo',
          type: 'image',
          options: { hotspot: true },
          fields: [altField]
        }),
        defineField({
          name: 'favicon',
          title: 'Favicon',
          type: 'image'
        }),
        defineField({
          name: 'colors',
          title: 'Farger',
          type: 'object',
          options: { collapsible: true, collapsed: false },
          fields: [
            { name: 'primary', title: 'Primær', type: 'color' },
            { name: 'background', title: 'Bakgrunn', type: 'color' },
            { name: 'textPrimary', title: 'Tekst', type: 'color' }
          ]
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
      name: 'homePage',
      title: 'Forside',
      type: 'reference',
      to: [{ type: 'page' }],
      group: 'brand',
      validation: (Rule) => Rule.required(),
      description: 'Siden som vises på /. Oversettelser av denne siden brukes på /en.',
    }),
    defineField({
      name: 'notFoundPage',
      title: '404-side',
      type: 'reference',
      to: [{ type: 'page' }],
      group: 'brand',
      description: 'Valgfri CMS-side for 404. Oversettelser brukes per språk.',
    }),
    defineField({
      name: 'privacyPage',
      title: 'Personvernside',
      type: 'reference',
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
      title: 'Standard SEO',
      type: 'seo',
      group: 'seo'
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
