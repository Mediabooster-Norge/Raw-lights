import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

type SanityImageProps = {
  image: any
  alt?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
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
  style
}: SanityImageProps) {
  if (!image?.asset) return null

  const imageUrl = urlFor(image).width(width).auto('format').url()

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={image.alt ?? alt}
        fill
        className={className}
        style={style}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={image.alt ?? alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
    />
  )
}
