'use client'

import { LocaleLink, t, useLocale } from '@/lib/i18n'
import { SanityImage, IMAGE_SIZES } from '@/lib/components/ui/SanityImage'
import { archivePageHref } from '@/lib/posts/pagination'
import { cleanStegaString } from '@/lib/utils/stegaClean'

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: any
  publishDate?: string
  postType: {
    title: string
    singularTitle: string
    slug: string
  }
}

type PostType = {
  title: string
  singularTitle: string
  slug: string
  archiveLayout?: 'grid' | 'list' | 'masonry'
  archiveColumns?: number
  archiveTitle?: string
  archiveDescription?: string
  showExcerpt?: boolean
  showImage?: boolean
  showDate?: boolean
  hasSingleView?: boolean
}

type PostArchiveProps = {
  postType: PostType
  posts: Post[]
  pagination?: {
    page: number
    totalPages: number
  }
}

export function PostArchive({ postType, posts, pagination }: PostArchiveProps) {
  // Clean stega encoding from config values
  const layout = cleanStegaString(postType.archiveLayout) ?? 'grid'
  const columns = postType.archiveColumns ?? 3
  const showExcerpt = postType.showExcerpt ?? true
  const showImage = postType.showImage ?? true
  const showDate = postType.showDate ?? false
  const hasSingleView = postType.hasSingleView ?? true
  const titleColorClass = 'text-text-primary'
  const descriptionColorClass = 'text-text-secondary'
  const cardTitleColorClass = 'text-text-primary'
  const cardExcerptColorClass = 'text-text-secondary'

  const gridColumnsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  if (layout === 'grid') {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${titleColorClass}`}>
              {postType.archiveTitle ?? postType.title}
            </h1>
            {postType.archiveDescription && (
              <p className={`text-lg max-w-2xl mx-auto ${descriptionColorClass}`}>
                {postType.archiveDescription}
              </p>
            )}
          </div>

          {/* Grid */}
          {posts.length > 0 ? (
            <div className={`grid gap-6 md:gap-8 ${gridColumnsClass}`}>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  postTypeSlug={postType.slug}
                  showImage={showImage}
                  showExcerpt={showExcerpt}
                  showDate={showDate}
                  hasSingleView={hasSingleView}
                  titleColorClass={cardTitleColorClass}
                  excerptColorClass={cardExcerptColorClass}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary">
              Ingen {postType.title.toLowerCase()} ennå.
            </p>
          )}
          <ArchivePagination slug={postType.slug} pagination={pagination} />
        </div>
      </div>
    )
  }

  // List Layout
  if (layout === 'list') {
    return (
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${titleColorClass}`}>
              {postType.archiveTitle ?? postType.title}
            </h1>
            {postType.archiveDescription && (
              <p className={`text-lg ${descriptionColorClass}`}>
                {postType.archiveDescription}
              </p>
            )}
          </div>

          {/* List */}
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <PostListItem
                  key={post._id}
                  post={post}
                  postTypeSlug={postType.slug}
                  showImage={showImage}
                  showExcerpt={showExcerpt}
                  showDate={showDate}
                  hasSingleView={hasSingleView}
                  titleColorClass={cardTitleColorClass}
                  excerptColorClass={cardExcerptColorClass}
                />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">
              Ingen {postType.title.toLowerCase()} ennå.
            </p>
          )}
          <ArchivePagination slug={postType.slug} pagination={pagination} />
        </div>
      </div>
    )
  }

  // Masonry Layout
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${titleColorClass}`}>
            {postType.archiveTitle ?? postType.title}
          </h1>
          {postType.archiveDescription && (
            <p className={`text-lg max-w-2xl mx-auto ${descriptionColorClass}`}>
              {postType.archiveDescription}
            </p>
          )}
        </div>

        {/* Masonry */}
        {posts.length > 0 ? (
          <>
            <div className="masonry-archive">
              {posts.map((post) => (
                <div key={post._id} className="mb-6 break-inside-avoid">
                  <PostCard
                    post={post}
                    postTypeSlug={postType.slug}
                    showImage={showImage}
                    showExcerpt={showExcerpt}
                    showDate={showDate}
                    hasSingleView={hasSingleView}
                    titleColorClass={cardTitleColorClass}
                    excerptColorClass={cardExcerptColorClass}
                  />
                </div>
              ))}
            </div>
            <style jsx>{`
              .masonry-archive {
                column-count: 1;
                column-gap: 1.5rem;
              }
              @media (min-width: 640px) {
                .masonry-archive {
                  column-count: 2;
                }
              }
              @media (min-width: 1024px) {
                .masonry-archive {
                  column-count: ${columns};
                }
              }
            `}</style>
          </>
        ) : (
          <p className="text-center text-text-secondary">
            Ingen {postType.title.toLowerCase()} ennå.
          </p>
        )}
        <ArchivePagination slug={postType.slug} pagination={pagination} />
      </div>
    </div>
  )
}

function ArchivePagination({
  slug,
  pagination,
}: {
  slug: string
  pagination?: { page: number; totalPages: number }
}) {
  const locale = useLocale()
  if (!pagination || pagination.totalPages <= 1) return null

  return (
    <nav className="mt-12 flex items-center justify-center gap-6 text-sm" aria-label={t(locale, 'pagination')}>
      {pagination.page > 1 ? (
        <LocaleLink href={archivePageHref(slug, pagination.page - 1)} className="text-primary">
          {t(locale, 'previousPage')}
        </LocaleLink>
      ) : (
        <span className="text-text-secondary/40">{t(locale, 'previousPage')}</span>
      )}
      <span className="text-text-secondary">
        {pagination.page} / {pagination.totalPages}
      </span>
      {pagination.page < pagination.totalPages ? (
        <LocaleLink href={archivePageHref(slug, pagination.page + 1)} className="text-primary">
          {t(locale, 'nextPage')}
        </LocaleLink>
      ) : (
        <span className="text-text-secondary/40">{t(locale, 'nextPage')}</span>
      )}
    </nav>
  )
}

// Card component for grid/masonry
function PostCard({ 
  post, 
  postTypeSlug, 
  showImage, 
  showExcerpt, 
  showDate,
  hasSingleView,
  titleColorClass,
  excerptColorClass
}: { 
  post: Post
  postTypeSlug: string
  showImage: boolean
  showExcerpt: boolean
  showDate: boolean
  hasSingleView: boolean
  titleColorClass: string
  excerptColorClass: string
}) {
  const content = (
    <div className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {showImage && post.featuredImage && (
        <div className="relative aspect-video overflow-hidden">
          <SanityImage
            image={post.featuredImage}
            fill
            sizes={IMAGE_SIZES.card}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            alt={post.featuredImage?.alt || post.title}
          />
        </div>
      )}
      <div className="p-6">
        <h2 className={`text-xl font-bold mb-2 group-hover:opacity-70 transition-opacity ${titleColorClass}`}>
          {post.title}
        </h2>
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
      <LocaleLink href={`/${postTypeSlug}/${post.slug}`}>
        {content}
      </LocaleLink>
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
  excerptColorClass
}: { 
  post: Post
  postTypeSlug: string
  showImage: boolean
  showExcerpt: boolean
  showDate: boolean
  hasSingleView: boolean
  titleColorClass: string
  excerptColorClass: string
}) {
  const content = (
    <div className="flex gap-6 items-start group">
      {showImage && post.featuredImage && (
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <SanityImage
            image={post.featuredImage}
            fill
            sizes={IMAGE_SIZES.listThumb}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            alt={post.featuredImage?.alt || post.title}
          />
        </div>
      )}
      <div className="flex-1">
        <h2 className={`text-xl font-bold mb-2 group-hover:opacity-70 transition-opacity ${titleColorClass}`}>
          {post.title}
        </h2>
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
          <p className={excerptColorClass}>
            {post.excerpt}
          </p>
        )}
      </div>
    </div>
  )

  if (hasSingleView) {
    return (
      <LocaleLink href={`/${postTypeSlug}/${post.slug}`} className="block border-b pb-8">
        {content}
      </LocaleLink>
    )
  }

  return <div className="border-b pb-8">{content}</div>
}
