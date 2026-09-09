import { SplitHorizontalIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { appearanceGroup, contentGroup, mediaGroup } from '../studio/groups'
import { altField } from '../helpers/altField'

export default defineType({
  name: 'mediaTextBlock',
  title: 'Media & Tekst',
  type: 'object',
  icon: SplitHorizontalIcon,
  groups: [contentGroup, mediaGroup, appearanceGroup],
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Tekst venstre - Media høyre', value: 'text-left' },
          { title: 'Tekst høyre - Media venstre', value: 'text-right' },
          { title: 'Sentrert (tekst over, media under)', value: 'centered' }
        ],
        layout: 'radio'
      },
      initialValue: 'text-left',
      group: 'content'
    }),
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
      name: 'subheading',
      title: 'Underoverskrift',
      type: 'string',
      group: 'content'
    }),
    defineField({
      name: 'subheadingColor',
      title: 'Underoverskriftfarge',
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
      name: 'content',
      title: 'Brødtekst',
      type: 'richText',
      group: 'content'
    }),
    defineField({
      name: 'contentColor',
      title: 'Brødtekstfarge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'secondary',
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
    // Media
    defineField({
      name: 'mediaType',
      title: 'Mediatype',
      type: 'string',
      options: {
        list: [
          { title: 'Bilde', value: 'image' },
          { title: 'Video', value: 'video' }
        ],
        layout: 'radio'
      },
      initialValue: 'image',
      group: 'media'
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: { hotspot: true },
      fields: [
        altField
      ],
      hidden: ({ parent }) => parent?.mediaType === 'video',
      group: 'media'
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      group: 'media'
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video poster (fallback-bilde)',
      type: 'image',
      options: { hotspot: true },
      fields: [altField],
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      group: 'media'
    }),
    defineField({
      name: 'videoAutoplay',
      title: 'Autoplay video',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      group: 'media'
    }),
    defineField({
      name: 'videoLoop',
      title: 'Loop video',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      group: 'media'
    }),
    defineField({
      name: 'verticalAlign',
      title: 'Vertikal justering',
      type: 'string',
      options: {
        list: [
          { title: 'Topp', value: 'start' },
          { title: 'Senter', value: 'center' },
          { title: 'Bunn', value: 'end' }
        ]
      },
      initialValue: 'center',
      hidden: ({ parent }) => parent?.layout === 'centered',
      group: 'media'
    }),
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
      group: 'appearance'
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
      group: 'appearance'
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      layout: 'layout',
      mediaType: 'mediaType',
      media: 'image'
    },
    prepare({ title, layout, mediaType, media }) {
      const layoutLabels: Record<string, string> = {
        'text-left': 'Tekst venstre',
        'text-right': 'Tekst høyre',
        'centered': 'Sentrert'
      }
      return {
        title: title ?? 'Media & Tekst',
        subtitle: `${layoutLabels[layout] ?? layout} • ${mediaType === 'video' ? 'Video' : 'Bilde'}`,
        media
      }
    }
  }
})
