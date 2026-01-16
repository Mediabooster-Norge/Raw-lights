import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Innlegg',
  type: 'document',
  icon: () => '📄',
  fields: [
    defineField({
      name: 'postType',
      title: 'Posttype',
      type: 'reference',
      to: [{ type: 'postType' }],
      validation: Rule => Rule.required(),
      description: 'Velg hvilken type innlegg dette er'
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'featuredImage',
      title: 'Hovedbilde',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string'
        })
      ]
    }),
    defineField({
      name: 'excerpt',
      title: 'Utdrag',
      type: 'text',
      rows: 3,
      description: 'Kort beskrivelse som vises i arkiv/lister'
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'richText',
      description: 'Hovedinnholdet på enkeltvisningen'
    }),
    defineField({
      name: 'gallery',
      title: 'Bildegalleri',
      type: 'array',
      of: [{ 
        type: 'image', 
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alt-tekst', type: 'string' }),
          defineField({ name: 'caption', title: 'Bildetekst', type: 'string' })
        ]
      }],
      description: 'Valgfritt bildegalleri'
    }),
    defineField({
      name: 'externalUrl',
      title: 'Ekstern lenke',
      type: 'url',
      description: 'Valgfri lenke til ekstern side (f.eks. Spotify, Facebook)'
    }),
    defineField({
      name: 'externalUrlLabel',
      title: 'Lenketekst',
      type: 'string',
      description: 'Tekst på knappen (f.eks. "Lytt på Spotify")',
      hidden: ({ parent }) => !parent?.externalUrl
    }),
    defineField({
      name: 'publishDate',
      title: 'Publiseringsdato',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'visibility',
      title: 'Synlighet',
      type: 'string',
      options: {
        list: [
          { title: 'Offentlig', value: 'public' },
          { title: 'Skjult', value: 'hidden' }
        ],
        layout: 'radio'
      },
      initialValue: 'public'
    }),
    defineField({
      name: 'order',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall = vises først (valgfritt)',
      initialValue: 0
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    })
  ],
  orderings: [
    {
      title: 'Rekkefølge',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'Nyeste først',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }]
    },
    {
      title: 'Tittel A-Å',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'Posttype',
      name: 'postTypeAsc',
      by: [
        { field: 'postType.singularTitle', direction: 'asc' },
        { field: 'order', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      postType: 'postType.singularTitle',
      media: 'featuredImage',
      visibility: 'visibility'
    },
    prepare({ title, postType, media, visibility }) {
      return {
        title: title ?? 'Uten tittel',
        subtitle: `${postType ?? 'Ingen type'} ${visibility === 'hidden' ? '(Skjult)' : ''}`,
        media
      }
    }
  }
})
