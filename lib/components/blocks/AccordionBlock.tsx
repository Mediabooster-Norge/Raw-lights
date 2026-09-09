'use client'

import { useState } from 'react'
import { PortableText } from '@/lib/components/ui/PortableText'
import { CtaButtons } from './BlockWrapper'
import { BlockContainer } from './BlockContainer'

type AccordionItem = {
  question: string
  answer: any
}

type AccordionBlockProps = {
  data: {
    _key: string
    _type: string
    heading?: string
    headingColor?: 'primary' | 'secondary'
    items?: AccordionItem[]
    primaryCta?: { link: any }
    secondaryCta?: { link: any }
    // Styling
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
  }
}

export function AccordionBlock({ data }: AccordionBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headingColorClass = data.headingColor === 'secondary' ? 'text-text-secondary' : 'text-text-primary'

  if (!data.items?.length) return null

  return (
    <BlockContainer
      background={data.background}
      spacing={data.spacing}
    >
      {data.heading && (
        <h2 className={`text-2xl font-bold mb-6 ${headingColorClass}`}>{data.heading}</h2>
      )}
      <div className="space-y-2">
        {data.items.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center hover:bg-surface transition-colors"
            >
              {item.question}
              <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 border-t bg-surface">
                <PortableText value={item.answer} />
              </div>
            )}
          </div>
        ))}
      </div>
      <CtaButtons 
        primaryCta={data.primaryCta}
        secondaryCta={data.secondaryCta}
        className="mt-8"
        alignment="center"
      />
    </BlockContainer>
  )
}
