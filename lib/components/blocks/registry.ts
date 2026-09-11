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
import { FormBlock } from './FormBlock'
import {
  ProductCatalog,
  RawFillStatement,
  RawBeamSection,
  RawContactForm,
  RawContactInfo,
  RawFinale,
  RawFaq,
  RawPinnedStories,
  RawProductFamilies,
  RawProductSpotlight,
  RawRules,
  RawReseller,
  RawStats,
  RawStoryHero,
  RawTimeline,
} from './RawBlocks'
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
  formBlock: FormBlock,
  rawStoryHero: RawStoryHero,
  rawFillStatement: RawFillStatement,
  rawBeamSection: RawBeamSection,
  rawFinale: RawFinale,
  rawContactInfo: RawContactInfo,
  rawContactForm: RawContactForm,
  rawReseller: RawReseller,
  rawFaq: RawFaq,
  rawPinnedStories: RawPinnedStories,
  rawProductSpotlight: RawProductSpotlight,
  rawStats: RawStats,
  rawProductFamilies: RawProductFamilies,
  rawRules: RawRules,
  rawTimeline: RawTimeline,
  productCatalogBlock: ProductCatalog,
}
