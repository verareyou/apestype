'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { wordList } from './words'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import OptionsBar from '@/components/OptionsBar'

const WORD_COUNT_KEY = 'wordCount'

export default function Home() {
  const [text, setText] = useState('')
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isFinished, setIsFinished] = useState(false)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isRestartFocused, setIsRestartFocused] = useState(false)
  const isTyping = useMemo(() => {
    const isTyping = paragraphRef.current?.textContent?.length
    return isFocused && !isFinished && isTyping
  }, [isFocused, isFinished])

  useEffect(() => {
    const savedWordCount = localStorage.getItem(WORD_COUNT_KEY)
    generateWords()
    if (paragraphRef.current) {
      paragraphRef.current.focus()
    }
    console.log(savedWordCount)
    if (savedWordCount) {
      setWords(wordList.slice(0, parseInt(savedWordCount)))
    }
  }, [])

  const generateWords = () => {
    const shuffled = [...wordList].sort(() => 0.5 - Math.random())
    setWords(shuffled.slice(0, 50))
  }

  const handleInput = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      const typedWord = text.trim()
      const currentWord = words[currentWordIndex]

      if (!startTime) {
        setStartTime(Date.now())
      }

      const correctChars = typedWord
        .split('')
        .filter((char, index) => char === currentWord[index]).length
      const newAccuracy = Math.round((correctChars / currentWord.length) * 100)
      setAccuracy((prevAccuracy) => (prevAccuracy + newAccuracy) / 2)

      setCurrentWordIndex((prevIndex) => prevIndex + 1)
      setText('')

      if (currentWordIndex === words.length - 1) {
        const timeElapsed = (Date.now() - (startTime || 0)) / 1000 / 60
        const wordsTyped = words.length
        const calculatedWpm = Math.round(wordsTyped / timeElapsed)
        setWpm(calculatedWpm)
        setIsFinished(true)
      }
    } else if (e.key.length === 1) {
      setText((prevText) => prevText + e.key)
    } else if (e.key === 'Backspace') {
      setText((prevText) =>
        e.metaKey || e.ctrlKey ? '' : prevText.slice(0, -1)
      )
    }
  }

  const resetTest = () => {
    setText('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setIsFinished(false)
    setCurrentWordIndex(0)
    generateWords()
    if (paragraphRef.current) {
      paragraphRef.current.focus()
    }
  }

  const handleWordCountChange = (count: number) => {
    resetTest()
    setWords(wordList.slice(0, count))
    localStorage.setItem(WORD_COUNT_KEY, count.toString())
  }

  return (
    <main className=" flex-1 p-8 flex flex-col items-center justify-center pb-44  ">
      <Card className="w-full max-w-2xl mb-8 border-none shadow-none ">
        <div className="flex justify-center items-center mb-4">
          <OptionsBar
            wordCount={words.length}
            onWordCountChange={handleWordCountChange}
          />
        </div>
        <CardContent className=" border-none shadow-none pt-6 relative">
          {!isFocused || isRestartFocused ? (
            <div
              onClick={() => paragraphRef.current?.focus()}
              onBlur={() => setIsRestartFocused(false)}
              className="absolute inset-0 rounded-3xl z-10 backdrop-blur-sm  flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-opacity-20"
            >
              <p className="text-primary font-bold text-xl ">
                {isRestartFocused ? 'Click to restart' : 'Click to start'}
              </p>
            </div>
          ) : null}
          {!isFinished ? (
            <>
              <Progress
                className={cn(['mb-4 h-10 rounded-[10px] bg-primary/5'])}
                value={accuracy}
              />
              <p
                ref={paragraphRef}
                className="text-2xl font-bold mb-4 flex flex-wrap outline-none transition-colors duration-300 ease-in-out"
                onKeyDown={handleInput}
                tabIndex={0}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsFocused(false)
                  }, 100)
                }}
              >
                {words.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className={cn(
                      'mr-2 transition-all py-1 duration-300',
                      wordIndex === currentWordIndex
                        ? 'bg-primary/20 rounded-[1px] px-1'
                        : wordIndex < currentWordIndex
                        ? 'text-muted-foreground'
                        : ''
                    )}
                  >
                    {word.split('').map((letter, letterIndex) => (
                      <span
                        key={letterIndex}
                        className={cn(
                          'transition-all duration-150',
                          wordIndex === currentWordIndex &&
                            letterIndex === text.length &&
                            'bg-primary/50 text-white rounded-[1px]',
                          wordIndex === currentWordIndex &&
                            letterIndex < text.length &&
                            text[letterIndex] !== letter &&
                            'bg-red-500/50 text-white rounded-[1px]'
                        )}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
              <p className="text-sm text-muted-foreground animate-pulse">
                Current input: {text}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                Test Results
              </h2>
              <div className="flex justify-between items-center mb-6 bg-primary/10 p-4 rounded-lg">
                <p className="text-lg font-semibold">Words Per Minute (WPM):</p>
                <p className="text-3xl font-bold text-primary">{wpm}</p>
              </div>
              <div className="flex justify-between items-center mb-6 bg-secondary/10 p-4 rounded-lg">
                <p className="text-lg font-semibold">Accuracy:</p>
                <p className="text-3xl font-bold text-primary/80">
                  {accuracy.toFixed(1)}%
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <div className="overflow-hidden h-0">
        <Button
          onFocus={() => setIsRestartFocused(true)}
          onBlur={() => setIsRestartFocused(false)}
          onClick={resetTest}
          variant="default"
          className="px-6 py-3 text-lg h-0  font-semibold transition-all duration-300 hover:scale-105"
        >
          Try Again
        </Button>
      </div>

      {isFinished && (
        <Button
          onClick={resetTest}
          variant="default"
          className="px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
        >
          Try Again
        </Button>
      )}
    </main>
  )
}
