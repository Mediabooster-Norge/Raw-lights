import { PortableText as SanityPortableText, PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'
import { SanityImage } from './SanityImage'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-medium mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>
  },
  marks: {
    link: ({ children, value }) => {
      const target = value?.blank ? '_blank' : undefined
      return (
        <a 
          href={value?.href} 
          target={target} 
          rel={target ? 'noopener noreferrer' : undefined}
          className="text-primary underline hover:no-underline"
        >
          {children}
        </a>
      )
    },
    internalLink: ({ children, value }) => {
      const ref = value?.reference
      const slug = ref?.slug?.current ?? ''
      
      // For posts: include the postType slug in the URL
      let href = `/${slug}`
      if (ref?._type === 'post' && ref?.postTypeSlug) {
        href = `/${ref.postTypeSlug}/${slug}`
      }
      
      return (
        <Link 
          href={href}
          className="text-primary underline hover:no-underline"
        >
          {children}
        </Link>
      )
    }
  },
  types: {
    image: ({ value }) => <SanityImage image={value} className="my-6 rounded-lg" />,
    youtube: ({ value }) => (
      <div className="aspect-video my-6">
        <iframe
          src={`https://www.youtube.com/embed/${value.videoId}`}
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
      </div>
    )
  }
}

type PortableTextProps = {
  value: any
  className?: string
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null
  
  return (
    <div className={className}>
      <SanityPortableText value={value} components={components} />
    </div>
  )
}
