import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Siden ble ikke funnet</h2>
        <p className="text-text-secondary mb-8">
          Beklager, vi kunne ikke finne siden du leter etter.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Tilbake til forsiden
        </Link>
      </div>
    </div>
  )
}
