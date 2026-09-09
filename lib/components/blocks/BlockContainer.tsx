import { ReactNode } from 'react'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type BlockContainerProps = {
  background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
  spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
  fullBleed?: boolean
  children: ReactNode
  className?: string
}

export function BlockContainer({
  background = 'transparent',
  spacing = 'medium',
  fullBleed = false,
  children,
  className = ''
}: BlockContainerProps) {
  const cleanBackground = cleanStegaString(background) ?? 'transparent'
  const cleanSpacing = cleanStegaString(spacing) ?? 'medium'

  const backgroundClasses: Record<string, string> = {
    transparent: '',
    background: 'bg-background',
    surface: 'bg-surface',
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary text-on-secondary'
  }

  const spacingClasses: Record<string, string> = {
    none: 'py-0',
    small: 'py-8 md:py-12',
    medium: 'py-16 md:py-24',
    large: 'py-24 md:py-32',
    xlarge: 'py-32 md:py-48'
  }

  const bgClass = backgroundClasses[cleanBackground] ?? ''
  const spaceClass = spacingClasses[cleanSpacing] ?? spacingClasses.medium

  if (fullBleed) {
    return (
      <section className={`${bgClass} ${spaceClass} ${className}`}>
        <div className="w-full">
          {children}
        </div>
      </section>
    )
  }

  return (
    <section className={`${bgClass} ${spaceClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {children}
      </div>
    </section>
  )
}
