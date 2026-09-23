import { DocumentTextIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { appearanceGroup, contentGroup } from '../studio/groups'

export default defineType({
  name: 'formBlock',
  title: 'Skjema',
  type: 'object',
  icon: DocumentTextIcon,
  groups: [contentGroup, appearanceGroup],
  fields: [
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'form',
      title: 'Skjema',
      type: 'reference',
      weak: true,
      to: [{ type: 'form' }],
      validation: (Rule) => Rule.required(),
      group: 'content',
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
          { title: 'Sekundær', value: 'secondary' },
        ],
      },
      initialValue: 'transparent',
      group: 'appearance',
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
          { title: 'Ekstra stor', value: 'xlarge' },
        ],
      },
      initialValue: 'medium',
      group: 'appearance',
    }),
  ],
  preview: {
    select: { title: 'heading', formTitle: 'form.title' },
    prepare({ title, formTitle }) {
      return {
        title: title || formTitle || 'Skjema',
        subtitle: 'Skjemablokk',
      }
    },
  },
})
