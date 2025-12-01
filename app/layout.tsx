import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Camel Caravan Weighing System',
  description: 'Weight management system for camel caravans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
