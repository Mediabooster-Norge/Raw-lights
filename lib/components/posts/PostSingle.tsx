'use client'

import { LocaleLink } from '@/lib/i18n'
import { SanityImage } from '@/lib/components/ui/SanityImage'
import { PortableText } from '@/lib/components/ui/PortableText'

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: any
  content?: any
  gallery?: any[]
  externalUrl?: string
  externalUrlLabel?: string
  publishDate?: string
  postType: {
    title: string
    singularTitle: string
    slug: string
  }
}

type PostSingleProps = {
  post: Post
}

export function PostSingle({ post }: PostSingleProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  const titleColorClass = 'text-text-primary'
  const excerptColorClass = 'text-text-secondary'
  const contentColorClass = 'text-text-primary'
  const dateColorClass = 'text-text-secondary'

  return (
    <article className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb - visually hidden, accessible for screen readers */}
        <nav className="sr-only" aria-label="Brødsmulesti">
          <LocaleLink href={`/${post.postType.slug}`}>
            Tilbake til {post.postType.title}
          </LocaleLink>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${titleColorClass}`}>
            {post.title}
          </h1>
          
          {post.publishDate && (
            <p className={dateColorClass}>
              {formatDate(post.publishDate)}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <SanityImage
              image={post.featuredImage}
              fill
              className="object-cover"
              alt={post.featuredImage?.alt || post.title}
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className={`text-xl mb-8 leading-relaxed ${excerptColorClass}`}>
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        {post.content && (
          <div className={`prose prose-lg max-w-none mb-12 ${contentColorClass}`}>
            <PortableText value={post.content} />
          </div>
        )}

        {/* External Link */}
        {post.externalUrl && (
          <div className="mb-12">
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {post.externalUrlLabel || 'Besøk lenke'} →
            </a>
          </div>
        )}

        {/* Gallery */}
        {post.gallery && post.gallery.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${titleColorClass}`}>Galleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.gallery.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <SanityImage
                    image={image}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    alt={image?.alt || `Bilde ${index + 1}`}
                  />
                  {image?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back link - visually hidden, accessible for screen readers */}
        <footer className="sr-only">
          <LocaleLink href={`/${post.postType.slug}`}>
            Tilbake til {post.postType.title}
          </LocaleLink>
        </footer>
      </div>
    </article>
  )
}
