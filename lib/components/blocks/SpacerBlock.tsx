type SpacerBlockProps = {
  data: {
    _key: string
    _type: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }
}

export function SpacerBlock({ data }: SpacerBlockProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32'
  }

  return <div className={sizeClasses[data.size ?? 'md']} aria-hidden="true" />
}
