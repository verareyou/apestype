import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Montserrat, PT_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import Header from '@/components/Header'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: [],
})

const ptMono = PT_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'Apestype | A typing speed test app',
  description: 'A typing speed test app',
  keywords: [
    'typing',
    'speed',
    'test',
    'apes',
    'type',
    'typing test',
    'apes type',
    'apes typing',
    'apes typing test',
  ],
  appLinks: {
    web: {
      url: 'https://apestype.ashito.online',
    },
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  authors: [{ name: 'Ashito', url: 'https://ashito.online' }],
  creator: 'Ashito',
  publisher: 'Ashito',
  category: 'Education',
  abstract: 'A typing speed test app',
  metadataBase: new URL('https://apestype.ashito.online'),
  verification: {
    google: 'google-site-verification=1234567890',
  },
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
        style={{
          fontFamily: montserrat.style.fontFamily,
        }}
        className={cn(['bg-background flex flex-col min-h-screen'])}
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
