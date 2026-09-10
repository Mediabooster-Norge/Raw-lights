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
  items?: { question?: string; answer?: unknown }[]
  children?: unknown[]
}

export function collectFaqItems(blocks: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(blocks)) return []

  const items: { question: string; answer: string }[] = []

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue
    const node = block as AccordionLike
    if ((node._type === 'accordionBlock' || node._type === 'rawFaq') && Array.isArray(node.items)) {
      for (const item of node.items) {
        const question = item.question?.trim()
        if (!question) continue
        items.push({
          question,
          answer: portableTextToPlain(item.answer).trim(),
        })
      }
    }
    if (Array.isArray(node.children)) {
      items.push(...collectFaqItems(node.children))
    }
  }

  return items
}
