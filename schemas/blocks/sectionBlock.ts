import { StackIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'
import { appearanceGroup, contentGroup } from '../studio/groups'

export default defineType({
  name: 'sectionBlock',
  title: 'Gruppe',
  type: 'object',
  icon: StackIcon,
  description: 'Grupper flere blokker med felles bakgrunn og avstand',
  groups: [contentGroup, appearanceGroup],
  fields: [
    defineField({
      name: 'children',
      title: 'Blokker',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'textBlock' }),
        defineArrayMember({ type: 'ctaBlock' }),
        defineArrayMember({ type: 'galleryBlock' }),
        defineArrayMember({ type: 'spacerBlock' }),
        defineArrayMember({ type: 'accordionBlock' }),
        defineArrayMember({ type: 'marqueeBlock' }),
        defineArrayMember({ type: 'mediaTextBlock' }),
        defineArrayMember({ type: 'postGridBlock' }),
        defineArrayMember({ type: 'formBlock' })
        ,defineArrayMember({ type: 'rawFillStatement' })
        ,defineArrayMember({ type: 'rawProductFamilies' })
        ,defineArrayMember({ type: 'rawRules' })
      ]
    }),
    defineField({
      name: 'background',
      title: 'Bakgrunn',
      type: 'string',
      group: 'appearance',
      options: {
        list: [
          { title: 'Transparent', value: 'transparent' },
          { title: 'Bakgrunn', value: 'background' },
          { title: 'Overflate', value: 'surface' },
          { title: 'Primær', value: 'primary' },
          { title: 'Sekundær', value: 'secondary' }
        ]
      },
      initialValue: 'background'
    }),
    defineField({
      name: 'spacing',
      title: 'Avstand',
      type: 'string',
      group: 'appearance',
      options: {
        list: [
          { title: 'Ingen', value: 'none' },
          { title: 'Liten', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Stor', value: 'large' },
          { title: 'Ekstra stor', value: 'xlarge' }
        ]
      },
      initialValue: 'medium'
    })
  ],
  preview: {
    select: {
      children: 'children',
      background: 'background'
    },
    prepare({ children, background }) {
      return {
        title: 'Gruppe',
        subtitle: `${children?.length ?? 0} blokker • ${background ?? 'standard'} bakgrunn`
      }
    }
  }
})
