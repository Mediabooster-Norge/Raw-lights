import { MenuIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'
import { footerGroup, headerGroup, socialGroup } from '../studio/groups'

const navLinkFields = [
  defineField({ name: 'label', title: 'Tekst', type: 'string' }),
  defineField({ name: 'link', title: 'Lenke', type: 'link' }),
]

export default defineType({
  name: 'navigation',
  title: 'Navigasjon',
  type: 'document',
  icon: MenuIcon,
  groups: [headerGroup, footerGroup, socialGroup],
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Hovedmeny',
      type: 'array',
      group: 'header',
      of: [{
        type: 'object',
        fields: [
          ...navLinkFields,
          defineField({
            name: 'children',
            title: 'Undermeny',
            type: 'array',
            of: [{
              type: 'object',
              fields: navLinkFields,
              preview: {
                select: { title: 'label' },
                prepare({ title }) {
                  return { title: title || 'Undermenypunkt' }
                }
              }
            }]
          })
        ],
        preview: {
          select: { title: 'label', childCount: 'children' },
          prepare({ title, childCount }) {
            const count = Array.isArray(childCount) ? childCount.length : 0
            return {
              title: title || 'Menypunkt',
              subtitle: count ? `${count} underpunkter` : undefined
            }
          }
        }
      }]
    }),
    defineField({
      name: 'headerCta',
      title: 'Header CTA',
      type: 'object',
      group: 'header',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'link', title: 'Lenke', type: 'link' }),
        defineField({
          name: 'variant',
          title: 'Variant',
          type: 'string',
          options: { list: ['primary', 'secondary'] },
          initialValue: 'primary'
        })
      ]
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer navigasjon',
      type: 'array',
      group: 'footer',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Tittel', type: 'string' }),
          defineField({
            name: 'links',
            title: 'Lenker',
            type: 'array',
            of: [{ type: 'link' }]
          })
        ],
        preview: {
          select: { title: 'title', links: 'links' },
          prepare({ title, links }) {
            const count = Array.isArray(links) ? links.length : 0
            return {
              title: title || 'Kolonne',
              subtitle: `${count} lenker`
            }
          }
        }
      }]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Sosiale medier',
      type: 'array',
      group: 'social',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'platform',
            title: 'Plattform',
            type: 'string',
            options: {
              list: ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin']
            }
          }),
          defineField({ name: 'url', title: 'URL', type: 'url' })
        ],
        preview: {
          select: { title: 'platform', subtitle: 'url' },
          prepare({ title, subtitle }) {
            return {
              title: title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Plattform',
              subtitle
            }
          }
        }
      }]
    })
  ],
  preview: {
    prepare() {
      return { title: 'Navigasjon' }
    }
  }
})
