import { BoltIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { appearanceGroup, contentGroup } from '../studio/groups'

export default defineType({
  name: 'ctaBlock',
  title: 'CTA',
  type: 'object',
  icon: BoltIcon,
  groups: [contentGroup, appearanceGroup],
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      group: 'content'
    }),
    defineField({
      name: 'headingColor',
      title: 'Overskriftfarge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'primary',
      group: 'content'
    }),
    defineField({
      name: 'text',
      title: 'Tekst',
      type: 'text',
      rows: 2,
      group: 'content'
    }),
    defineField({
      name: 'textColor',
      title: 'Tekstfarge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'secondary',
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
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title ?? 'CTA',
        subtitle: 'CTA-blokk'
      }
    }
  }
})
