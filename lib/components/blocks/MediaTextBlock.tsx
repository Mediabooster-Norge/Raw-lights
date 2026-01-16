'use client'

import { useRef, useEffect, useState } from 'react'
import { SanityImage } from '@/lib/components/ui/SanityImage'
import { PortableText } from '@/lib/components/ui/PortableText'
import { CtaButtons } from './BlockWrapper'
import { BlockContainer } from './BlockContainer'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type MediaTextBlockProps = {
  data: {
    _key: string
    _type: string
    layout?: 'text-left' | 'text-right' | 'centered'
    heading?: string
    headingColor?: 'primary' | 'secondary'
    subheading?: string
    subheadingColor?: 'primary' | 'secondary'
    content?: any
    contentColor?: 'primary' | 'secondary'
    mediaType?: 'image' | 'video'
    image?: any
    video?: {
      asset?: {
        url?: string
      }
    }
    videoPoster?: any
    videoAutoplay?: boolean
    videoLoop?: boolean
    verticalAlign?: 'start' | 'center' | 'end'
    primaryCta?: { link: any }
    secondaryCta?: { link: any }
    // Styling
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    containerWidth?: 'full' | 'container'
  }
}

// Animated component with scroll detection
function AnimatedSection({ 
  children, 
  direction = 'up',
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode
  direction?: 'up' | 'left' | 'right'
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const getInitialTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-60px)'
      case 'right': return 'translateX(60px)'
      default: return 'translateY(40px)'
    }
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
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

export function MediaTextBlock({ data }: MediaTextBlockProps) {
  // Clean stega encoding from config values
  const layout = cleanStegaString(data.layout) ?? 'text-left'
  const mediaType = cleanStegaString(data.mediaType) ?? 'image'
  const verticalAlign = cleanStegaString(data.verticalAlign) ?? 'center'
  const headingColor = cleanStegaString(data.headingColor)
  const subheadingColor = cleanStegaString(data.subheadingColor)
  const contentColor = cleanStegaString(data.contentColor)
  const autoplay = data.videoAutoplay ?? true
  const loop = data.videoLoop ?? true
  
  // Individuelle fargevalg per tekstfelt
  const headingColorClass = headingColor === 'secondary' ? 'text-text-secondary' : 'text-text-primary'
  const subheadingColorClass = subheadingColor === 'secondary' ? 'text-text-secondary' : 'text-primary'
  const contentColorClass = contentColor === 'primary' ? 'text-text-primary' : 'text-text-secondary'

  const verticalAlignClasses: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  }

  // Text content component
  const TextContent = ({ animationDirection, animationDelay }: { animationDirection: 'up' | 'left' | 'right', animationDelay: number }) => (
    <AnimatedSection direction={animationDirection} delay={animationDelay} className="flex flex-col">
      {data.subheading && (
        <p className={`font-semibold mb-2 uppercase tracking-wide text-sm ${subheadingColorClass}`}>
          {data.subheading}
        </p>
      )}
      {data.heading && (
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${headingColorClass}`}>
          {data.heading}
        </h2>
      )}
      {data.content && (
        <div className={`prose prose-lg mb-6 ${contentColorClass}`}>
          <PortableText value={data.content} />
        </div>
      )}
      <CtaButtons 
        primaryCta={data.primaryCta}
        secondaryCta={data.secondaryCta}
        alignment={layout === 'centered' ? 'center' : 'left'}
      />
    </AnimatedSection>
  )

  // Media content component
  const MediaContent = ({ animationDirection, animationDelay }: { animationDirection: 'up' | 'left' | 'right', animationDelay: number }) => (
    <AnimatedSection direction={animationDirection} delay={animationDelay}>
      <div 
        className="relative w-full overflow-hidden rounded-lg aspect-video"
      >
        {mediaType === 'video' && data.video?.asset?.url ? (
          <video
            autoPlay={autoplay}
            muted
            loop={loop}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={data.videoPoster?.asset?.url}
          >
            <source src={data.video.asset.url} type="video/mp4" />
          </video>
        ) : data.image ? (
          <SanityImage 
            image={data.image} 
            fill 
            className="object-cover"
            alt={data.image?.alt || data.heading || ''}
          />
        ) : (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <span className="text-text-secondary">Ingen media valgt</span>
          </div>
        )}
      </div>
    </AnimatedSection>
  )

  // Centered layout
  if (layout === 'centered') {
    return (
      <BlockContainer
        background={data.background}
        spacing={data.spacing}
        containerWidth={data.containerWidth}
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <TextContent animationDirection="up" animationDelay={0} />
          <div className="w-full mt-8">
            <MediaContent animationDirection="up" animationDelay={200} />
          </div>
        </div>
      </BlockContainer>
    )
  }

  // Side-by-side layouts
  const isTextLeft = layout === 'text-left'

  return (
    <BlockContainer
      background={data.background}
      spacing={data.spacing}
      containerWidth={data.containerWidth}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${verticalAlignClasses[verticalAlign]}`}>
        {/* Text side */}
        <div className={`${isTextLeft ? 'lg:order-1' : 'lg:order-2'}`}>
          <TextContent 
            animationDirection={isTextLeft ? 'left' : 'right'} 
            animationDelay={0} 
          />
        </div>
        
        {/* Media side */}
        <div className={`${isTextLeft ? 'lg:order-2' : 'lg:order-1'}`}>
          <MediaContent 
            animationDirection={isTextLeft ? 'right' : 'left'} 
            animationDelay={200} 
          />
        </div>
      </div>
    </BlockContainer>
  )
}
