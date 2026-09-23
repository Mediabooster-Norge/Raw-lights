import { BulbOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { contentGroup, mediaGroup, seoGroup, visibilityGroup } from '../studio/groups'
import { languageField } from '../helpers/languageField'
import { isUniqueLocalizedSlug, uniqueLocalizedSlug } from '../helpers/uniqueSlug'
import { altField } from '../helpers/altField'

const productCategories = [
  { title: 'Driving lights', value: 'driving' },
  { title: 'Work lights', value: 'work' },
  { title: 'Warning lights', value: 'warning' },
]

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [contentGroup, mediaGroup, seoGroup, visibilityGroup],
  fields: [
    languageField,
    defineField({ name: 'title', title: 'Product name', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL', type: 'slug', group: 'content', options: { source: 'title', maxLength: 96, isUnique: isUniqueLocalizedSlug }, validation: (Rule) => Rule.required().custom(uniqueLocalizedSlug) }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content', options: { list: productCategories, layout: 'radio' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'sku', title: 'SKU', type: 'string', group: 'content' }),
    defineField({ name: 'mpn', title: 'MPN', type: 'string', group: 'content', description: 'Produsentens delenummer. Valgfritt, men anbefalt når det finnes.' }),
    defineField({ name: 'gtin', title: 'GTIN / EAN', type: 'string', group: 'content', validation: (Rule) => Rule.regex(/^\d{8,14}$/).warning('Bruk 8–14 sifre uten mellomrom') }),
    defineField({ name: 'price', title: 'Price display', type: 'string', group: 'content', description: 'Kun visning i designet. Dette brukes ikke i schema.' }),
    defineField({
      name: 'schemaOffer', title: 'Tilbud i schema', type: 'object', group: 'content',
      description: 'Fyll ut bare når produktet faktisk kan kjøpes på denne siden. Alle felter må være korrekte og synlige for brukeren.',
      fields: [
        defineField({ name: 'price', title: 'Pris', type: 'number', validation: (Rule) => Rule.required().positive() }),
        defineField({ name: 'currency', title: 'Valuta', type: 'string', initialValue: 'NOK', options: { list: ['NOK', 'SEK', 'DKK', 'EUR', 'USD'] }, validation: (Rule) => Rule.required() }),
        defineField({ name: 'availability', title: 'Tilgjengelighet', type: 'string', options: { list: [{ title: 'På lager', value: 'InStock' }, { title: 'Utsolgt', value: 'OutOfStock' }, { title: 'Forhåndsbestilling', value: 'PreOrder' }, { title: 'Utgått', value: 'Discontinued' }] }, validation: (Rule) => Rule.required() }),
        defineField({ name: 'validThrough', title: 'Pris gyldig til', type: 'date', description: 'Valgfritt. Bare for tidsavgrensede priser.' }),
        defineField({ name: 'itemCondition', title: 'Varetilstand', type: 'string', initialValue: 'NewCondition', options: { list: [{ title: 'Ny', value: 'NewCondition' }, { title: 'Brukt', value: 'UsedCondition' }, { title: 'Reparert', value: 'RefurbishedCondition' }] } }),
      ]
    }),
    defineField({ name: 'excerpt', title: 'Catalog description', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.required() }),
    defineField({ name: 'descriptionHeading', title: 'Description heading', type: 'string', group: 'content', initialValue: 'Built for Nordic conditions.' }),
    defineField({
      name: 'features', title: 'Features', type: 'array', group: 'content',
      of: [{ type: 'object', fields: [defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 })], preview: { select: { title: 'title', subtitle: 'text' } } }],
    }),
    defineField({
      name: 'keyStats', title: 'Key statistics', type: 'array', group: 'content', validation: (Rule) => Rule.max(4),
      of: [{ type: 'object', fields: [defineField({ name: 'value', title: 'Value', type: 'string' }), defineField({ name: 'label', title: 'Label', type: 'string' })], preview: { select: { title: 'value', subtitle: 'label' } } }],
    }),
    defineField({
      name: 'specifications', title: 'Specifications', type: 'array', group: 'content',
      of: [{ type: 'object', fields: [defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'value', title: 'Value', type: 'string' })], preview: { select: { title: 'label', subtitle: 'value' } } }],
    }),
    defineField({ name: 'primaryCta', title: 'Primary CTA — lime / black', type: 'link', group: 'content' }),
    defineField({ name: 'secondaryCta', title: 'Secondary CTA — dark / white', type: 'link', group: 'content' }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', group: 'media', options: { hotspot: true }, fields: [altField], validation: (Rule) => Rule.required() }),
    defineField({ name: 'relatedProducts', title: 'Related products', type: 'array', group: 'content', of: [{ type: 'reference', to: [{ type: 'product' }] }], validation: (Rule) => Rule.max(3) }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    defineField({ name: 'visibility', title: 'Visibility', type: 'string', group: 'visibility', options: { list: [{ title: 'Public', value: 'public' }, { title: 'Hidden', value: 'hidden' }], layout: 'radio' }, initialValue: 'public' }),
    defineField({ name: 'publishDate', title: 'Publish date', type: 'datetime', group: 'visibility' }),
    defineField({ name: 'order', title: 'Sort order', type: 'number', group: 'visibility', initialValue: 0 }),
  ],
  orderings: [{ title: 'Catalog order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'sku', media: 'heroImage' } },
})
