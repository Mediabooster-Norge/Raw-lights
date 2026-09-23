import { TranslateIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'translationJob',
  title: 'Oversettelsesjobb',
  type: 'document',
  icon: TranslateIcon,
  fields: [
    defineField({ name: 'sourceDocument', title: 'Kildedokument', type: 'reference', weak: true, to: [{ type: 'page' }, { type: 'product' }, { type: 'post' }, { type: 'postType' }, { type: 'navigation' }, { type: 'form' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'sourceLanguage', title: 'Kildespråk', type: 'string', readOnly: true }),
    defineField({ name: 'targetLanguage', title: 'Målspråk', type: 'string', readOnly: true }),
    defineField({ name: 'status', title: 'Status', type: 'string', readOnly: true, options: { list: ['requested', 'processing', 'completed', 'failed', 'existing_translation'] } }),
    defineField({ name: 'targetDocument', title: 'Engelsk kladd', type: 'reference', weak: true, to: [{ type: 'page' }, { type: 'product' }, { type: 'post' }, { type: 'postType' }, { type: 'navigation' }, { type: 'form' }], readOnly: true }),
    defineField({ name: 'error', title: 'Feilmelding', type: 'text', rows: 3, readOnly: true }),
    defineField({ name: 'requestedAt', title: 'Bestilt', type: 'datetime', readOnly: true }),
    defineField({ name: 'completedAt', title: 'Fullført', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { title: 'sourceDocument.title', subtitle: 'status' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Oversettelsesjobb', subtitle }),
  },
})
