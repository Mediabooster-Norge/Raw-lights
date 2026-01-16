'use client'

import { SanityImage } from '@/lib/components/ui/SanityImage'
import { CtaButtons } from './BlockWrapper'

type HeroBlockProps = {
  data: {
    _key: string
    _type: string
    heading?: string
    subheading?: string
    backgroundType?: 'image' | 'video'
    backgroundImage?: any
    backgroundVideo?: {
      asset?: {
        url?: string
      }
    }
    videoPoster?: any
    primaryCta?: { link: any }
    secondaryCta?: { link: any }
    alignment?: 'left' | 'center' | 'right'
    animateText?: boolean
    // Styling
    containerWidth?: 'full' | 'container'
  }
}

export function HeroBlock({ data }: HeroBlockProps) {
  const alignment = data.alignment ?? 'center'
  const isVideo = data.backgroundType === 'video'
  const animateText = data.animateText ?? false
  const containerWidth = data.containerWidth ?? 'container'
  
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  // Animasjonsklasser
  const headingAnimation = animateText 
    ? 'hero-animate hero-animate-1' 
    : ''
  const subheadingAnimation = animateText 
    ? 'hero-animate hero-animate-2' 
    : ''
  const ctaAnimation = animateText 
    ? 'hero-animate hero-animate-3' 
    : ''

  // HeroBlock fyller sin container - bruk "Full bredde" på seksjonen for full-bleed hero
  return (
    <div className="relative min-h-[100vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Bakgrunnsbilde */}
      {!isVideo && data.backgroundImage && (
        <div className="absolute inset-0">
          <SanityImage 
            image={data.backgroundImage} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Bakgrunnsvideo */}
      {isVideo && data.backgroundVideo?.asset?.url && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={data.videoPoster?.asset?.url}
          >
            <source src={data.backgroundVideo.asset.url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className={`relative z-10 w-full py-16 ${containerWidth === 'container' ? 'px-4 md:px-8' : ''}`}>
        <div className={`flex flex-col ${containerWidth === 'container' ? 'max-w-4xl' : 'max-w-6xl'} ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''} ${containerWidth === 'full' ? 'px-4 md:px-8' : ''} ${alignmentClasses[alignment]}`}>
          {data.heading && (
            <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 ${headingAnimation}`}>
              {data.heading}
            </h1>
          )}
          {data.subheading && (
            <p className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl ${subheadingAnimation}`}>
              {data.subheading}
            </p>
          )}
          <div className={ctaAnimation}>
            <CtaButtons 
              primaryCta={data.primaryCta}
              secondaryCta={data.secondaryCta}
              alignment={alignment}
            />
          </div>
        </div>
      </div>

      {/* Animasjons keyframes */}
      {animateText && (
        <style jsx global>{`
          @keyframes heroFadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .hero-animate {
            opacity: 0;
            animation-name: heroFadeInUp;
            animation-duration: 0.8s;
            animation-timing-function: ease-out;
            animation-fill-mode: forwards;
          }
          .hero-animate-1 {
            animation-delay: 0.2s;
          }
          .hero-animate-2 {
            animation-delay: 0.4s;
          }
          .hero-animate-3 {
            animation-delay: 0.6s;
          }
        `}</style>
      )}
    </div>
  )
}
