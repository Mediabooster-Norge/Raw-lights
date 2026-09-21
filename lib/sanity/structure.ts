import {
  CheckmarkCircleIcon,
  CogIcon,
  DocumentsIcon,
  DocumentIcon,
  BulbOutlineIcon,
  DocumentTextIcon,
  MenuIcon,
  TagsIcon,
  TransferIcon,
  TranslateIcon,
} from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'
import { SetupChecklist } from './SetupChecklist'

export const structure: StructureResolver = (S) => {
  const localizedContent = (language: 'nb' | 'en', label: string) => {
    const postsListItem = S.listItem()
      .title('Innlegg')
      .id(`posts-${language}`)
      .icon(DocumentIcon)
      .child(
        S.documentList()
          .title('Velg posttype')
          .filter('_type == "postType" && language == $language')
          .params({ language })
          .child((postTypeId: string) =>
            S.documentList()
              .title('Innlegg')
              .filter('_type == "post" && language == $language && postType._ref == $postTypeId')
              .params({ language, postTypeId })
              .defaultOrdering([
                { field: 'order', direction: 'asc' },
                { field: 'publishDate', direction: 'desc' },
              ])
          )
      )

    return S.listItem()
      .title(label)
      .id(`content-${language}`)
      .child(
        S.list()
          .title(label)
          .items([
            S.listItem()
              .title('Sider')
              .id(`pages-${language}`)
              .icon(DocumentsIcon)
              .child(S.documentList().title('Sider').filter('_type == "page" && language == $language').params({ language })),
            S.listItem()
              .title('Produkter')
              .id(`products-${language}`)
              .icon(BulbOutlineIcon)
              .child(S.documentList().title('Produkter').filter('_type == "product" && language == $language').params({ language }).defaultOrdering([{ field: 'order', direction: 'asc' }])),
            S.listItem()
              .title('Navigasjon')
              .id(`navigation-${language}`)
              .icon(MenuIcon)
              .child(S.documentList().title('Navigasjon').filter('_type == "navigation" && language == $language').params({ language })),
            S.listItem()
              .title('Skjemaer')
              .id(`forms-${language}`)
              .icon(DocumentTextIcon)
              .child(S.documentList().title('Skjemaer').filter('_type == "form" && language == $language').params({ language })),
            postsListItem,
            S.listItem()
              .title('Posttyper')
              .id(`post-types-${language}`)
              .icon(TagsIcon)
              .child(S.documentList().title('Posttyper').filter('_type == "postType" && language == $language').params({ language })),
          ])
      )
  }

  return S.list()
    .title('Innhold')
    .items([
      S.listItem()
        .title('Oppstart')
        .id('setup')
        .icon(CheckmarkCircleIcon)
        .child(S.component(SetupChecklist).id('setup-checklist').title('Oppstart')),
      S.listItem()
        .title('Globale innstillinger')
        .id('globalSettings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('globalSettings')
            .documentId('globalSettings')
        ),
      S.divider(),
      localizedContent('nb', 'Norsk innhold'),
      localizedContent('en', 'English content'),
      S.divider(),
      S.listItem()
        .title('Oversettelsesjobber')
        .id('translation-jobs')
        .icon(TranslateIcon)
        .child(S.documentTypeList('translationJob').title('Oversettelsesjobber').defaultOrdering([{ field: 'requestedAt', direction: 'desc' }])),
      S.divider(),
      S.listItem()
        .title('Redirects')
        .id('redirects')
        .icon(TransferIcon)
        .child(S.documentTypeList('redirect').title('Redirects')),
    ])
}
