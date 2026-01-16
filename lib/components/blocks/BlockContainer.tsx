import { ReactNode } from 'react'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type BlockContainerProps = {
  background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
  spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
  containerWidth?: 'full' | 'container'
  children: ReactNode
  className?: string
}

export function BlockContainer({
  background = 'transparent',
  spacing = 'medium',
  containerWidth = 'container',
  children,
  className = ''
}: BlockContainerProps) {
  // Clean stega encoding from config values
  const cleanBackground = cleanStegaString(background) ?? 'transparent'
  const cleanSpacing = cleanStegaString(spacing) ?? 'medium'
  const cleanContainerWidth = cleanStegaString(containerWidth) ?? 'container'
  
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

  const containerClasses: Record<string, string> = {
    full: 'w-full',
    container: 'max-w-7xl mx-auto px-4'
  }

  const bgClass = backgroundClasses[cleanBackground] ?? ''
  const spaceClass = spacingClasses[cleanSpacing] ?? spacingClasses.medium
  const contClass = containerClasses[cleanContainerWidth] ?? containerClasses.container

  // For full width with spacing, we need an outer wrapper
  if (cleanContainerWidth === 'full') {
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
      <div className={contClass}>
        {children}
      </div>
    </section>
  )
}
