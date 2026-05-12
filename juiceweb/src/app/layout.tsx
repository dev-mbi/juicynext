import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JuicyNext — Mango Rush | Season 1",
  description: "Next-generation beverages. Taste the future with JuicyNext. Season 1: Mango Rush.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-juicy-dark font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
