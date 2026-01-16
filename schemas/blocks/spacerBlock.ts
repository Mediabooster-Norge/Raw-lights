import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'spacerBlock',
  title: 'Mellomrom',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      title: 'Størrelse',
      type: 'string',
      options: {
        list: [
          { title: 'Liten', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Stor', value: 'lg' },
          { title: 'Ekstra stor', value: 'xl' }
        ]
      },
      initialValue: 'md'
    })
  ],
  preview: {
    select: { size: 'size' },
    prepare({ size }) {
      return {
        title: 'Mellomrom',
        subtitle: `Størrelse: ${size ?? 'md'}`
      }
    }
  }
})
