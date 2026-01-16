import { draftMode } from 'next/headers'

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  
  if (!isEnabled) return null
  
  return (
    <div className="fixed bottom-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full z-50 text-sm font-medium shadow-lg">
      Preview Mode
      <a href="/api/preview" className="ml-2 underline">
        Exit
      </a>
    </div>
  )
}
