import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'accordionBlock',
  title: 'Spørsmål og svar',
  type: 'object',
  groups: [
    { name: 'content', title: 'Innhold', default: true },
    { name: 'styling', title: 'Styling' }
  ],
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
      name: 'items',
      title: 'Spørsmål',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Spørsmål', type: 'string' }),
            defineField({ name: 'answer', title: 'Svar', type: 'richText' })
          ],
          preview: {
            select: { title: 'question' }
          }
        })
      ],
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
      heading: 'heading',
      items: 'items'
    },
    prepare({ heading, items }) {
      return {
        title: heading ?? 'Spørsmål og svar',
        subtitle: `${items?.length ?? 0} spørsmål`
      }
    }
  }
})
