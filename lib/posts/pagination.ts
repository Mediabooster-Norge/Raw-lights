export const ARCHIVE_PAGE_SIZE = 12

export function parsePageParam(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

export function paginate<T>(items: T[], page: number, pageSize = ARCHIVE_PAGE_SIZE) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    total,
  }
}

export function archivePageHref(slug: string, page: number) {
  return page <= 1 ? `/${slug}` : `/${slug}?page=${page}`
}
