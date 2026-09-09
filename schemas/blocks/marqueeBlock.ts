import { InlineIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'
import { appearanceGroup, contentGroup } from '../studio/groups'
import { altField } from '../helpers/altField'

export default defineType({
  name: 'marqueeBlock',
  title: 'Marquee',
  type: 'object',
  icon: InlineIcon,
  groups: [contentGroup, appearanceGroup],
  fields: [
    defineField({
      name: 'contentType',
      title: 'Innholdstype',
      type: 'string',
      options: {
        list: [
          { title: 'Tekst', value: 'text' },
          { title: 'Bilder', value: 'images' }
        ],
        layout: 'radio'
      },
      initialValue: 'text',
      group: 'content'
    }),
    defineField({
      name: 'textItems',
      title: 'Tekstelementer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'text', title: 'Tekst', type: 'string' })
          ],
          preview: {
            select: { title: 'text' }
          }
        })
      ],
      hidden: ({ parent }) => parent?.contentType !== 'text',
      group: 'content'
    }),
    defineField({
      name: 'imageItems',
      title: 'Bilder',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            altField
          ]
        })
      ],
      hidden: ({ parent }) => parent?.contentType !== 'images',
      group: 'content'
    }),
    defineField({
      name: 'size',
      title: 'Størrelse',
      type: 'string',
      options: {
        list: [
          { title: 'Liten', value: 'small' },
          { title: 'Standard', value: 'medium' }
        ],
        layout: 'radio'
      },
      initialValue: 'medium',
      group: 'content'
    }),
    defineField({
      name: 'speed',
      title: 'Hastighet',
      type: 'string',
      options: {
        list: [
          { title: 'Sakte', value: 'slow' },
          { title: 'Normal', value: 'normal' },
          { title: 'Rask', value: 'fast' }
        ]
      },
      initialValue: 'normal',
      group: 'content'
    }),
    defineField({
      name: 'direction',
      title: 'Retning',
      type: 'string',
      options: {
        list: [
          { title: 'Venstre', value: 'left' },
          { title: 'Høyre', value: 'right' }
        ],
        layout: 'radio'
      },
      initialValue: 'left',
      group: 'content'
    }),
    defineField({
      name: 'separator',
      title: 'Separator mellom elementer',
      type: 'string',
      description: 'F.eks. • eller —',
      hidden: ({ parent }) => parent?.contentType !== 'text',
      group: 'content'
    }),
    defineField({
      name: 'textColor',
      title: 'Tekstfarge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær tekst', value: 'text-primary' },
          { title: 'Sekundær tekst', value: 'text-secondary' },
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' },
          { title: 'Hvit', value: 'white' }
        ]
      },
      initialValue: 'text-primary',
      hidden: ({ parent }) => parent?.contentType !== 'text',
      group: 'content'
    }),
    defineField({
      name: 'imageStyle',
      title: 'Bildestil',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Gråtone', value: 'grayscale' },
          { title: 'Primær tint', value: 'primary-tint' },
          { title: 'Sekundær tint', value: 'secondary-tint' }
        ]
      },
      initialValue: 'normal',
      hidden: ({ parent }) => parent?.contentType !== 'images',
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
      contentType: 'contentType',
      size: 'size'
    },
    prepare({ contentType, size }) {
      return {
        title: 'Marquee',
        subtitle: `${contentType === 'images' ? 'Bilder' : 'Tekst'} • ${size ?? 'medium'}`
      }
    }
  }
})
