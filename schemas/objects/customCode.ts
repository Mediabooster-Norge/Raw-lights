import { CodeIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

const BLOCKED_PATTERNS = [
  /<script[^>]+src=["']http:\/\//i,
  /<iframe/i,
  /javascript:/i,
  /eval\(/i,
  /document\.write/i
]

function validateScript(value: string | undefined) {
  if (!value) return true

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(value)) {
      return `Blokkert mønster funnet: ${pattern.toString()}`
    }
  }

  return true
}

export default defineType({
  name: 'customCode',
  title: 'Egendefinert kode',
  type: 'object',
  icon: CodeIcon,
  description: 'Kun administratorer skal kunne redigere dette',
  groups: [
    { name: 'head', title: 'Head', default: true, icon: CodeIcon },
    { name: 'body', title: 'Body', icon: CodeIcon }
  ],
  fields: [
    defineField({
      name: 'headScripts',
      title: 'Head scripts',
      type: 'text',
      description: 'Scripts som legges i <head> (f.eks. analytics)',
      rows: 5,
      validation: (Rule) => Rule.custom(validateScript),
      group: 'head'
    }),
    defineField({
      name: 'bodyStartScripts',
      title: 'Body start scripts',
      type: 'text',
      description: 'Scripts som legges rett etter <body>',
      rows: 5,
      validation: (Rule) => Rule.custom(validateScript),
      group: 'body'
    }),
    defineField({
      name: 'footerScripts',
      title: 'Footer scripts',
      type: 'text',
      description: 'Scripts som legges før </body>',
      rows: 5,
      validation: (Rule) => Rule.custom(validateScript),
      group: 'body'
    })
  ]
})
