import { DocumentsIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { contentGroup, seoGroup, visibilityGroup } from '../studio/groups'
import { languageField } from '../helpers/languageField'
import { isUniqueLocalizedSlug, uniqueLocalizedSlug } from '../helpers/uniqueSlug'
import { jsonLdPageTypes } from '../../lib/seo/types'
import { SchemaRecommendationInput } from '../studio/SchemaRecommendationInput'

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
        maxLength: 96,
        isUnique: isUniqueLocalizedSlug,
      },
      validation: (Rule) => Rule.required().custom(uniqueLocalizedSlug)
    }),
    defineField({
      name: 'blocks',
      title: 'Sidebygger',
      type: 'array',
      group: 'content',
      of: [
        { type: 'textBlock' },
        { type: 'marqueeBlock' },
        { type: 'rawStoryHero' },
        { type: 'rawFillStatement' },
        { type: 'rawPinnedStories' },
        { type: 'rawProductSpotlight' },
        { type: 'rawStats' },
        { type: 'rawProductFamilies' },
        { type: 'rawRules' },
        { type: 'rawTimeline' },
        { type: 'rawBeamSection' },
        { type: 'rawFinale' },
        { type: 'rawContactInfo' },
        { type: 'rawContactForm' },
        { type: 'rawReseller' },
        { type: 'rawFaq' },
        { type: 'productCatalogBlock' }
      ]
    }),
    defineField({
      name: 'schemaRecommendation',
      title: 'Schema-forslag',
      type: 'string',
      group: 'seo',
      readOnly: true,
      components: { input: SchemaRecommendationInput },
    }),
    defineField({
      name: 'jsonLdType',
      title: 'Schema for side',
      type: 'string',
      group: 'seo',
      options: {
        list: [...jsonLdPageTypes],
        layout: 'dropdown',
      },
      initialValue: 'auto',
      description:
        'Automatisk anbefales. Studio foreslår sidetypen fra URL og innhold. Produktlister og FAQ-seksjoner beskrives automatisk ut fra synlige moduler. Bare en dedikert FAQ-side bruker FAQPage.',
    }),
    defineField({
      name: 'jsonLdOverride',
      title: 'Avansert JSON-LD-overstyring',
      type: 'text',
      rows: 8,
      group: 'seo',
      description: 'Kun for SEO-eksperter. Rå JSON flettes inn i den automatiske grafen. Noder med samme @id eller @type oppdateres; automatiske basetyper beholdes.',
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
