import { SparklesIcon, UlistIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { altField } from '../helpers/altField'

const image = (name: string, title: string) => defineField({ name, title, type: 'image', options: { hotspot: true }, fields: [altField] })
const animation = defineField({ name: 'animate', title: 'Enable RAW animation', type: 'boolean', initialValue: true })
const link = (name: string, title: string) => defineField({ name, title, type: 'link' })

export const rawStoryHero = defineType({
  name: 'rawStoryHero', title: 'RAW story hero', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'headingLines', title: 'Heading lines', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.required().min(1).max(2) }), defineField({ name: 'layout', title: 'Hero layout', type: 'string', options: { list: [{ title: 'Story', value: 'story' }, { title: 'About', value: 'about' }] }, initialValue: 'story' }), defineField({ name: 'chapter', title: 'Chapter label', type: 'string', hidden: ({ parent }) => parent?.layout === 'about' }), defineField({ name: 'chapterTitle', title: 'Chapter title', type: 'string', hidden: ({ parent }) => parent?.layout === 'about' }), defineField({ name: 'aside', title: 'Aside text', type: 'text', rows: 2, hidden: ({ parent }) => parent?.layout === 'about' }), defineField({ name: 'showChapters', title: 'Show story chapter navigation', type: 'boolean', initialValue: false, hidden: ({ parent }) => parent?.layout === 'about' }), image('image', 'Background image'), animation],
  preview: { select: { title: 'chapterTitle', media: 'image' }, prepare: ({ title, media }) => ({ title: title || 'RAW story hero', media }) },
})

export const rawFillStatement = defineType({
  name: 'rawFillStatement', title: 'RAW scroll statement', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 3, validation: (Rule) => Rule.required() }), defineField({ name: 'text', title: 'Supporting text', type: 'text', rows: 4 }), animation],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'RAW scroll statement' }) },
})

export const rawPinnedStories = defineType({
  name: 'rawPinnedStories', title: 'RAW pinned stories', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'slides', title: 'Slides', type: 'array', validation: (Rule) => Rule.min(2).max(5), of: [{ type: 'object', fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }), image('image', 'Background image')], preview: { select: { title: 'title', media: 'image' } } }] }), animation],
  preview: { select: { slides: 'slides' }, prepare: ({ slides }) => ({ title: 'RAW pinned stories', subtitle: `${slides?.length || 0} slides` }) },
})

export const rawProductSpotlight = defineType({
  name: 'rawProductSpotlight', title: 'RAW product spotlight', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }], validation: (Rule) => Rule.required() }), defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading override', type: 'string' }), defineField({ name: 'text', title: 'Text override', type: 'text', rows: 4 })],
  preview: { select: { title: 'product.title' }, prepare: ({ title }) => ({ title: title || 'RAW product spotlight' }) },
})

export const rawStats = defineType({
  name: 'rawStats', title: 'RAW pinned statistics', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'stats', title: 'Statistics', type: 'array', validation: (Rule) => Rule.min(2).max(4), of: [{ type: 'object', fields: [defineField({ name: 'value', title: 'Value', type: 'string' }), defineField({ name: 'label', title: 'Label', type: 'string' })], preview: { select: { title: 'value', subtitle: 'label' } } }] }), animation],
  preview: { prepare: () => ({ title: 'RAW pinned statistics' }) },
})

export const rawProductFamilies = defineType({
  name: 'rawProductFamilies', title: 'RAW product families', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string' }), defineField({ name: 'text', title: 'Intro', type: 'text', rows: 2 }), defineField({ name: 'items', title: 'Families', type: 'array', validation: (Rule) => Rule.min(1).max(4), of: [{ type: 'object', fields: [defineField({ name: 'kicker', title: 'Kicker', type: 'string' }), defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }), image('image', 'Image'), link('link', 'Link')], preview: { select: { title: 'title', media: 'image' } } }] })],
  preview: { prepare: () => ({ title: 'RAW product families' }) },
})

export const rawRules = defineType({
  name: 'rawRules', title: 'RAW rules grid', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string' }), defineField({ name: 'text', title: 'Intro', type: 'text', rows: 2 }), defineField({ name: 'items', title: 'Rules', type: 'array', validation: (Rule) => Rule.min(2).max(4), of: [{ type: 'object', fields: [defineField({ name: 'kicker', title: 'Kicker', type: 'string' }), defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 })], preview: { select: { title: 'title', subtitle: 'kicker' } } }] })],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'RAW rules grid' }) },
})

export const rawTimeline = defineType({
  name: 'rawTimeline', title: 'RAW origin timeline', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'items', title: 'Beats', type: 'array', validation: (Rule) => Rule.min(1), of: [{ type: 'object', fields: [defineField({ name: 'index', title: 'Index', type: 'string' }), defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 4 }), image('image', 'Image')], preview: { select: { title: 'title', media: 'image' } } }] })],
  preview: { prepare: () => ({ title: 'RAW origin timeline' }) },
})

export const rawBeamSection = defineType({
  name: 'rawBeamSection', title: 'RAW beam feature', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 4 }), image('image', 'Beam image')],
  preview: { select: { title: 'heading', media: 'image' }, prepare: ({ title, media }) => ({ title: title || 'RAW beam feature', media }) },
})

export const rawFinale = defineType({
  name: 'rawFinale', title: 'RAW finale CTA', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }), link('primaryCta', 'Primary CTA — lime / black'), link('secondaryCta', 'Secondary CTA — dark / white')],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'RAW finale CTA' }) },
})

export const rawContactInfo = defineType({
  name: 'rawContactInfo', title: 'RAW contact introduction', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string' }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }), defineField({ name: 'phone', title: 'Phone', type: 'string' }), defineField({ name: 'email', title: 'Email', type: 'string' })],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'RAW contact introduction' }) },
})

export const rawContactForm = defineType({
  name: 'rawContactForm', title: 'RAW contact form', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'heading', title: 'Heading', type: 'string' }), defineField({ name: 'form', title: 'Form', type: 'reference', to: [{ type: 'form' }], validation: (Rule) => Rule.required() })],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'RAW contact form' }) },
})

export const rawReseller = defineType({
  name: 'rawReseller', title: 'RAW reseller callout', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string' }), defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }), link('cta', 'CTA')],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'RAW reseller callout' }) },
})

export const rawFaq = defineType({
  name: 'rawFaq', title: 'RAW FAQ', type: 'object', icon: UlistIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'text', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'items', title: 'Questions', type: 'array', validation: (Rule) => Rule.required().min(1),
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'answer', title: 'Answer', type: 'richText', validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'question' } },
      }],
    }),
  ],
  preview: { select: { title: 'heading', items: 'items' }, prepare: ({ title, items }) => ({ title: title || 'RAW FAQ', subtitle: `${items?.length || 0} questions` }) },
})

export const productCatalogBlock = defineType({
  name: 'productCatalogBlock', title: 'RAW product catalog', type: 'object', icon: SparklesIcon,
  fields: [defineField({ name: 'showFilters', title: 'Show category filters', type: 'boolean', initialValue: true })],
  preview: { prepare: () => ({ title: 'RAW product catalog' }) },
})
