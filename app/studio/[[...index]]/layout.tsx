export const metadata = {
  title: 'Sanity Studio',
  description: 'CMS for Lund-gruppen',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  )
}
