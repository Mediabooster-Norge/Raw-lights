import { ReactNode } from 'react'

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
  
  const backgroundClasses = {
    transparent: '',
    background: 'bg-background',
    surface: 'bg-surface',
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary text-on-secondary'
  }

  const spacingClasses = {
    none: 'py-0',
    small: 'py-8 md:py-12',
    medium: 'py-16 md:py-24',
    large: 'py-24 md:py-32',
    xlarge: 'py-32 md:py-48'
  }

  const containerClasses = {
    full: 'w-full',
    container: 'max-w-7xl mx-auto px-4'
  }

  // For full width with spacing, we need an outer wrapper
  if (containerWidth === 'full') {
    return (
      <section className={`${backgroundClasses[background]} ${spacingClasses[spacing]} ${className}`}>
        <div className="w-full">
          {children}
        </div>
      </section>
    )
  }

  return (
    <section className={`${backgroundClasses[background]} ${spacingClasses[spacing]} ${className}`}>
      <div className={containerClasses[containerWidth]}>
        {children}
      </div>
    </section>
  )
}
