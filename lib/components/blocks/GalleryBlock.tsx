'use client'

import { useState, useEffect, useRef } from 'react'
import { SanityImage, IMAGE_SIZES } from '@/lib/components/ui/SanityImage'
import { CtaButtons } from './BlockWrapper'
import { BlockContainer } from './BlockContainer'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type GalleryBlockProps = {
  data: {
    _key: string
    _type: string
    images?: any[]
    layout?: 'grid' | 'masonry' | 'carousel'
    columns?: number
    primaryCta?: { link: any }
    secondaryCta?: { link: any }
    // Styling
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
  }
}

// Animated gallery item component with scroll detection
function AnimatedGalleryItem({ 
  children, 
  index, 
  columns,
  className = ''
}: { 
  children: React.ReactNode
  index: number
  columns: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Determine animation direction based on position
  const row = Math.floor(index / columns)
  const col = index % columns
  const isLeftSide = col < columns / 2
  const isEvenRow = row % 2 === 0

  // Alternate directions: left items come from left, right items from right
  // Even rows: also slide up, odd rows: slide down
  const getInitialTransform = () => {
    const xOffset = isLeftSide ? '-60px' : '60px'
    const yOffset = isEvenRow ? '40px' : '-40px'
    return `translate(${xOffset}, ${yOffset})`
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
        transitionDelay: `${(index % columns) * 100}ms`
      }}
    >
      {children}
    </div>
  )
}

export function GalleryBlock({ data }: GalleryBlockProps) {
  // Clean stega encoding from config values
  const layout = cleanStegaString(data.layout) ?? 'grid'
  const columns = data.columns ?? 3
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  if (!data.images?.length) return null

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % data.images!.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + data.images!.length) % data.images!.length)
  }

  // Touch handlers for swipe
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  // Responsive columns for grid
  const gridColumnsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
  }[columns] ?? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'

  // Grid Layout
  if (layout === 'grid') {
    return (
      <BlockContainer
        background={data.background}
        spacing={data.spacing}
      >
        <div className={`grid gap-4 ${gridColumnsClass}`}>
          {data.images.map((image, index) => (
            <AnimatedGalleryItem key={index} index={index} columns={columns}>
              <div className="relative aspect-square overflow-hidden rounded-lg group">
                <SanityImage 
                  image={image} 
                  fill
                  sizes={IMAGE_SIZES.gallery} 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </AnimatedGalleryItem>
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

  // Masonry Layout - responsive columns
  // Bildene beholder sin naturlige aspect ratio for ekte masonry-effekt
  if (layout === 'masonry') {
    return (
      <BlockContainer
        background={data.background}
        spacing={data.spacing}
      >
        <div className="masonry-gallery">
          {data.images.map((image, index) => {
            // Hent bildets dimensjoner fra Sanity for naturlig aspect ratio
            const dimensions = image?.asset?.metadata?.dimensions
            // Bruk aspectRatio direkte hvis tilgjengelig, ellers beregn fra width/height
            const aspectRatio = dimensions?.aspectRatio 
              ?? (dimensions?.width && dimensions?.height 
                ? dimensions.width / dimensions.height 
                : 1.5) // Fallback til 3:2 hvis ingen data
            
            return (
              <AnimatedGalleryItem 
                key={image?.asset?._id || index} 
                index={index} 
                columns={columns}
                className="mb-4 break-inside-avoid"
              >
                <div className="overflow-hidden rounded-lg group">
                  <div 
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: aspectRatio }}
                  >
                    <SanityImage 
                      image={image} 
                      fill
                      sizes={IMAGE_SIZES.gallery}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </AnimatedGalleryItem>
            )
          })}
        </div>
        <CtaButtons 
          primaryCta={data.primaryCta}
          secondaryCta={data.secondaryCta}
          className="mt-8"
          alignment="center"
        />
        <style jsx>{`
          .masonry-gallery {
            column-count: 1;
            column-gap: 1rem;
          }
          @media (min-width: 640px) {
            .masonry-gallery {
              column-count: ${Math.min(columns, 2)};
            }
          }
          @media (min-width: 768px) {
            .masonry-gallery {
              column-count: ${columns};
            }
          }
        `}</style>
      </BlockContainer>
    )
  }

  // Carousel Layout
  return (
    <BlockContainer
      background={data.background}
      spacing={data.spacing}
    >
      <div className="relative">
        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden rounded-lg"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {data.images.map((image, index) => (
              <div 
                key={index} 
                className="relative w-full flex-shrink-0 aspect-[16/9]"
              >
                <SanityImage 
                  image={image} 
                  fill
                  sizes={IMAGE_SIZES.gallery} 
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {data.images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
              aria-label="Forrige bilde"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
              aria-label="Neste bilde"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {data.images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {data.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-primary' 
                    : 'bg-text-secondary/30 hover:bg-text-secondary/50'
                }`}
                aria-label={`Gå til bilde ${index + 1}`}
              />
            ))}
          </div>
        )}
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
