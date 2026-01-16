import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  groups: [
    { name: 'content', title: 'Innhold', default: true },
    { name: 'background', title: 'Bakgrunn' },
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
      name: 'subheading',
      title: 'Underoverskrift',
      type: 'text',
      rows: 2,
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
        ]
      },
      initialValue: 'center',
      group: 'content'
    }),
    defineField({
      name: 'animateText',
      title: 'Animer tekst',
      type: 'boolean',
      description: 'Animerer overskrift og undertekst når siden lastes',
      initialValue: false,
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
    // Bakgrunn
    defineField({
      name: 'backgroundType',
      title: 'Bakgrunnstype',
      type: 'string',
      options: {
        list: [
          { title: 'Bilde', value: 'image' },
          { title: 'Video', value: 'video' }
        ],
        layout: 'radio'
      },
      initialValue: 'image',
      group: 'background'
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Bakgrunnsbilde',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType === 'video',
      group: 'background'
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Bakgrunnsvideo',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
      group: 'background'
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video poster (fallback-bilde)',
      description: 'Vises mens video laster eller på enheter som ikke støtter video',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
      group: 'background'
    }),
    // Styling - Hero har alltid full bredde og håndterer egen padding
    defineField({
      name: 'containerWidth',
      title: 'Innholdsbredde',
      type: 'string',
      options: {
        list: [
          { title: 'Full bredde', value: 'full' },
          { title: 'Container', value: 'container' }
        ],
        layout: 'radio'
      },
      initialValue: 'container',
      description: 'Bestemmer om innholdet skal begrenses eller gå helt ut',
      group: 'styling'
    })
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title ?? 'Hero',
        subtitle: 'Hero-blokk'
      }
    }
  }
})
