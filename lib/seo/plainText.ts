export function portableTextToPlain(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.map(portableTextToPlain).filter(Boolean).join(' ')
  }
  if (typeof value === 'object') {
    const node = value as { text?: string; children?: unknown }
    if (typeof node.text === 'string') return node.text
    if (node.children) return portableTextToPlain(node.children)
  }
  return ''
}

type AccordionLike = {
  _type?: string
  heading?: string
  items?: { question?: string; answer?: unknown }[]
  children?: unknown[]
}

export type FaqItem = { question: string; answer: string }
export type FaqSection = { heading?: string; items: FaqItem[] }

export function collectFaqSections(blocks: unknown): FaqSection[] {
  if (!Array.isArray(blocks)) return []

  const sections: FaqSection[] = []

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue
    const node = block as AccordionLike
    if (node._type === 'rawFaq' && Array.isArray(node.items)) {
      const items: FaqItem[] = []
      for (const item of node.items) {
        const question = item.question?.trim()
        const answer = portableTextToPlain(item.answer).trim()
        if (!question || !answer) continue
        items.push({
          question,
          answer,
        })
      }
      if (items.length) {
        sections.push({ heading: node.heading?.trim() || undefined, items })
      }
    }
    if (Array.isArray(node.children)) {
      sections.push(...collectFaqSections(node.children))
    }
  }

  return sections
}

export function collectFaqItems(blocks: unknown): FaqItem[] {
  return collectFaqSections(blocks).flatMap((section) => section.items)
}
