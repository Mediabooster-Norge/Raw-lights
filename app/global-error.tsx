'use client'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Noe gikk galt
            </h1>
            <p className="text-gray-600 mb-8">
              Vi beklager, det oppstod en uventet feil.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Prøv igjen
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
