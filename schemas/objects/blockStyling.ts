import { defineType, defineField } from 'sanity'

// Gjenbrukbare styling-felter for alle blokker
export const blockStylingFields = [
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
    group: 'styling'
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
    group: 'styling'
  }),
  defineField({
    name: 'containerWidth',
    title: 'Bredde',
    type: 'string',
    options: {
      list: [
        { title: 'Full bredde', value: 'full' },
        { title: 'Container', value: 'container' }
      ],
      layout: 'radio'
    },
    initialValue: 'container',
    group: 'styling'
  })
]

// Styling group for field groups
export const stylingGroup = {
  name: 'styling',
  title: 'Styling',
  default: false
}

export default defineType({
  name: 'blockStyling',
  title: 'Blokk Styling',
  type: 'object',
  fields: blockStylingFields
})
