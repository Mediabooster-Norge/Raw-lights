import { ImagesIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { appearanceGroup, contentGroup } from '../studio/groups'

export default defineType({
  name: 'galleryBlock',
  title: 'Galleri',
  type: 'object',
  icon: ImagesIcon,
  groups: [contentGroup, appearanceGroup],
  fields: [
    defineField({
      name: 'images',
      title: 'Bilder',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'content'
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Masonry', value: 'masonry' },
          { title: 'Karusell', value: 'carousel' }
        ]
      },
      initialValue: 'grid',
      group: 'content'
    }),
    defineField({
      name: 'columns',
      title: 'Kolonner',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
      group: 'content'
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primær CTA',
      type: 'object',
      fields: [
        defineField({ name: 'link', title: 'Lenke', type: 'link' })
      ],
      group: 'content'
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Sekundær CTA',
      type: 'object',
      fields: [
        defineField({ name: 'link', title: 'Lenke', type: 'link' })
      ],
      group: 'content'
    }),
    defineField({
      name: 'background',
      title: 'Bakgrunn',
      type: 'string',
      options: {
        list: [
          { title: 'Transparent', value: 'transparent' },
          { title: 'Bakgrunn', value: 'background' },
          { title: 'Overflate', value: 'surface' },
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ]
      },
      initialValue: 'transparent',
      group: 'appearance'
    }),
    defineField({
      name: 'spacing',
      title: 'Avstand',
      type: 'string',
      options: {
        list: [
          { title: 'Ingen', value: 'none' },
          { title: 'Liten', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Stor', value: 'large' },
          { title: 'Ekstra stor', value: 'xlarge' }
        ]
      },
      initialValue: 'medium',
      group: 'appearance'
    }),
  ],
  preview: {
    select: {
      images: 'images'
    },
    prepare({ images }) {
      return {
        title: 'Galleri',
        subtitle: `${images?.length ?? 0} bilder`
      }
    }
  }
})
