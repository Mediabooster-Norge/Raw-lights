import { DocumentsIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { contentGroup, seoGroup, visibilityGroup } from '../studio/groups'
import { languageField } from '../helpers/languageField'
import { jsonLdPageTypes } from '../../lib/seo/types'

export default defineType({
  name: 'page',
  title: 'Side',
  type: 'document',
  icon: DocumentsIcon,
  groups: [contentGroup, seoGroup, visibilityGroup],
  fields: [
    languageField,
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
        { type: 'formBlock' },
        { type: 'spacerBlock' },
        { type: 'sectionBlock' }
      ]
    }),
    defineField({
      name: 'jsonLdType',
      title: 'JSON-LD-type',
      type: 'string',
      group: 'seo',
      options: {
        list: [...jsonLdPageTypes],
      },
      initialValue: 'WebPage',
      description: 'Schema.org-type for siden. FAQPage kan også bygges automatisk fra spørsmål og svar.',
    }),
    defineField({
      name: 'jsonLdOverride',
      title: 'JSON-LD-overstyring',
      type: 'text',
      rows: 8,
      group: 'seo',
      description: 'Valgfri rå JSON som erstatter den genererte markupen for denne siden.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== 'string' || !value.trim()) return true
          try {
            JSON.parse(value)
            return true
          } catch {
            return 'Ugyldig JSON'
          }
        }),
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
          { title: 'Skjult', value: 'hidden' }
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
