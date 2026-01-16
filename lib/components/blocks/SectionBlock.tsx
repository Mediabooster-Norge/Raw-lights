import { ReactNode } from 'react'

type SectionBlockProps = {
  data: {
    _key: string
    _type: string
    background?: 'transparent' | 'primary' | 'secondary' | 'background' | 'surface'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    containerWidth?: 'full' | 'container'
    children?: any[]
  }
  renderChildren: (children: any[]) => ReactNode
}

export function SectionBlock({ data, renderChildren }: SectionBlockProps) {
  const backgroundClasses = {
    transparent: '',
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary text-on-secondary',
    background: 'bg-background text-text-primary',
    surface: 'bg-surface text-text-primary'
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

  return (
    <section 
      className={`
        ${backgroundClasses[data.background ?? 'background']}
        ${spacingClasses[data.spacing ?? 'medium']}
      `}
    >
      <div className={containerClasses[data.containerWidth ?? 'container']}>
        {data.children && renderChildren(data.children)}
      </div>
    </section>
  )
}
