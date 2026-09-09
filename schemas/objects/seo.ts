import { JsonIcon, SearchIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

function isJsonLdValue(value: unknown): boolean {
  return typeof value === 'object' && value !== null
}

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  groups: [
    { name: 'meta', title: 'Meta', default: true, icon: SearchIcon },
    { name: 'schema', title: 'JSON-LD', icon: JsonIcon }
  ],
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta-tittel',
      type: 'string',
      description: 'Tittel som vises i søkemotorer',
      validation: (Rule) => Rule.max(60).warning('Tittel bør være under 60 tegn'),
      group: 'meta'
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta-beskrivelse',
      type: 'text',
      rows: 3,
      description: 'Beskrivelse som vises i søkemotorer',
      validation: (Rule) => Rule.max(160).warning('Beskrivelse bør være under 160 tegn'),
      group: 'meta'
    }),
    defineField({
      name: 'metaImage',
      title: 'OG-bilde',
      type: 'image',
      description: 'Bilde som vises ved deling på sosiale medier',
      group: 'meta'
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Kanonisk URL',
      type: 'url',
      description: 'Overstyr standard kanonisk URL',
      group: 'meta'
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
      initialValue: 'index, follow',
      group: 'meta'
    }),
    defineField({
      name: 'jsonLd',
      title: 'JSON-LD-overstyring',
      type: 'text',
      rows: 8,
      hidden: true,
      description: 'Skjult overstyring. Brukes bare når den genererte markupen ikke holder.',
      group: 'schema',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== 'string' || !value.trim()) return true
          try {
            const parsed = JSON.parse(value)
            if (!isJsonLdValue(parsed)) {
              return 'JSON-LD må være et objekt eller en array'
            }
            return true
          } catch {
            return 'Ugyldig JSON'
          }
        })
    })
  ]
})
