import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'link',
  title: 'Lenke',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Intern', value: 'internal' },
          { title: 'Ekstern', value: 'external' }
        ],
        layout: 'radio'
      },
      initialValue: 'internal'
    }),
    defineField({
      name: 'label',
      title: 'Tekst',
      type: 'string'
    }),
    defineField({
      name: 'internalLink',
      title: 'Intern side',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'postType' },  // Arkivsider (f.eks. /artister)
        { type: 'post' }       // Enkeltinnlegg (f.eks. /artister/aurora)
      ],
      hidden: ({ parent }) => parent?.type !== 'internal'
    }),
    defineField({
      name: 'externalUrl',
      title: 'Ekstern URL',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'external'
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Åpne i ny fane',
      type: 'boolean',
      initialValue: false
    })
  ]
})
