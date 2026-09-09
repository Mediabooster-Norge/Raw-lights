import { DocumentTextIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { contentGroup } from '../studio/groups'
import { languageField } from '../helpers/languageField'

const fieldTypeList = [
  { title: 'Tekst', value: 'text' },
  { title: 'E-post', value: 'email' },
  { title: 'Telefon', value: 'tel' },
  { title: 'Tekstområde', value: 'textarea' },
  { title: 'Nedtrekksmeny', value: 'select' },
  { title: 'Avkrysning', value: 'checkbox' },
]

export default defineType({
  name: 'form',
  title: 'Skjema',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [contentGroup],
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Navn',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Send-knapp',
      type: 'string',
      initialValue: 'Send',
      group: 'content',
    }),
    defineField({
      name: 'successMessage',
      title: 'Bekreftelse',
      type: 'text',
      rows: 2,
      initialValue: 'Takk for din henvendelse!',
      group: 'content',
    }),
    defineField({
      name: 'notifyEmail',
      title: 'Varsle e-post',
      type: 'string',
      description: 'Overstyrer FORM_TO_EMAIL for dette skjemaet.',
      group: 'content',
    }),
    defineField({
      name: 'fields',
      title: 'Felter',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Feltnavn',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Ledetekst',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'fieldType',
              title: 'Type',
              type: 'string',
              options: { list: fieldTypeList },
              initialValue: 'text',
            }),
            defineField({
              name: 'placeholder',
              title: 'Plassholder',
              type: 'string',
            }),
            defineField({
              name: 'required',
              title: 'Påkrevd',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'options',
              title: 'Valg',
              type: 'array',
              hidden: ({ parent }) => parent?.fieldType !== 'select',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Tekst', type: 'string' }),
                    defineField({ name: 'value', title: 'Verdi', type: 'string' }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'fieldType' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
