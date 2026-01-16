'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { SanityImage } from '@/lib/components/ui/SanityImage'
import { BlockContainer } from './BlockContainer'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: any
  publishDate?: string
}

type PostGridBlockProps = {
  data: {
    _key: string
    _type: string
    heading?: string
    headingColor?: 'primary' | 'secondary'
    description?: string
    descriptionColor?: 'primary' | 'secondary'
    layout?: 'grid' | 'carousel' | 'list' | 'featured'
    columns?: number
    limit?: number
    showImage?: boolean
    showExcerpt?: boolean
    showDate?: boolean
    showAllLink?: boolean
    showAllText?: string
    cardTitleColor?: 'primary' | 'secondary'
    cardExcerptColor?: 'primary' | 'secondary'
    // Resolved post type data
    postType?: {
      title: string
      slug: string
      hasSingleView?: boolean
    }
    // Posts will be fetched and passed in
    posts?: Post[]
    // Styling
    background?: 'transparent' | 'background' | 'surface' | 'primary' | 'secondary'
    spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
    containerWidth?: 'full' | 'container'
  }
}

function getTextColorClass(color?: string, defaultColor: 'primary' | 'secondary' = 'primary') {
  const cleanColor = cleanStegaString(color) ?? defaultColor
  return cleanColor === 'secondary' ? 'text-text-secondary' : 'text-text-primary'
}

export function PostGridBlock({ data }: PostGridBlockProps) {
  const allPosts = data.posts ?? []
  // Apply limit on client side since GROQ doesn't support dynamic limits
  const limit = data.limit ?? 6
  const posts = limit > 0 ? allPosts.slice(0, limit) : allPosts
  // Clean stega encoding from config values
  const layout = cleanStegaString(data.layout) ?? 'grid'
  const columns = data.columns ?? 3
  const showImage = data.showImage ?? true
  const showExcerpt = data.showExcerpt ?? true
  const showDate = data.showDate ?? false
  const showAllLink = data.showAllLink ?? true
  const hasSingleView = data.postType?.hasSingleView ?? true
  
  // State for featured layout hover effect
  const [hoveredPostIndex, setHoveredPostIndex] = useState<number | null>(null)
  
  const headingColorClass = getTextColorClass(data.headingColor, 'primary')
  const descriptionColorClass = getTextColorClass(data.descriptionColor, 'secondary')
  const cardTitleColorClass = getTextColorClass(data.cardTitleColor, 'primary')
  const cardExcerptColorClass = getTextColorClass(data.cardExcerptColor, 'secondary')

  if (!data.postType || posts.length === 0) {
    return null
  }

  const gridColumnsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <BlockContainer
      background={data.background}
      spacing={data.spacing}
      containerWidth={data.containerWidth}
    >
      {/* Header */}
      {(data.heading || data.description) && (
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {data.heading && (
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${headingColorClass}`}>
                  {data.heading}
                </h2>
              )}
              {data.description && (
                <p className={`text-lg max-w-2xl ${descriptionColorClass}`}>
                  {data.description}
                </p>
              )}
            </div>
            {showAllLink && (
              <Link
                href={`/${data.postType.slug}`}
                className="text-primary hover:underline font-medium whitespace-nowrap"
              >
                {data.showAllText ?? 'Se alle'} →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Grid Layout */}
      {layout === 'grid' && (
        <div className={`grid gap-6 md:gap-8 ${gridColumnsClass}`}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              postTypeSlug={data.postType!.slug}
              showImage={showImage}
              showExcerpt={showExcerpt}
              showDate={showDate}
              hasSingleView={hasSingleView}
              titleColorClass={cardTitleColorClass}
              excerptColorClass={cardExcerptColorClass}
            />
          ))}
        </div>
      )}

      {/* Carousel Layout */}
      {layout === 'carousel' && (
        <Carousel
          posts={posts}
          postTypeSlug={data.postType.slug}
          showImage={showImage}
          showExcerpt={showExcerpt}
          showDate={showDate}
          hasSingleView={hasSingleView}
          titleColorClass={cardTitleColorClass}
          excerptColorClass={cardExcerptColorClass}
        />
      )}

      {/* List Layout */}
      {layout === 'list' && (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostListItem
              key={post._id}
              post={post}
              postTypeSlug={data.postType!.slug}
              showImage={showImage}
              showExcerpt={showExcerpt}
              showDate={showDate}
              hasSingleView={hasSingleView}
              titleColorClass={cardTitleColorClass}
              excerptColorClass={cardExcerptColorClass}
            />
          ))}
        </div>
      )}

      {/* Featured Layout */}
      {layout === 'featured' && posts.length > 0 && (
        <FeaturedLayout
          posts={posts}
          postTypeSlug={data.postType!.slug}
          showImage={showImage}
          showExcerpt={showExcerpt}
          showDate={showDate}
          hasSingleView={hasSingleView}
          titleColorClass={cardTitleColorClass}
          excerptColorClass={cardExcerptColorClass}
          hoveredPostIndex={hoveredPostIndex}
          setHoveredPostIndex={setHoveredPostIndex}
        />
      )}

      {/* Show all link at bottom (if no header) */}
      {showAllLink && !data.heading && !data.description && (
        <div className="mt-8 text-center">
          <Link
            href={`/${data.postType.slug}`}
            className="inline-block px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {data.showAllText ?? 'Se alle'} →
          </Link>
        </div>
      )}
    </BlockContainer>
  )
}

// Card component
function PostCard({
  post,
  postTypeSlug,
  showImage,
  showExcerpt,
  showDate,
  hasSingleView,
  titleColorClass,
  excerptColorClass,
  featured = false
}: {
  post: Post
  postTypeSlug: string
  showImage: boolean
  showExcerpt: boolean
  showDate: boolean
  hasSingleView: boolean
  titleColorClass: string
  excerptColorClass: string
  featured?: boolean
}) {
  const content = (
    <div className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group h-full">
      {showImage && post.featuredImage && (
        <div className={`relative overflow-hidden ${featured ? 'aspect-[4/3]' : 'aspect-video'}`}>
          <SanityImage
            image={post.featuredImage}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            alt={post.featuredImage?.alt || post.title}
          />
        </div>
      )}
      <div className={`p-6 ${featured ? 'p-8' : ''}`}>
        <h3 className={`font-bold mb-2 group-hover:opacity-70 transition-opacity ${titleColorClass} ${featured ? 'text-2xl' : 'text-xl'}`}>
          {post.title}
        </h3>
        {showDate && post.publishDate && (
          <p className="text-sm text-text-secondary mb-2">
            {new Date(post.publishDate).toLocaleDateString('nb-NO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        )}
        {showExcerpt && post.excerpt && (
          <p className={`line-clamp-3 ${excerptColorClass}`}>
            {post.excerpt}
          </p>
        )}
      </div>
    </div>
  )

  if (hasSingleView) {
    return (
      <Link href={`/${postTypeSlug}/${post.slug}`} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}

// List item component
function PostListItem({
  post,
  postTypeSlug,
  showImage,
  showExcerpt,
  showDate,
  hasSingleView,
  titleColorClass,
  excerptColorClass,
  compact = false
}: {
  post: Post
  postTypeSlug: string
  showImage: boolean
  showExcerpt: boolean
  showDate: boolean
  hasSingleView: boolean
  titleColorClass: string
  excerptColorClass: string
  compact?: boolean
}) {
  const content = (
    <div className={`flex gap-4 items-start group ${compact ? '' : 'pb-6 border-b border-text-secondary/10'}`}>
      {showImage && post.featuredImage && (
        <div className={`relative flex-shrink-0 rounded-lg overflow-hidden ${compact ? 'w-20 h-20' : 'w-32 h-32'}`}>
          <SanityImage
            image={post.featuredImage}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            alt={post.featuredImage?.alt || post.title}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold mb-1 group-hover:opacity-70 transition-opacity ${titleColorClass} ${compact ? 'text-base' : 'text-lg'}`}>
          {post.title}
        </h3>
        {showDate && post.publishDate && (
          <p className="text-sm text-text-secondary mb-1">
            {new Date(post.publishDate).toLocaleDateString('nb-NO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        )}
        {showExcerpt && post.excerpt && !compact && (
          <p className={`line-clamp-2 ${excerptColorClass}`}>
            {post.excerpt}
          </p>
        )}
      </div>
    </div>
  )

  if (hasSingleView) {
    return (
      <Link href={`/${postTypeSlug}/${post.slug}`} className="block">
        {content}
      </Link>
    )
  }

  return content
}

// Carousel component
function Carousel({
  posts,
  postTypeSlug,
  showImage,
  showExcerpt,
  showDate,
  hasSingleView,
  titleColorClass,
  excerptColorClass
}: {
  posts: Post[]
  postTypeSlug: string
  showImage: boolean
  showExcerpt: boolean
  showDate: boolean
  hasSingleView: boolean
  titleColorClass: string
  excerptColorClass: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center hover:bg-surface transition-colors -ml-4"
          aria-label="Forrige"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center hover:bg-surface transition-colors -mr-4"
          aria-label="Neste"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post) => (
          <div key={post._id} className="flex-shrink-0 w-[300px] md:w-[350px] snap-start">
            <PostCard
              post={post}
              postTypeSlug={postTypeSlug}
              showImage={showImage}
              showExcerpt={showExcerpt}
              showDate={showDate}
              hasSingleView={hasSingleView}
              titleColorClass={titleColorClass}
              excerptColorClass={excerptColorClass}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Featured layout component with hover interaction
function FeaturedLayout({
  posts,
  postTypeSlug,
  showImage,
  showExcerpt,
  showDate,
  hasSingleView,
  titleColorClass,
  excerptColorClass,
  hoveredPostIndex,
  setHoveredPostIndex
}: {
  posts: Post[]
  postTypeSlug: string
  showImage: boolean
  showExcerpt: boolean
  showDate: boolean
  hasSingleView: boolean
  titleColorClass: string
  excerptColorClass: string
  hoveredPostIndex: number | null
  setHoveredPostIndex: (index: number | null) => void
}) {
  // Show hovered post or first post as featured
  const featuredPost = hoveredPostIndex !== null ? posts[hoveredPostIndex] : posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Featured (large) post - changes on hover */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <PostCard
          key={featuredPost._id}
          post={featuredPost}
          postTypeSlug={postTypeSlug}
          showImage={showImage}
          showExcerpt={showExcerpt}
          showDate={showDate}
          hasSingleView={hasSingleView}
          titleColorClass={titleColorClass}
          excerptColorClass={excerptColorClass}
          featured
        />
      </div>

      {/* List of other posts */}
      <div className="divide-y divide-text-secondary/20">
        {otherPosts.map((post, index) => {
          const actualIndex = index + 1 // Account for first post being featured
          const isHovered = hoveredPostIndex === actualIndex
          
          return (
            <FeaturedListItem
              key={post._id}
              post={post}
              postTypeSlug={postTypeSlug}
              showImage={showImage}
              showDate={showDate}
              hasSingleView={hasSingleView}
              titleColorClass={titleColorClass}
              excerptColorClass={excerptColorClass}
              isHovered={isHovered}
              onMouseEnter={() => setHoveredPostIndex(actualIndex)}
              onMouseLeave={() => setHoveredPostIndex(null)}
            />
          )
        })}
      </div>
    </div>
  )
}

// List item for featured layout with hover support
function FeaturedListItem({
  post,
  postTypeSlug,
  showImage,
  showDate,
  hasSingleView,
  titleColorClass,
  excerptColorClass,
  isHovered,
  onMouseEnter,
  onMouseLeave
}: {
  post: Post
  postTypeSlug: string
  showImage: boolean
  showDate: boolean
  hasSingleView: boolean
  titleColorClass: string
  excerptColorClass: string
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const content = (
    <div 
      className={`flex gap-4 items-center py-4 transition-all duration-200 ${
        isHovered ? 'bg-surface/50 -mx-4 px-4' : ''
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showImage && post.featuredImage && (
        <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
          <SanityImage
            image={post.featuredImage}
            fill
            className="object-cover"
            alt={post.featuredImage?.alt || post.title}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-base md:text-lg ${titleColorClass} ${isHovered ? 'opacity-100' : ''}`}>
          {post.title}
        </h3>
        {showDate && post.publishDate && (
          <p className={`text-sm mt-1 ${excerptColorClass}`}>
            {new Date(post.publishDate).toLocaleDateString('nb-NO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        )}
      </div>
      <svg 
        className={`w-5 h-5 flex-shrink-0 transition-transform ${isHovered ? 'translate-x-1' : ''} ${titleColorClass}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )

  if (hasSingleView) {
    return (
      <Link 
        href={`/${postTypeSlug}/${post.slug}`} 
        className="block"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {content}
      </Link>
    )
  }

  return content
}
