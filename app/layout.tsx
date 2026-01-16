import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Lund-gruppen',
    default: 'Lund-gruppen'
  },
  description: 'Festivaler og events i Norge'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
