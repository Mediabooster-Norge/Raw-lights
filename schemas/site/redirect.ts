import { TransferIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { redirectGroup, settingsGroup } from '../studio/groups'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: TransferIcon,
  groups: [redirectGroup, settingsGroup],
  fields: [
    defineField({
      name: 'source',
      title: 'Fra (kilde)',
      type: 'string',
      description: 'Relativ URL som skal redirectes, f.eks. /gammel-side',
      validation: (Rule) => Rule.required(),
      group: 'redirect'
    }),
    defineField({
      name: 'destination',
      title: 'Til (mål)',
      type: 'string',
      description: 'URL å redirecte til, kan være relativ eller ekstern',
      validation: (Rule) => Rule.required(),
      group: 'redirect'
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent redirect',
      type: 'boolean',
      description: '301 = permanent, 302 = midlertidig',
      initialValue: true,
      group: 'settings'
    })
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent'
    },
    prepare({ source, destination, permanent }) {
      return {
        title: `${source} → ${destination}`,
        subtitle: permanent ? '301 (permanent)' : '302 (midlertidig)'
      }
    }
  }
})
