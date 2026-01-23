import { defineType, defineField } from 'sanity'
import { getSiteField, getSitePreviewSelect, formatSubtitleWithSite } from '../helpers/siteField'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    ...getSiteField(),
    defineField({
      name: 'source',
      title: 'Fra (kilde)',
      type: 'string',
      description: 'Relativ URL som skal redirectes, f.eks. /gammel-side',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'destination',
      title: 'Til (mål)',
      type: 'string',
      description: 'URL å redirecte til, kan være relativ eller ekstern',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent redirect',
      type: 'boolean',
      description: '301 = permanent, 302 = midlertidig',
      initialValue: true
    })
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
      ...getSitePreviewSelect()
    },
    prepare({ source, destination, permanent, siteTitle }) {
      const subtitle = permanent ? '301 (permanent)' : '302 (midlertidig)'
      return {
        title: `${source} → ${destination}`,
        subtitle: formatSubtitleWithSite(subtitle, siteTitle)
      }
    }
  }
})
