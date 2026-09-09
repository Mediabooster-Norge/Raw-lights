import { ThLargeIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { appearanceGroup, contentGroup, displayGroup } from '../studio/groups'

export default defineType({
  name: 'postGridBlock',
  title: 'Innlegg-visning',
  type: 'object',
  icon: ThLargeIcon,
  groups: [contentGroup, displayGroup, appearanceGroup],
  fields: [
    // Content
    defineField({
      name: 'postType',
      title: 'Posttype',
      type: 'reference',
      to: [{ type: 'postType' }],
      validation: Rule => Rule.required(),
      description: 'Velg hvilken posttype som skal vises',
      group: 'content'
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      description: 'Overskrift over innleggene (valgfritt)',
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
      hidden: ({ parent }) => !parent?.heading,
      group: 'content'
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 2,
      description: 'Kort intro-tekst (valgfritt)',
      group: 'content'
    }),
    defineField({
      name: 'descriptionColor',
      title: 'Beskrivelsefarge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'secondary',
      hidden: ({ parent }) => !parent?.description,
      group: 'content'
    }),
    defineField({
      name: 'showAllLink',
      title: 'Vis "Se alle"-lenke',
      type: 'boolean',
      initialValue: true,
      group: 'content'
    }),
    defineField({
      name: 'showAllText',
      title: '"Se alle"-tekst',
      type: 'string',
      initialValue: 'Se alle',
      hidden: ({ parent }) => !parent?.showAllLink,
      group: 'content'
    }),
    
    // Display settings
    defineField({
      name: 'layout',
      title: 'Visningstype',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Karusell', value: 'carousel' },
          { title: 'Liste', value: 'list' },
          { title: 'Fremhevet (stor + små)', value: 'featured' }
        ],
        layout: 'radio'
      },
      initialValue: 'grid',
      group: 'display'
    }),
    defineField({
      name: 'columns',
      title: 'Kolonner',
      type: 'number',
      options: {
        list: [2, 3, 4]
      },
      initialValue: 3,
      hidden: ({ parent }) => parent?.layout !== 'grid',
      group: 'display'
    }),
    defineField({
      name: 'limit',
      title: 'Antall innlegg',
      type: 'number',
      options: {
        list: [
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '6', value: 6 },
          { title: '8', value: 8 },
          { title: '12', value: 12 },
          { title: 'Alle', value: 100 }
        ]
      },
      initialValue: 6,
      group: 'display'
    }),
    defineField({
      name: 'showImage',
      title: 'Vis bilder',
      type: 'boolean',
      initialValue: true,
      group: 'display'
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Vis utdrag',
      type: 'boolean',
      initialValue: true,
      group: 'display'
    }),
    defineField({
      name: 'showDate',
      title: 'Vis dato',
      type: 'boolean',
      initialValue: false,
      group: 'display'
    }),
    defineField({
      name: 'cardTitleColor',
      title: 'Kort-tittel farge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'primary',
      group: 'display'
    }),
    defineField({
      name: 'cardExcerptColor',
      title: 'Kort-utdrag farge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'secondary',
      hidden: ({ parent }) => !parent?.showExcerpt,
      group: 'display'
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
      title: 'Avstand (padding)',
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
      postTypeTitle: 'postType.title',
      heading: 'heading',
      layout: 'layout',
      limit: 'limit'
    },
    prepare({ postTypeTitle, heading, layout, limit }) {
      const layoutLabels: Record<string, string> = {
        grid: 'Grid',
        carousel: 'Karusell',
        list: 'Liste',
        featured: 'Fremhevet'
      }
      return {
        title: heading ?? `${postTypeTitle ?? 'Innlegg'}-visning`,
        subtitle: `${layoutLabels[layout] ?? 'Grid'} • ${limit ?? 6} innlegg`
      }
    }
  }
})
