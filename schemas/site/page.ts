import { DocumentsIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { contentGroup, seoGroup, visibilityGroup } from '../studio/groups'

export default defineType({
  name: 'page',
  title: 'Side',
  type: 'document',
  icon: DocumentsIcon,
  groups: [contentGroup, seoGroup, visibilityGroup],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'content',
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
      group: 'content',
      of: [
        { type: 'heroBlock' },
        { type: 'textBlock' },
        { type: 'ctaBlock' },
        { type: 'galleryBlock' },
        { type: 'marqueeBlock' },
        { type: 'mediaTextBlock' },
        { type: 'accordionBlock' },
        { type: 'postGridBlock' },
        { type: 'spacerBlock' },
        { type: 'sectionBlock' }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo'
    }),
    defineField({
      name: 'visibility',
      title: 'Synlighet',
      type: 'string',
      group: 'visibility',
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
      group: 'visibility',
      description: 'Siden vil ikke vises før denne datoen'
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
