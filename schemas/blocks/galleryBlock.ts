import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryBlock',
  title: 'Galleri',
  type: 'object',
  groups: [
    { name: 'content', title: 'Innhold', default: true },
    { name: 'styling', title: 'Styling' }
  ],
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
    // Styling
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
      group: 'styling'
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
      group: 'styling'
    }),
    defineField({
      name: 'containerWidth',
      title: 'Bredde',
      type: 'string',
      options: {
        list: [
          { title: 'Full bredde', value: 'full' },
          { title: 'Container', value: 'container' }
        ],
        layout: 'radio'
      },
      initialValue: 'container',
      group: 'styling'
    })
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
