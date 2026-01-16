import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta-tittel',
      type: 'string',
      description: 'Tittel som vises i søkemotorer',
      validation: (Rule) => Rule.max(60).warning('Tittel bør være under 60 tegn')
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta-beskrivelse',
      type: 'text',
      rows: 3,
      description: 'Beskrivelse som vises i søkemotorer',
      validation: (Rule) => Rule.max(160).warning('Beskrivelse bør være under 160 tegn')
    }),
    defineField({
      name: 'metaImage',
      title: 'OG-bilde',
      type: 'image',
      description: 'Bilde som vises ved deling på sosiale medier'
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Kanonisk URL',
      type: 'url',
      description: 'Overstyr standard kanonisk URL'
    }),
    defineField({
      name: 'robots',
      title: 'Robots',
      type: 'string',
      options: {
        list: [
          { title: 'Indekser (standard)', value: 'index, follow' },
          { title: 'Ikke indekser', value: 'noindex, nofollow' },
          { title: 'Ikke følg lenker', value: 'index, nofollow' }
        ]
      },
      initialValue: 'index, follow'
    })
  ]
})
