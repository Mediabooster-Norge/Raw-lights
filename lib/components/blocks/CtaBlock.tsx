import { CtaButtons } from './BlockWrapper'
import { BlockContainer } from './BlockContainer'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type CtaBlockProps = {
  data: {
    _key: string
    _type: string
    heading?: string
    headingColor?: 'primary' | 'secondary'
    text?: string
    textColor?: 'primary' | 'secondary'
    primaryCta?: { link: any }
    secondaryCta?: { link: any }
    // Styling
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    containerWidth?: 'full' | 'container'
  }
}

export function CtaBlock({ data }: CtaBlockProps) {
  // Clean stega encoding from config values
  const headingColor = cleanStegaString(data.headingColor)
  const textColor = cleanStegaString(data.textColor)
  
  const headingColorClass = headingColor === 'secondary' ? 'text-text-secondary' : 'text-text-primary'
  const textColorClass = textColor === 'primary' ? 'text-text-primary' : 'text-text-secondary'
  
  return (
    <BlockContainer
      background={data.background}
      spacing={data.spacing}
      containerWidth={data.containerWidth}
    >
      <div className="text-center">
        {data.heading && (
          <h2 className={`text-3xl font-bold mb-4 ${headingColorClass}`}>{data.heading}</h2>
        )}
        {data.text && (
          <p className={`text-lg mb-6 max-w-2xl mx-auto ${textColorClass}`}>
            {data.text}
          </p>
        )}
        <CtaButtons 
          primaryCta={data.primaryCta}
          secondaryCta={data.secondaryCta}
          alignment="center"
        />
      </div>
    </BlockContainer>
  )
}
