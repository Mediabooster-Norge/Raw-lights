import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'postType',
  title: 'Posttype',
  type: 'document',
  icon: () => '📁',
  groups: [
    { name: 'general', title: 'Generelt', default: true },
    { name: 'archive', title: 'Arkivside' },
    { name: 'single', title: 'Enkeltvisning' }
  ],
  fields: [
    // General fields
    defineField({
      name: 'title',
      title: 'Navn (flertall)',
      type: 'string',
      description: 'F.eks. "Artister", "Nyheter", "Sponsorer"',
      validation: Rule => Rule.required(),
      group: 'general'
    }),
    defineField({
      name: 'singularTitle',
      title: 'Navn (entall)',
      type: 'string',
      description: 'F.eks. "Artist", "Nyhet", "Sponsor"',
      validation: Rule => Rule.required(),
      group: 'general'
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      description: 'Brukes i URL: /artister, /nyheter, etc.',
      validation: Rule => Rule.required(),
      group: 'general'
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 2,
      description: 'Kort beskrivelse av denne posttypen (vises i Sanity Studio)',
      group: 'general'
    }),
    defineField({
      name: 'hasArchive',
      title: 'Har arkivside',
      type: 'boolean',
      description: 'Vis en liste over alle innlegg av denne typen',
      initialValue: true,
      group: 'general'
    }),
    defineField({
      name: 'hasSingleView',
      title: 'Har enkeltvisning',
      type: 'boolean',
      description: 'Hvert innlegg får sin egen side',
      initialValue: true,
      group: 'general'
    }),
    
    // Archive settings
    defineField({
      name: 'archiveLayout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (kort)', value: 'grid' },
          { title: 'Liste', value: 'list' },
          { title: 'Masonry', value: 'masonry' }
        ],
        layout: 'radio'
      },
      initialValue: 'grid',
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
    }),
    defineField({
      name: 'archiveColumns',
      title: 'Antall kolonner (grid)',
      type: 'number',
      options: {
        list: [2, 3, 4]
      },
      initialValue: 3,
      hidden: ({ parent }) => !parent?.hasArchive || parent?.archiveLayout !== 'grid',
      group: 'archive'
    }),
    defineField({
      name: 'archiveTitle',
      title: 'Overskrift',
      type: 'string',
      description: 'Overskrift på arkivsiden (standard: posttype-navn)',
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
    }),
    defineField({
      name: 'archiveTitleColor',
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
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
    }),
    defineField({
      name: 'archiveDescription',
      title: 'Beskrivelse',
      type: 'text',
      rows: 2,
      description: 'Intro-tekst på arkivsiden',
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
    }),
    defineField({
      name: 'archiveDescriptionColor',
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
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Vis utdrag',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
    }),
    defineField({
      name: 'showImage',
      title: 'Vis bilde',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
    }),
    defineField({
      name: 'showDate',
      title: 'Vis dato',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
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
      hidden: ({ parent }) => !parent?.hasArchive,
      group: 'archive'
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
      hidden: ({ parent }) => !parent?.hasArchive || !parent?.showExcerpt,
      group: 'archive'
    }),
    
    // Single view settings
    defineField({
      name: 'singleTitleColor',
      title: 'Tittel farge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'primary',
      hidden: ({ parent }) => !parent?.hasSingleView,
      group: 'single'
    }),
    defineField({
      name: 'singleExcerptColor',
      title: 'Utdrag farge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'secondary',
      hidden: ({ parent }) => !parent?.hasSingleView,
      group: 'single'
    }),
    defineField({
      name: 'singleContentColor',
      title: 'Brødtekst farge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'primary',
      hidden: ({ parent }) => !parent?.hasSingleView,
      group: 'single'
    }),
    defineField({
      name: 'singleDateColor',
      title: 'Dato farge',
      type: 'string',
      options: {
        list: [
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ],
        layout: 'radio'
      },
      initialValue: 'secondary',
      hidden: ({ parent }) => !parent?.hasSingleView,
      group: 'single'
    })
  ],
  preview: {
    select: {
      title: 'title',
      singular: 'singularTitle',
      slug: 'slug.current'
    },
    prepare({ title, singular, slug }) {
      return {
        title: title ?? 'Ny posttype',
        subtitle: `/${slug} • Entall: ${singular}`
      }
    }
  }
})
