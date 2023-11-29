import Header from "@/components/Header"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from "react"
import { getServerSession } from "next-auth"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cyber Oni crud app',
  description: 'provide crud functionality for cyberoni database',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blacktext-white `}>
        <Suspense>
          <Header></Header>
        </Suspense>
        {children}
      </body>
    </html>
  )
}
