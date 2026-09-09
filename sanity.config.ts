import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { media } from 'sanity-plugin-media'
import { ComposeIcon } from '@sanity/icons'
import { schemaTypes } from './schemas'
import { resolve } from './lib/sanity/presentation'
import { structure } from './lib/sanity/structure'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const PREVIEW_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

const SINGLETON_TYPES = new Set(['globalSettings', 'navigation'])

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
      previewUrl: `${PREVIEW_URL}/api/draft?redirect=/`,
      resolve
    }),
    visionTool(),
    colorInput(),
    media()
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType))
  }
})
