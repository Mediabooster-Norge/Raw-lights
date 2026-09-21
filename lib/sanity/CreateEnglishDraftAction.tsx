import { TranslateIcon } from '@sanity/icons'
import { useClient, type DocumentActionComponent } from 'sanity'

const TRANSLATABLE_TYPES = new Set(['page', 'product', 'post', 'postType', 'navigation', 'form'])

function publishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

/** Queues a server-side translation. The browser only writes a job document. */
export const CreateEnglishDraftAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2024-01-01' })
  const source = props.draft ?? props.published
  const language = source?.language

  if (!TRANSLATABLE_TYPES.has(props.type) || language !== 'nb') return null

  const sourceId = publishedId(props.id)
  const jobId = `translation.job.${sourceId.replace(/[^a-zA-Z0-9_.-]/g, '-')}.en`

  return {
    label: 'Opprett engelsk kladd',
    icon: TranslateIcon,
    tone: 'primary',
    onHandle: async () => {
      try {
        const existing = await client.fetch<{ status?: string } | null>(
          '*[_id == $id][0]{status}',
          { id: jobId },
        )
        if (existing?.status === 'completed' || existing?.status === 'existing_translation') {
          props.onComplete()
          return
        }
        await client.createOrReplace({
          _id: jobId,
          _type: 'translationJob',
          sourceDocument: { _type: 'reference', _ref: sourceId },
          sourceLanguage: 'nb',
          targetLanguage: 'en',
          status: 'requested',
          requestedAt: new Date().toISOString(),
        })
      } catch (error) {
        // Sanity renders failed actions in its standard document-action UI.
        throw error
      } finally {
        props.onComplete()
      }
    },
  }
}
