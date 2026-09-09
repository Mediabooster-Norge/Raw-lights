export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-surface rounded mb-4" />
        <div className="h-4 w-64 bg-surface rounded mb-2" />
        <div className="h-4 w-56 bg-surface rounded" />
      </div>
    </div>
  )
}
