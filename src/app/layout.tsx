import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'
import Header from '@/components/Header'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: [],
})

export const metadata: Metadata = {
  title: 'Monkey Type Clone',
  description: 'A typing speed test app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head />
      <body
        className={cn([
          montserrat.className,
          'bg-background flex flex-col min-h-screen',
        ])}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
