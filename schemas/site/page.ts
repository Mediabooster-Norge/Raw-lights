import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Side',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'blocks',
      title: 'Sidebygger',
      type: 'array',
      of: [
        { type: 'heroBlock' },
        { type: 'textBlock' },
        { type: 'ctaBlock' },
        { type: 'galleryBlock' },
        { type: 'marqueeBlock' },
        { type: 'mediaTextBlock' },
        { type: 'accordionBlock' },
        { type: 'postGridBlock' }, // Innlegg-visning
        { type: 'spacerBlock' },
        { type: 'sectionBlock' } // Gruppe-blokk for spesielle tilfeller
      ]
    }),
    defineField({
      name: 'visibility',
      title: 'Synlighet',
      type: 'string',
      options: {
        list: [
          { title: 'Offentlig', value: 'public' },
          { title: 'Privat', value: 'private' }
        ],
        layout: 'radio'
      },
      initialValue: 'public'
    }),
    defineField({
      name: 'publishDate',
      title: 'Publiseringsdato',
      type: 'datetime',
      description: 'Siden vil ikke vises før denne datoen'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    })
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current'
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug ?? ''}`
      }
    }
  }
})
