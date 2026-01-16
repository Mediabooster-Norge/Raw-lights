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
  description: 'Kun administratorer skal kunne redigere dette',
  fields: [
    defineField({
      name: 'headScripts',
      title: 'Head scripts',
      type: 'text',
      description: 'Scripts som legges i <head> (f.eks. analytics)',
      rows: 5,
      validation: (Rule) => Rule.custom(validateScript)
    }),
    defineField({
      name: 'bodyStartScripts',
      title: 'Body start scripts',
      type: 'text',
      description: 'Scripts som legges rett etter <body>',
      rows: 5,
      validation: (Rule) => Rule.custom(validateScript)
    }),
    defineField({
      name: 'footerScripts',
      title: 'Footer scripts',
      type: 'text',
      description: 'Scripts som legges før </body>',
      rows: 5,
      validation: (Rule) => Rule.custom(validateScript)
    })
  ]
})
