// Document types
import site from './site/site'
import page from './site/page'
import navigation from './site/navigation'
import globalSettings from './site/globalSettings'
import postType from './site/postType'
import post from './site/post'
import redirect from './site/redirect'

// Object types
import link from './objects/link'
import seo from './objects/seo'
import richText from './objects/richText'
import customCode from './objects/customCode'

// Block types
import sectionBlock from './blocks/sectionBlock'
import heroBlock from './blocks/heroBlock'
import textBlock from './blocks/textBlock'
import ctaBlock from './blocks/ctaBlock'
import galleryBlock from './blocks/galleryBlock'
import spacerBlock from './blocks/spacerBlock'
import accordionBlock from './blocks/accordionBlock'
import marqueeBlock from './blocks/marqueeBlock'
import mediaTextBlock from './blocks/mediaTextBlock'
import postGridBlock from './blocks/postGridBlock'

// Sjekk om multisite er aktivert
const isMultisiteEnabled = process.env.NEXT_PUBLIC_MULTISITE_ENABLED === 'true'

// Base schema types (alltid inkludert)
const baseSchemaTypes = [
  // Documents
  page,
  navigation,
  globalSettings,
  postType,
  post,
  redirect,
  // Objects
  link,
  seo,
  richText,
  customCode,
  // Blocks
  sectionBlock,
  heroBlock,
  textBlock,
  ctaBlock,
  galleryBlock,
  spacerBlock,
  accordionBlock,
  marqueeBlock,
  mediaTextBlock,
  postGridBlock,
]

// Multisite-only schema types
const multisiteSchemaTypes = [
  site,
]

// Kombiner basert på konfigurasjon
export const schemaTypes = isMultisiteEnabled 
  ? [site, ...baseSchemaTypes]
  : baseSchemaTypes
