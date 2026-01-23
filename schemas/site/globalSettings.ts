import { defineType, defineField } from 'sanity'
import { getSiteField } from '../helpers/siteField'

export default defineType({
  name: 'globalSettings',
  title: 'Globale innstillinger',
  type: 'document',
  fields: [
    ...getSiteField(),
    defineField({
      name: 'siteTheme',
      title: 'Tema',
      type: 'object',
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt tekst', type: 'string' }]
        }),
        defineField({
          name: 'logoDark',
          title: 'Logo (mørk)',
          type: 'image',
          options: { hotspot: true }
        }),
        defineField({
          name: 'favicon',
          title: 'Favicon',
          type: 'image'
        }),
        defineField({
          name: 'ogImage',
          title: 'Standard OG-bilde',
          type: 'image'
        }),
        defineField({
          name: 'colors',
          title: 'Farger',
          type: 'object',
          fields: [
            { name: 'primary', title: 'Primærfarge', type: 'color' },
            { name: 'secondary', title: 'Sekundærfarge', type: 'color' },
            { name: 'tertiary', title: 'Tertiærfarge', type: 'color' },
            { name: 'background', title: 'Bakgrunn', type: 'color' },
            { name: 'surface', title: 'Overflate', type: 'color' },
            { name: 'textPrimary', title: 'Tekst primær', type: 'color' },
            { name: 'textSecondary', title: 'Tekst sekundær', type: 'color' }
          ]
        }),
        defineField({
          name: 'buttonColors',
          title: 'Knappfarger',
          type: 'object',
          fields: [
            {
              name: 'primary',
              title: 'Primær',
              type: 'object',
              fields: [
                { name: 'background', title: 'Bakgrunn', type: 'color' },
                { name: 'text', title: 'Tekst', type: 'color' }
              ]
            },
            {
              name: 'secondary',
              title: 'Sekundær',
              type: 'object',
              fields: [
                { name: 'background', title: 'Bakgrunn', type: 'color' },
                { name: 'text', title: 'Tekst', type: 'color' }
              ]
            }
          ]
        }),
        defineField({
          name: 'typography',
          title: 'Typografi',
          type: 'object',
          fields: [
            {
              name: 'headingFont',
              title: 'Overskriftsfont',
              type: 'string',
              options: {
                list: ['Inter', 'Playfair Display', 'Montserrat', 'Poppins', 'Oswald', 'Merriweather', 'Raleway']
              }
            },
            {
              name: 'bodyFont',
              title: 'Brødtekstfont',
              type: 'string',
              options: {
                list: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Source Sans Pro', 'Nunito', 'Work Sans']
              }
            },
            { name: 'customHeadingFont', title: 'Egendefinert overskriftsfont', type: 'string' },
            { name: 'customBodyFont', title: 'Egendefinert brødtekstfont', type: 'string' }
          ]
        }),
        defineField({
          name: 'navigation',
          title: 'Navigasjon',
          type: 'object',
          fields: [
            {
              name: 'linkColor',
              title: 'Lenkefarge',
              type: 'string',
              options: {
                list: [
                  { title: 'Primær tekst', value: 'text-primary' },
                  { title: 'Sekundær tekst', value: 'text-secondary' },
                  { title: 'Primærfarge', value: 'primary' },
                  { title: 'Sekundærfarge', value: 'secondary' }
                ],
                layout: 'radio'
              },
              initialValue: 'text-primary'
            },
            {
              name: 'hoverColor',
              title: 'Hover-farge',
              type: 'string',
              options: {
                list: [
                  { title: 'Primærfarge', value: 'primary' },
                  { title: 'Sekundærfarge', value: 'secondary' },
                  { title: 'Primær tekst', value: 'text-primary' },
                  { title: 'Sekundær tekst', value: 'text-secondary' }
                ],
                layout: 'radio'
              },
              initialValue: 'primary'
            }
          ]
        }),
        defineField({
          name: 'headerMarquee',
          title: 'Header Marquee',
          type: 'object',
          fields: [
            {
              name: 'enabled',
              title: 'Aktiver marquee under header',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'contentType',
              title: 'Innholdstype',
              type: 'string',
              options: {
                list: [
                  { title: 'Tekst', value: 'text' },
                  { title: 'Bilder', value: 'images' }
                ],
                layout: 'radio'
              },
              initialValue: 'text',
              hidden: ({ parent }) => !parent?.enabled
            },
            {
              name: 'textItems',
              title: 'Tekstelementer',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'text', title: 'Tekst', type: 'string' },
                    { name: 'link', title: 'Lenke', type: 'link' }
                  ],
                  preview: {
                    select: { title: 'text' }
                  }
                }
              ],
              hidden: ({ parent }) => !parent?.enabled || parent?.contentType !== 'text'
            },
            {
              name: 'imageItems',
              title: 'Bilder',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { 
                      name: 'image', 
                      title: 'Bilde', 
                      type: 'image',
                      options: { hotspot: true }
                    },
                    { name: 'alt', title: 'Alt tekst', type: 'string' },
                    { name: 'link', title: 'Lenke', type: 'link' }
                  ],
                  preview: {
                    select: { 
                      title: 'alt',
                      media: 'image'
                    }
                  }
                }
              ],
              hidden: ({ parent }) => !parent?.enabled || parent?.contentType !== 'images'
            },
            {
              name: 'speed',
              title: 'Hastighet',
              type: 'string',
              options: {
                list: [
                  { title: 'Sakte', value: 'slow' },
                  { title: 'Normal', value: 'normal' },
                  { title: 'Rask', value: 'fast' }
                ]
              },
              initialValue: 'normal',
              hidden: ({ parent }) => !parent?.enabled
            },
            {
              name: 'direction',
              title: 'Retning',
              type: 'string',
              options: {
                list: [
                  { title: 'Venstre', value: 'left' },
                  { title: 'Høyre', value: 'right' }
                ],
                layout: 'radio'
              },
              initialValue: 'left',
              hidden: ({ parent }) => !parent?.enabled
            },
            {
              name: 'backgroundColor',
              title: 'Bakgrunnsfarge',
              type: 'string',
              options: {
                list: [
                  { title: 'Primær', value: 'primary' },
                  { title: 'Sekundær', value: 'secondary' },
                  { title: 'Bakgrunn', value: 'background' },
                  { title: 'Overflate', value: 'surface' }
                ]
              },
              initialValue: 'primary',
              hidden: ({ parent }) => !parent?.enabled
            },
            {
              name: 'textColor',
              title: 'Tekstfarge',
              type: 'string',
              options: {
                list: [
                  { title: 'Hvit', value: 'white' },
                  { title: 'Primær tekst', value: 'text-primary' },
                  { title: 'Sekundær tekst', value: 'text-secondary' }
                ]
              },
              initialValue: 'white',
              hidden: ({ parent }) => !parent?.enabled
            },
            {
              name: 'separator',
              title: 'Separator',
              type: 'string',
              description: 'Tegn mellom tekster, f.eks. • eller ★',
              initialValue: '•',
              hidden: ({ parent }) => !parent?.enabled || parent?.contentType !== 'text'
            }
          ]
        })
      ]
    }),
    defineField({
      name: 'seo',
      title: 'Standard SEO',
      type: 'seo'
    }),
    defineField({
      name: 'customCode',
      title: 'Egendefinert kode',
      type: 'customCode'
    })
  ]
})
