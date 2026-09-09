import { defineField } from 'sanity'

export const languageField = defineField({
  name: 'language',
  title: 'Språk',
  type: 'string',
  readOnly: true,
  hidden: true,
})
