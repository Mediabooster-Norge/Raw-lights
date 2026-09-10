import { SanityLink } from '@/lib/components/ui/SanityLink'

type CtaButtonsProps = {
  primaryCta?: { link: any }
  secondaryCta?: { link: any }
  className?: string
  alignment?: 'left' | 'center' | 'right'
}

export function CtaButtons({ 
  primaryCta, 
  secondaryCta, 
  className = '',
  alignment = 'center'
}: CtaButtonsProps) {
  if (!primaryCta?.link && !secondaryCta?.link) return null

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  return (
    <div className={`flex flex-wrap gap-4 ${alignmentClasses[alignment]} ${className}`}>
      {primaryCta?.link && (
        <SanityLink 
          link={primaryCta.link}
          className="raw-button"
        />
      )}
      {secondaryCta?.link && (
        <SanityLink 
          link={secondaryCta.link}
          className="raw-button raw-button--secondary"
        />
      )}
    </div>
  )
}
