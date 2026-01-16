import { HeroBlock } from './HeroBlock'
import { TextBlock } from './TextBlock'
import { CtaBlock } from './CtaBlock'
import { GalleryBlock } from './GalleryBlock'
import { SpacerBlock } from './SpacerBlock'
import { AccordionBlock } from './AccordionBlock'
import { SectionBlock } from './SectionBlock'
import { MarqueeBlock } from './MarqueeBlock'
import { MediaTextBlock } from './MediaTextBlock'
import { PostGridBlock } from './PostGridBlock'
import { ComponentType } from 'react'

type BlockComponent = ComponentType<{ data: any; renderChildren?: (children: any[]) => React.ReactNode }>

export const blockRegistry: Record<string, BlockComponent> = {
  heroBlock: HeroBlock,
  textBlock: TextBlock,
  ctaBlock: CtaBlock,
  galleryBlock: GalleryBlock,
  spacerBlock: SpacerBlock,
  accordionBlock: AccordionBlock,
  sectionBlock: SectionBlock,
  marqueeBlock: MarqueeBlock,
  mediaTextBlock: MediaTextBlock,
  postGridBlock: PostGridBlock,
}
