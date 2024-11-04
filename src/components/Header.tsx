'use client'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { Keyboard } from 'lucide-react'

const Header = () => {
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full max-w-7xl mx-auto px-4 mb-8">
      <div className="flex items-center justify-between py-6">
        {/* Logo and Title Section */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Keyboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Apes Type</h1>
            <p className="text-sm text-muted-foreground">
              Improve your typing speed
            </p>
          </div>
        </div>

        {/* Right Section with Theme Toggle */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 mr-4">
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              Practice
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              Leaderboard
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              About
            </a>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setTheme(theme === 'light' ? 'dark' : 'light')
            }}
            className="rounded-full"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
