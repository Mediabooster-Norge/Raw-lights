import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { media } from 'sanity-plugin-media'
import { documentInternationalization } from '@sanity/document-internationalization'
import { ComposeIcon } from '@sanity/icons'
import { getSanityConfig } from './lib/sanity/client'
import { getSiteUrl } from './lib/utils/getSiteUrl'
import { schemaTypes } from './schemas'
import { resolve } from './lib/sanity/presentation'
import { structure } from './lib/sanity/structure'

const { projectId: PROJECT_ID, dataset: DATASET } = getSanityConfig()
const PREVIEW_URL = getSiteUrl()

const SINGLETON_TYPES = new Set(['globalSettings'])
const TRANSLATED_TYPES = ['page', 'post', 'postType', 'navigation', 'form']

export default defineConfig({
  name: 'default',
  title: 'CMS',
  icon: ComposeIcon,
  projectId: PROJECT_ID,
  dataset: DATASET,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure
    }),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_URL,
        previewMode: {
          enable: '/api/draft',
        },
      },
      resolve
    }),
    visionTool(),
    colorInput(),
    media(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'nb', title: 'Norsk' },
        { id: 'en', title: 'English' },
      ],
      schemaTypes: TRANSLATED_TYPES,
      languageField: 'language',
      weakReferences: true,
      allowCreateMetaDoc: true,
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType))
  },
  document: {
    actions: (prev, context) => {
      if (SINGLETON_TYPES.has(context.schemaType)) {
        return prev.filter((action) => {
          const name = action.action
          return !name || !['delete', 'duplicate', 'unpublish'].includes(name)
        })
      }
      return prev
    },
  },
})
