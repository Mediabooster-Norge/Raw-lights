import { PortableText } from '@/lib/components/ui/PortableText'
import { CtaButtons } from './BlockWrapper'
import { BlockContainer } from './BlockContainer'

type TextBlockProps = {
  data: {
    _key: string
    _type: string
    content?: any
    alignment?: 'left' | 'center' | 'right'
    textColor?: 'primary' | 'secondary'
    textWidth?: 'narrow' | 'medium' | 'wide'
    primaryCta?: { link: any }
    secondaryCta?: { link: any }
    // Styling
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    containerWidth?: 'full' | 'container'
  }
}

export function TextBlock({ data }: TextBlockProps) {
  const alignment = data.alignment ?? 'left'
  
  const textWidthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl'
  }

  const textColorClasses = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary'
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <BlockContainer
      background={data.background}
      spacing={data.spacing}
      containerWidth={data.containerWidth}
    >
      <div className={`${textWidthClasses[data.textWidth ?? 'medium']} ${textColorClasses[data.textColor ?? 'primary']} ${alignmentClasses[alignment]} mx-auto`}>
        <PortableText value={data.content} className="prose prose-lg prose-inherit" />
        <CtaButtons 
          primaryCta={data.primaryCta}
          secondaryCta={data.secondaryCta}
          className="mt-8"
          alignment={alignment}
        />
      </div>
    </BlockContainer>
  )
}
