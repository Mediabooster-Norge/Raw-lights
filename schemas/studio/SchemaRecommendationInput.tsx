'use client'

import { useFormValue } from 'sanity'
import { Badge, Card, Text } from '@sanity/ui'
import { recommendPageSchema } from '../../lib/seo/schemaRecommendation'

type SlugValue = { current?: string }

export function SchemaRecommendationInput() {
  const title = useFormValue(['title']) as string | undefined
  const slug = useFormValue(['slug']) as SlugValue | undefined
  const blocks = useFormValue(['blocks'])
  const selectedType = useFormValue(['jsonLdType']) as string | undefined
  const recommendation = recommendPageSchema({ title, slug: slug?.current, blocks })
  const usesAutomaticMode = !selectedType || selectedType === 'auto'

  return (
    <Card padding={3} radius={2} tone={usesAutomaticMode ? 'positive' : 'caution'}>
      <div style={{ display: 'grid', gap: 12 }}>
        <Text size={1} weight="semibold">
          {usesAutomaticMode ? 'Automatisk schema' : 'Manuelt schema'}
        </Text>
        <Text size={1}>
          {usesAutomaticMode ? 'Forslag som publiseres:' : 'Automatisk forslag:'}{' '}
          <Badge tone="primary">{recommendation.label}</Badge>
          {recommendation.hasFaq && recommendation.type !== 'FAQPage' ? ' + FAQ-seksjon' : ''}
        </Text>
        <Text size={1} muted>
          {recommendation.reasons.join(' ')}
          {recommendation.hasFaq && recommendation.type !== 'FAQPage'
            ? ' Synlige spørsmål og svar beskrives som en FAQ-seksjon under siden, ikke som hele siden.'
            : ''}
        </Text>
      </div>
    </Card>
  )
}
