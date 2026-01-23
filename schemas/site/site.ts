import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'site',
  title: 'Nettsted',
  type: 'document',
  icon: () => '🌐',
  fields: [
    defineField({
      name: 'title',
      title: 'Navn',
      type: 'string',
      description: 'Navn på nettstedet (f.eks. "Landstreff Stavanger")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'siteId',
      title: 'Site ID',
      type: 'slug',
      description: 'Unik identifikator (f.eks. "landstreff"). Brukes i URL og konfigurasjon.',
      options: {
        source: 'title',
        maxLength: 50
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'domain',
      title: 'Domene',
      type: 'string',
      description: 'Produksjonsdomene (f.eks. "landstreffstavanger.no")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isDefault',
      title: 'Standard nettsted',
      type: 'boolean',
      description: 'Sett som standard nettsted for fallback',
      initialValue: false
    }),
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Deaktiver for å skjule nettstedet midlertidig',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      siteId: 'siteId.current',
      domain: 'domain',
      isDefault: 'isDefault',
      isActive: 'isActive'
    },
    prepare({ title, siteId, domain, isDefault, isActive }) {
      const status = !isActive ? '🔴' : isDefault ? '⭐' : '🟢'
      return {
        title: `${status} ${title ?? 'Nytt nettsted'}`,
        subtitle: `${siteId} • ${domain}`
      }
    }
  }
})
