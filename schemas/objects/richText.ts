import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'richText',
  title: 'Rik tekst',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Overskrift 2', value: 'h2' },
        { title: 'Overskrift 3', value: 'h3' },
        { title: 'Overskrift 4', value: 'h4' },
        { title: 'Sitat', value: 'blockquote' }
      ],
      lists: [
        { title: 'Punktliste', value: 'bullet' },
        { title: 'Nummerert liste', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Fet', value: 'strong' },
          { title: 'Kursiv', value: 'em' },
          { title: 'Understreket', value: 'underline' }
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Ekstern lenke',
            fields: [
              { name: 'href', type: 'url', title: 'URL' },
              { name: 'blank', type: 'boolean', title: 'Åpne i ny fane', initialValue: false }
            ]
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Intern lenke',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Side',
                to: [
                  { type: 'page' },
                  { type: 'postType' },  // Arkivsider
                  { type: 'post' }       // Enkeltinnlegg
                ]
              }
            ]
          }
        ]
      }
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt tekst' },
        { name: 'caption', type: 'string', title: 'Bildetekst' }
      ]
    }),
    defineArrayMember({
      name: 'youtube',
      type: 'object',
      title: 'YouTube-video',
      fields: [
        { name: 'videoId', type: 'string', title: 'Video-ID' }
      ],
      preview: {
        select: { videoId: 'videoId' },
        prepare({ videoId }) {
          return {
            title: `YouTube: ${videoId}`
          }
        }
      }
    })
  ]
})
