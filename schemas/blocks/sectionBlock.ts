import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'sectionBlock',
  title: 'Gruppe',
  type: 'object',
  description: 'Grupper flere blokker med felles bakgrunn og avstand',
  fields: [
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
      initialValue: 'background'
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
      initialValue: 'medium'
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
      initialValue: 'container'
    }),
    defineField({
      name: 'children',
      title: 'Blokker',
      type: 'array',
      of: [
        defineArrayMember({ type: 'textBlock' }),
        defineArrayMember({ type: 'ctaBlock' }),
        defineArrayMember({ type: 'galleryBlock' }),
        defineArrayMember({ type: 'spacerBlock' }),
        defineArrayMember({ type: 'accordionBlock' }),
        defineArrayMember({ type: 'marqueeBlock' }),
        defineArrayMember({ type: 'mediaTextBlock' }),
        defineArrayMember({ type: 'postGridBlock' })
      ]
    })
  ],
  preview: {
    select: {
      children: 'children',
      background: 'background'
    },
    prepare({ children, background }) {
      return {
        title: 'Gruppe',
        subtitle: `${children?.length ?? 0} blokker • ${background ?? 'standard'} bakgrunn`
      }
    }
  }
})
