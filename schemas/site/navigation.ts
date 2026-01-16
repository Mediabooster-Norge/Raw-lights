import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigasjon',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Hovedmeny',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Tekst', type: 'string' }),
          defineField({ name: 'link', title: 'Lenke', type: 'link' }),
          defineField({
            name: 'children',
            title: 'Undermeny',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Tekst', type: 'string' }),
                defineField({ name: 'link', title: 'Lenke', type: 'link' })
              ]
            }]
          })
        ]
      }]
    }),
    defineField({
      name: 'headerCta',
      title: 'Header CTA',
      type: 'object',
      fields: [
        defineField({ name: 'link', title: 'Lenke', type: 'link' }),
        defineField({
          name: 'variant',
          title: 'Variant',
          type: 'string',
          options: { list: ['primary', 'secondary'] },
          initialValue: 'primary'
        })
      ]
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer navigasjon',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Tittel', type: 'string' }),
          defineField({
            name: 'links',
            title: 'Lenker',
            type: 'array',
            of: [{ type: 'link' }]
          })
        ]
      }]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Sosiale medier',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'platform',
            title: 'Plattform',
            type: 'string',
            options: {
              list: ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin']
            }
          }),
          defineField({ name: 'url', title: 'URL', type: 'url' })
        ]
      }]
    })
  ]
})
