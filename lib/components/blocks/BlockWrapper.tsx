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

  // Border bruker alltid solid farge (uten alpha)
  // Når bakgrunnen er gjennomsiktig, blir border synlig
  const primaryButtonStyle = {
    borderColor: 'var(--color-cta-primary-border)'
  }
  const secondaryButtonStyle = {
    borderColor: 'var(--color-cta-secondary-border)'
  }

  return (
    <div className={`flex flex-wrap gap-4 ${alignmentClasses[alignment]} ${className}`}>
      {primaryCta?.link && (
        <SanityLink 
          link={primaryCta.link}
          className="inline-block px-8 py-4 bg-cta-primary-bg text-cta-primary-text border-2 rounded-lg font-semibold transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-cta-primary-bg/30 hover:brightness-110 active:scale-100"
          style={primaryButtonStyle}
        />
      )}
      {secondaryCta?.link && (
        <SanityLink 
          link={secondaryCta.link}
          className="inline-block px-8 py-4 bg-cta-secondary-bg text-cta-secondary-text border-2 rounded-lg font-semibold transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-cta-secondary-bg/30 hover:brightness-110 active:scale-100"
          style={secondaryButtonStyle}
        />
      )}
    </div>
  )
}
