import Header from "@/components/Header"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from "react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cyber Oni crud app',
  description: 'provide crud functionality for cyberoni database',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black dark:text-white `}>
        <Header></Header>
        {children}
      </body>
    </html>
  )
}
