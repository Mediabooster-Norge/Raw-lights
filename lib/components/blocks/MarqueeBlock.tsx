'use client'

import { useRef, useEffect, useState } from 'react'
import { SanityImage } from '@/lib/components/ui/SanityImage'
import { BlockContainer } from './BlockContainer'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type MarqueeBlockProps = {
  data: {
    _key: string
    _type: string
    contentType?: 'text' | 'images'
    textItems?: { text: string }[]
    imageItems?: any[]
    size?: 'small' | 'medium'
    speed?: 'slow' | 'normal' | 'fast'
    direction?: 'left' | 'right'
    separator?: string
    textColor?: 'text-primary' | 'text-secondary' | 'primary' | 'secondary' | 'white'
    imageStyle?: 'normal' | 'grayscale' | 'primary-tint' | 'secondary-tint'
    // Styling
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    containerWidth?: 'full' | 'container'
  }
}

export function MarqueeBlock({ data }: MarqueeBlockProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [animationDuration, setAnimationDuration] = useState('20s')
  const [isReady, setIsReady] = useState(false)
  
  // Clean stega encoding from config values
  const contentType = cleanStegaString(data.contentType)
  const isImages = contentType === 'images'
  const items = isImages ? data.imageItems : data.textItems
  
  // Hastighet i piksler per sekund
  const speedValues: Record<string, number> = {
    slow: 100,
    normal: 250,
    fast: 600
  }

  const size = cleanStegaString(data.size) ?? 'medium'
  const speed = cleanStegaString(data.speed) ?? 'normal'
  const direction = cleanStegaString(data.direction) ?? 'left'
  const separator = cleanStegaString(data.separator) || '•'
  const textColor = cleanStegaString(data.textColor) ?? 'text-primary'
  const imageStyle = cleanStegaString(data.imageStyle) ?? 'normal'

  // Flere duplikater for mindre innhold for å sikre seamless loop
  const duplicateCount = size === 'small' ? 15 : 10

  // Kalkuler animasjonslengde basert på innholdsbredde
  useEffect(() => {
    const calculateDuration = () => {
      if (contentRef.current) {
        const totalWidth = contentRef.current.scrollWidth
        const pixelsPerSecond = speedValues[speed]
        // Animer over halvparten for seamless loop
        const duration = Math.max((totalWidth / 2) / pixelsPerSecond, 3)
        setAnimationDuration(`${duration}s`)
        setIsReady(true)
      }
    }

    // Vent litt for at bilder skal lastes
    const timer = setTimeout(calculateDuration, 100)
    
    // Også lytt på resize
    window.addEventListener('resize', calculateDuration)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateDuration)
    }
  }, [items, size, speed])

  if (!items?.length) return null

  // Størrelse for tekst og bilder
  const textSizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-3xl md:text-5xl'
  }

  const imageSizeClasses = {
    small: 'h-12 md:h-16',
    medium: 'h-20 md:h-32'
  }

  const gapClasses = {
    small: 'gap-6 md:gap-8',
    medium: 'gap-8 md:gap-12'
  }

  // Tekstfarge-klasser basert på tema
  const textColorClasses = {
    'text-primary': 'text-text-primary',
    'text-secondary': 'text-text-secondary',
    'primary': 'text-primary',
    'secondary': 'text-secondary',
    'white': 'text-white'
  }

  // For tint-effekt bruker vi CSS filter + overlay
  const getImageStyle = () => {
    if (imageStyle === 'primary-tint') {
      return { filter: 'grayscale(100%) brightness(0.8)' }
    }
    if (imageStyle === 'secondary-tint') {
      return { filter: 'grayscale(100%) brightness(0.8)' }
    }
    if (imageStyle === 'grayscale') {
      return { filter: 'grayscale(100%)' }
    }
    return {}
  }

  // Render et sett med items
  const renderItemSet = (keyPrefix: string) => {
    if (isImages) {
      return items.map((image: any, index: number) => (
        <div
          key={`${keyPrefix}-${index}`}
          className={`${imageSizeClasses[size]} flex-shrink-0 relative aspect-video`}
        >
          {(imageStyle === 'primary-tint' || imageStyle === 'secondary-tint') && (
            <div 
              className={`absolute inset-0 z-10 mix-blend-multiply ${
                imageStyle === 'primary-tint' ? 'bg-primary' : 'bg-secondary'
              }`} 
            />
          )}
          <SanityImage
            image={image}
            fill
            className={`object-contain ${imageStyle === 'grayscale' ? 'grayscale' : ''}`}
            style={getImageStyle()}
            alt={image.alt || ''}
          />
        </div>
      ))
    }
    
    return items.map((item: any, index: number) => (
      <span
        key={`${keyPrefix}-${index}`}
        className={`${textSizeClasses[size]} ${textColorClasses[textColor]} font-bold flex-shrink-0 flex items-center ${gapClasses[size]}`}
      >
        <span>{item.text}</span>
        <span className="opacity-40">{separator}</span>
      </span>
    ))
  }

  // Velg riktig animasjon basert på retning
  const animationName = direction === 'right' ? 'marqueeRight' : 'marqueeLeft'

  return (
    <BlockContainer
      background={data.background}
      spacing={data.spacing}
      containerWidth={data.containerWidth}
    >
      <div className="overflow-hidden">
        <div
          ref={contentRef}
          key={`marquee-${size}-${speed}-${direction}`}
          className={`flex ${gapClasses[size]} whitespace-nowrap`}
          style={{
            animation: isReady 
              ? `${animationName} ${animationDuration} linear infinite` 
              : 'none'
          }}
        >
          {/* Dupliser innholdet mange ganger for seamless infinite loop */}
          {Array.from({ length: duplicateCount }).map((_, i) => (
            <span key={i} className={`flex ${gapClasses[size]} items-center`}>
              {renderItemSet(`set-${i}`)}
            </span>
          ))}
        </div>

        {/* CSS Animations - separate keyframes for hver retning */}
        <style jsx global>{`
          @keyframes marqueeLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @keyframes marqueeRight {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </BlockContainer>
  )
}
