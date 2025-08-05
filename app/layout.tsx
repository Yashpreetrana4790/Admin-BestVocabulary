import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Best Vocabulary Admin Dashboard',
  description: 'Admin dashboard for managing vocabulary content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={inter.className} suppressHydrationWarning >
        <Navbar />
        {children}
      </body>
    </html>
  )
} 