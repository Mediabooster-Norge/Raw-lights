import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './schemas'
import { resolve } from './lib/sanity/presentation'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const IS_MULTISITE = process.env.NEXT_PUBLIC_MULTISITE_ENABLED === 'true'

// Preview URL for Sanity Studio presentation
const PREVIEW_URL = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

// Singletons som ikke skal vises i dokumentlisten
const singletonTypes = IS_MULTISITE ? [] : ['navigation', 'globalSettings']

/**
 * Single-site Studio Structure
 * Enkel struktur uten site-gruppering
 */
function getSingleSiteStructure(S: any) {
  // Innlegg gruppert etter posttype
  const postsListItem = S.listItem()
    .title('Innlegg')
    .id('posts')
    .icon(() => '📄')
    .child(
      S.documentTypeList('postType')
        .title('Velg posttype')
        .child((postTypeId: string) =>
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

  return S.list()
    .title('Innhold')
    .items([
      // Singletons
      S.listItem()
        .title('Navigasjon')
        .id('navigation')
        .child(
          S.document()
            .schemaType('navigation')
            .documentId('navigation')
        ),
      S.listItem()
        .title('Globale innstillinger')
        .id('globalSettings')
        .child(
          S.document()
            .schemaType('globalSettings')
            .documentId('globalSettings')
        ),
      S.divider(),
      // Sider
      S.listItem()
        .title('Sider')
        .id('pages')
        .icon(() => '📄')
        .child(S.documentTypeList('page').title('Sider')),
      postsListItem,
      postTypesListItem,
      S.divider(),
      // Redirects
      S.listItem()
        .title('Redirects')
        .id('redirects')
        .icon(() => '↪️')
        .child(S.documentTypeList('redirect').title('Redirects')),
    ])
}

/**
 * Multisite Studio Structure
 * Innhold gruppert etter nettsted
 */
function getMultisiteStructure(S: any) {
  // Nettsted-administrasjon
  const sitesListItem = S.listItem()
    .title('Nettsteder')
    .id('sites')
    .icon(() => '🌐')
    .child(
      S.documentTypeList('site')
        .title('Nettsteder')
    )
  
  // Navigasjon gruppert etter nettsted
  const navigationListItem = S.listItem()
    .title('Navigasjon')
    .id('navigation')
    .icon(() => '🧭')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId: string) =>
          S.documentList()
            .title('Navigasjon')
            .filter('_type == "navigation" && site._ref == $siteId')
            .params({ siteId })
        )
    )

  // Globale innstillinger gruppert etter nettsted
  const globalSettingsListItem = S.listItem()
    .title('Globale innstillinger')
    .id('globalSettings')
    .icon(() => '⚙️')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId: string) =>
          S.documentList()
            .title('Innstillinger')
            .filter('_type == "globalSettings" && site._ref == $siteId')
            .params({ siteId })
        )
    )

  // Sider gruppert etter nettsted
  const pagesListItem = S.listItem()
    .title('Sider')
    .id('pages')
    .icon(() => '📄')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId: string) =>
          S.documentList()
            .title('Sider')
            .filter('_type == "page" && site._ref == $siteId')
            .params({ siteId })
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        )
    )

  // Innlegg gruppert etter nettsted -> posttype
  const postsListItem = S.listItem()
    .title('Innlegg')
    .id('posts')
    .icon(() => '📝')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId: string) =>
          S.list()
            .title('Posttyper')
            .items([
              S.listItem()
                .title('Alle innlegg')
                .child(
                  S.documentList()
                    .title('Alle innlegg')
                    .filter('_type == "post" && site._ref == $siteId')
                    .params({ siteId })
                    .defaultOrdering([
                      { field: 'order', direction: 'asc' },
                      { field: 'publishDate', direction: 'desc' }
                    ])
                ),
              S.divider(),
              S.listItem()
                .title('Etter posttype')
                .child(
                  S.documentList()
                    .title('Velg posttype')
                    .filter('_type == "postType" && site._ref == $siteId')
                    .params({ siteId })
                    .child((postTypeId: string) =>
                      S.documentList()
                        .title('Innlegg')
                        .filter('_type == "post" && site._ref == $siteId && postType._ref == $postTypeId')
                        .params({ siteId, postTypeId })
                        .defaultOrdering([
                          { field: 'order', direction: 'asc' },
                          { field: 'publishDate', direction: 'desc' }
                        ])
                    )
                )
            ])
        )
    )

  // Posttyper gruppert etter nettsted
  const postTypesListItem = S.listItem()
    .title('Posttyper')
    .id('postTypes')
    .icon(() => '📋')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId: string) =>
          S.documentList()
            .title('Posttyper')
            .filter('_type == "postType" && site._ref == $siteId')
            .params({ siteId })
        )
    )

  // Redirects gruppert etter nettsted
  const redirectsListItem = S.listItem()
    .title('Redirects')
    .id('redirects')
    .icon(() => '↪️')
    .child(
      S.documentTypeList('site')
        .title('Velg nettsted')
        .child((siteId: string) =>
          S.documentList()
            .title('Redirects')
            .filter('_type == "redirect" && site._ref == $siteId')
            .params({ siteId })
        )
    )

  return S.list()
    .title('Innhold')
    .items([
      sitesListItem,
      S.divider(),
      pagesListItem,
      postsListItem,
      postTypesListItem,
      S.divider(),
      navigationListItem,
      globalSettingsListItem,
      redirectsListItem
    ])
}

export default defineConfig({
  name: 'default',
  title: IS_MULTISITE ? 'Multisite CMS' : 'CMS',
  projectId: PROJECT_ID,
  dataset: DATASET,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) => IS_MULTISITE ? getMultisiteStructure(S) : getSingleSiteStructure(S)
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
    types: schemaTypes
  }
})
