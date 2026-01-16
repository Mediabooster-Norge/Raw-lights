import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'textBlock',
  title: 'Tekst',
  type: 'object',
  groups: [
    { name: 'content', title: 'Innhold', default: true },
    { name: 'styling', title: 'Styling' }
  ],
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
      name: 'textWidth',
      title: 'Tekstbredde',
      type: 'string',
      options: {
        list: [
          { title: 'Smal', value: 'narrow' },
          { title: 'Medium', value: 'medium' },
          { title: 'Bred', value: 'wide' }
        ]
      },
      initialValue: 'medium',
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
    prepare() {
      return {
        title: 'Tekstblokk'
      }
    }
  }
})
