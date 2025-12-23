import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Supabase File Upload',
  description: 'Upload large files to Supabase Storage',
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

