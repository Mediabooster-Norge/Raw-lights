import { TextIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { appearanceGroup, contentGroup } from '../studio/groups'

export default defineType({
  name: 'textBlock',
  title: 'Tekst',
  type: 'object',
  icon: TextIcon,
  groups: [contentGroup, appearanceGroup],
  fields: [
    // Innhold
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'richText',
      group: 'content'
    }),
    defineField({
      name: 'alignment',
      title: 'Justering',
      type: 'string',
      options: {
        list: [
          { title: 'Venstre', value: 'left' },
          { title: 'Senter', value: 'center' },
          { title: 'Høyre', value: 'right' }
        ],
        layout: 'radio'
      },
      initialValue: 'left',
      group: 'content'
    }),
    defineField({
      name: 'textColor',
      title: 'Skriftfarge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ]
      },
      initialValue: 'primary',
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
    prepare() {
      return {
        title: 'Tekstblokk'
      }
    }
  }
})
