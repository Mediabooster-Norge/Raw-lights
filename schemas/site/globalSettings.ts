import { CogIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { brandGroup, codeGroup, seoGroup } from '../studio/groups'

const fontOptions = [
  'Inter',
  'Playfair Display',
  'Montserrat',
  'Poppins',
  'Oswald',
  'Merriweather',
  'Raleway',
  'Roboto',
  'Open Sans',
  'Lato',
  'Source Sans Pro',
  'Nunito',
  'Work Sans'
]

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
          fields: [{ name: 'alt', title: 'Alt tekst', type: 'string' }]
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
              options: { list: fontOptions }
            },
            {
              name: 'bodyFont',
              title: 'Brødtekstfont',
              type: 'string',
              options: { list: fontOptions }
            },
            { name: 'customHeadingFont', title: 'Egendefinert overskriftsfont', type: 'string' },
            { name: 'customBodyFont', title: 'Egendefinert brødtekstfont', type: 'string' }
          ]
        })
      ]
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
