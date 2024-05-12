import type { Metadata } from "next"
import { Recursive } from "next/font/google"

import { constructMetadata } from "@/lib/utils"

import { Toaster } from "@/components/ui/toaster"

import "./globals.css"

const recursive = Recursive({ subsets: ["latin"] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <main className="grainy-light flex min-h-[calc(100vh-3.5rem-1px)] flex-col">
          <div className="flex h-full flex-1 flex-col">{children}</div>
        </main>

        <Toaster />
      </body>
    </html>
  )
}
