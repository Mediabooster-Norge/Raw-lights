import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './schemas'
import { resolve } from './lib/sanity/presentation'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''

// Site configs - maps dataset to preview URL
// In development, we use localhost with site parameter since subdomains don't work
const siteConfigs: Record<string, { previewUrl: string; title: string; site: string }> = {
  landstreff: {
    previewUrl: process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://landstreff.${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000',
    site: 'landstreff',
    title: 'Landstreff Stavanger'
  },
  production: {
    previewUrl: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000',
    site: 'production',
    title: 'Delt (Ypsilon/Juli Vinterland)'
  },
  // Uncomment når datasett er opprettet:
  // ypsilon: {
  //   previewUrl: process.env.NEXT_PUBLIC_VERCEL_URL
  //     ? `https://ypsilon.${process.env.NEXT_PUBLIC_VERCEL_URL}`
  //     : 'http://localhost:3000',
  //   site: 'ypsilon',
  //   title: 'Ypsilon Festivalen'
  // },
}

// Aktive datasett - legg til flere når de er opprettet i Sanity
const datasets = Object.entries(siteConfigs).map(([name, config]) => ({
  name,
  title: config.title,
  previewUrl: config.previewUrl,
  site: config.site
}))

const singletons = ['navigation', 'globalSettings']

export default defineConfig(
  datasets.map(({ name, title, previewUrl, site }) => ({
    name,
    title,
    projectId: PROJECT_ID,
    dataset: name,
    basePath: `/studio/${name}`,
    plugins: [
      structureTool({
        structure: (S, context) => {
          const singletonItems = singletons.map((type) =>
            S.listItem()
              .title(type === 'navigation' ? 'Navigasjon' : 'Globale innstillinger')
              .id(type)
              .child(
                S.document()
                  .schemaType(type)
                  .documentId(type)
              )
          )

          // Innlegg gruppert etter posttype
          const postsListItem = S.listItem()
            .title('Innlegg')
            .id('posts')
            .icon(() => '📄')
            .child(
              S.documentTypeList('postType')
                .title('Velg posttype')
                .child((postTypeId) =>
                  S.documentList()
                    .title('Innlegg')
                    .filter('_type == "post" && postType._ref == $postTypeId')
                    .params({ postTypeId })
                    .defaultOrdering([
                      { field: 'order', direction: 'asc' },
                      { field: 'publishDate', direction: 'desc' }
                    ])
                )
            )

          // Posttyper administrasjon
          const postTypesListItem = S.listItem()
            .title('Posttyper')
            .id('postTypes')
            .icon(() => '📋')
            .child(
              S.documentTypeList('postType')
                .title('Posttyper')
            )

          // Andre dokumenttyper (ekskluder singletons, post og postType)
          const otherDocumentItems = S.documentTypeListItems()
            .filter((item) => {
              const id = item.getId() ?? ''
              return !singletons.includes(id) && !['post', 'postType'].includes(id)
            })

          return S.list()
            .title('Innhold')
            .items([
              ...singletonItems,
              S.divider(),
              postsListItem,
              postTypesListItem,
              S.divider(),
              ...otherDocumentItems
            ])
        }
      }),
      presentationTool({
        previewUrl: `${previewUrl}/api/draft?site=${site}&redirect=/`,
        resolve
      }),
      visionTool(),
      colorInput(),
      media()
    ],
    schema: {
      types: schemaTypes
    }
  }))
)
