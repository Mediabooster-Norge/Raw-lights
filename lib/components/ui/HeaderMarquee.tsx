'use client'

import { useRef, useEffect, useState } from 'react'
import { SanityImage } from './SanityImage'
import { SanityLink } from './SanityLink'

type TextItem = {
  text: string
  link?: any
}

type ImageItem = {
  image: any
  alt?: string
  link?: any
}

type HeaderMarqueeProps = {
  contentType?: 'text' | 'images'
  textItems?: TextItem[]
  imageItems?: ImageItem[]
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'left' | 'right'
  backgroundColor?: 'primary' | 'secondary' | 'background' | 'surface'
  textColor?: 'white' | 'text-primary' | 'text-secondary'
  separator?: string
}

export function HeaderMarquee({
  contentType = 'text',
  textItems,
  imageItems,
  speed = 'normal',
  direction = 'left',
  backgroundColor = 'primary',
  textColor = 'white',
  separator = '•'
}: HeaderMarqueeProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [animationDuration, setAnimationDuration] = useState('20s')

  const isImages = contentType === 'images'
  const items = isImages ? imageItems : textItems

  // Hastighet i piksler per sekund (header marquee - mindre tekst, roligere tempo)
  const speedValues = {
    slow: 80,
    normal: 150,
    fast: 350
  }

  // Beregn hvor mange ganger vi må duplisere for å fylle skjermen
  const duplicateCount = 10

  // Kalkuler animasjonslengde basert på innholdsbredde
  useEffect(() => {
    if (contentRef.current && items?.length) {
      const totalWidth = contentRef.current.scrollWidth
      const pixelsPerSecond = speedValues[speed]
      // Animer over halvparten av innholdet for seamless loop
      const duration = Math.max((totalWidth / 2) / pixelsPerSecond, 5)
      setAnimationDuration(`${duration}s`)
    }
  }, [items, speed])

  if (!items?.length) return null

  // Sjekk om noen elementer har lenker
  const hasLinks = isImages 
    ? imageItems?.some(item => item.link) 
    : textItems?.some(item => item.link)

  // Bakgrunnsfarger
  const bgClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    background: 'bg-background',
    surface: 'bg-surface'
  }

  // Tekstfarger
  const textClasses = {
    'white': 'text-white',
    'text-primary': 'text-text-primary',
    'text-secondary': 'text-text-secondary'
  }

  const renderTextItem = (item: TextItem, key: string | number) => {
    const content = (
      <span className="flex-shrink-0 flex items-center gap-4">
        <span className={item.link ? 'hover:underline' : ''}>{item.text}</span>
        <span className="opacity-50">{separator}</span>
      </span>
    )

    if (item.link) {
      return (
        <SanityLink key={key} link={item.link} className="flex-shrink-0">
          {content}
        </SanityLink>
      )
    }

    return <span key={key}>{content}</span>
  }

  const renderImageItem = (item: ImageItem, key: string | number) => {
    const content = (
      <div className="flex-shrink-0 h-6 relative" style={{ width: 'auto' }}>
        <SanityImage
          image={item.image}
          alt={item.alt || ''}
          width={120}
          height={24}
          className="h-6 w-auto object-contain"
        />
      </div>
    )

    if (item.link) {
      return (
        <SanityLink key={key} link={item.link} className="flex-shrink-0 hover:opacity-80 transition-opacity">
          {content}
        </SanityLink>
      )
    }

    return <span key={key}>{content}</span>
  }

  // Render ett sett med items
  const renderItemSet = (keyPrefix: string) => {
    if (isImages && imageItems) {
      return imageItems.map((item, index) => renderImageItem(item, `${keyPrefix}-${index}`))
    }
    if (textItems) {
      return textItems.map((item, index) => renderTextItem(item, `${keyPrefix}-${index}`))
    }
    return null
  }

  // Velg riktig animasjon basert på retning
  const animationName = direction === 'right' ? 'headerMarqueeRight' : 'headerMarqueeLeft'

  return (
    <div className={`${bgClasses[backgroundColor]} overflow-hidden py-2 ${hasLinks ? 'marquee-container' : ''}`}>
      <div
        ref={contentRef}
        className={`flex gap-6 whitespace-nowrap text-sm font-medium ${textClasses[textColor]} items-center ${hasLinks ? 'marquee-content' : ''}`}
        style={{
          animation: `${animationName} ${animationDuration} linear infinite`
        }}
      >
        {/* Dupliser innholdet mange ganger for seamless infinite loop */}
        {Array.from({ length: duplicateCount }).map((_, i) => (
          <span key={i} className="flex gap-6 items-center">
            {renderItemSet(`set-${i}`)}
          </span>
        ))}
      </div>

      {/* CSS Animations - separate keyframes for hver retning */}
      <style jsx global>{`
        @keyframes headerMarqueeLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes headerMarqueeRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
