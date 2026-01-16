import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './schemas'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''

// Aktive datasett - legg til flere når de er opprettet i Sanity
const datasets = [
  { name: 'landstreff', title: 'Landstreff Stavanger' },
  { name: 'production', title: 'Delt (Ypsilon/Juli Vinterland)' }, // Midlertidig - fjern når separate datasett er opprettet
  // { name: 'ypsilon', title: 'Ypsilon Festivalen' },            // Uncomment når datasett er opprettet
  // { name: 'julivinterland', title: 'Juli Vinterland' }         // Uncomment når datasett er opprettet
]

const singletons = ['navigation', 'globalSettings']

export default defineConfig(
  datasets.map(({ name, title }) => ({
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
      visionTool(),
      colorInput(),
      media()
    ],
    schema: {
      types: schemaTypes
    }
  }))
)
