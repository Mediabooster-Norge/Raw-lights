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
          {recommendation.hasFaq ? ' + FAQPage' : ''}
        </Text>
        <Text size={1} muted>
          {recommendation.reasons.join(' ')}
          {recommendation.hasFaq
            ? ' FAQPage blir bare lagt til når spørsmål og synlige svar finnes i sidebyggeren.'
            : ''}
        </Text>
      </div>
    </Card>
  )
}
