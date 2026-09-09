import { defineField } from 'sanity'

export const altField = defineField({
  name: 'alt',
  title: 'Alt-tekst',
  type: 'string',
  validation: (Rule) =>
    Rule.custom((value) =>
      typeof value === 'string' && value.trim()
        ? true
        : 'Legg til alt-tekst for tilgjengelighet'
    ).warning(),
})
