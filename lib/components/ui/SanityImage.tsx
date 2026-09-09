import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

export const IMAGE_SIZES = {
  hero: '100vw',
  content: '(max-width: 768px) 100vw, 768px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  listThumb: '128px',
  media: '(max-width: 768px) 100vw, 50vw',
  gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  marquee: '200px',
} as const

type SanityImageProps = {
  image: any
  alt?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
  sizes?: string
  style?: React.CSSProperties
}

export function SanityImage({
  image,
  alt = '',
  className,
  width = 1200,
  height = 800,
  priority = false,
  fill = false,
  sizes,
  style
}: SanityImageProps) {
  if (!image?.asset) return null

  const imageUrl = urlFor(image).width(width).auto('format').url()
  const resolvedAlt = image.alt ?? alt
  const resolvedSizes = sizes ?? (fill ? IMAGE_SIZES.hero : IMAGE_SIZES.content)

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={resolvedAlt}
        fill
        sizes={resolvedSizes}
        className={className}
        style={style}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={resolvedAlt}
      width={width}
      height={height}
      sizes={resolvedSizes}
      className={className}
      style={style}
      priority={priority}
    />
  )
}
