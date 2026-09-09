import {
  CheckmarkCircleIcon,
  CogIcon,
  DocumentsIcon,
  DocumentIcon,
  DocumentTextIcon,
  MenuIcon,
  TagsIcon,
  TransferIcon,
} from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'
import { SetupChecklist } from './SetupChecklist'

export const structure: StructureResolver = (S) => {
  const postsListItem = S.listItem()
    .title('Innlegg')
    .id('posts')
    .icon(DocumentIcon)
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
              { field: 'publishDate', direction: 'desc' },
            ])
        )
    )

  const postTypesListItem = S.listItem()
    .title('Posttyper')
    .id('postTypes')
    .icon(TagsIcon)
    .child(S.documentTypeList('postType').title('Posttyper'))

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
      S.listItem()
        .title('Navigasjon')
        .id('navigation')
        .icon(MenuIcon)
        .child(S.documentTypeList('navigation').title('Navigasjon')),
      S.divider(),
      S.listItem()
        .title('Sider')
        .id('pages')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('page').title('Sider')),
      postsListItem,
      postTypesListItem,
      S.listItem()
        .title('Skjemaer')
        .id('forms')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('form').title('Skjemaer')),
      S.divider(),
      S.listItem()
        .title('Redirects')
        .id('redirects')
        .icon(TransferIcon)
        .child(S.documentTypeList('redirect').title('Redirects')),
    ])
}
