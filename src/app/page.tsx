'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { wordList } from './words'
import { cn } from '@/lib/utils'
import OptionsBar from '@/components/OptionsBar'
import { AnimatePresence, motion } from 'framer-motion'
const WORD_COUNT_KEY = 'wordCount'

export default function Home() {
  const [text, setText] = useState('')
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isFinished, setIsFinished] = useState(false)
  const paragraphRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(true)
  const [isRestartFocused, setIsRestartFocused] = useState(false)
  const isTyping = useMemo(() => {
    const isTyping = paragraphRef.current?.textContent?.length
    return isFocused && !isFinished && isTyping
  }, [isFocused, isFinished])

  useEffect(() => {
    resetTest()
    if (paragraphRef.current) {
      paragraphRef.current.focus()
    }
  }, [])

  const generateWords = () => {
    const shuffled = [...wordList].sort(() => 0.5 - Math.random())
    console.log(shuffled, 'shuffled')
    const random = Math.floor(Math.random() * 10) + 1
    const words = shuffled.slice(
      random,
      parseInt(localStorage.getItem(WORD_COUNT_KEY) || '50') + random
    )
    setWords(words)
  }

  const handleInput = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    const typedWord = text.trim()
    const currentWord = words[currentWordIndex]

    const generateResult = () => {
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
    }

    // finish on last word's last letter without typing space or enter
    if (typedWord.length >= currentWord.length) {
      if (e.key === ' ') {
        console.log('space', typedWord.length, currentWord.length)
        generateResult()
        return
      }
      if (e.key === 'Backspace') {
        setText((prevText) =>
          e.metaKey || e.ctrlKey ? '' : prevText.slice(0, -1)
        )
        return
      }
    }

    if (
      currentWord.split('').pop() === e.key &&
      currentWordIndex === words.length - 1
    ) {
      setTimeout(() => {
        generateResult()
      }, 300)
      return
    }

    if (e.key === ' ' && currentWord.length === typedWord.length) {
      e.preventDefault()
      generateResult()
      return
    }
    if (e.key.length === 1) {
      if (e.key !== ' ') {
        setText((prevText) => prevText + e.key)
      }
      return
    }
    if (e.key === 'Backspace') {
      setText((prevText) =>
        e.metaKey || e.ctrlKey ? '' : prevText.slice(0, -1)
      )
      return
    }
  }

  useEffect(() => {
    if (paragraphRef.current) {
      setIsFocused(true)
      paragraphRef.current.focus()
      setIsRestartFocused(false)
    }
  }, [paragraphRef.current])

  const resetTest = () => {
    setText('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setIsFinished(false)
    setCurrentWordIndex(0)
    generateWords()
    setIsFocused(true)
    setIsRestartFocused(false)

    setTimeout(() => {
      if (paragraphRef.current) {
        paragraphRef.current.focus()
      }
    }, 100)
  }

  const handleWordCountChange = (count: number) => {
    localStorage.setItem(WORD_COUNT_KEY, count.toString())
    resetTest()
  }

  return (
    <main className=" flex-1 p-8 flex flex-col items-center justify-center pb-44 ">
      <Card className="w-full max-w-6xl mb-8 border-none shadow-none ">
        <div className="flex justify-center items-center mb-4">
          <OptionsBar
            wordCount={words.length}
            onWordCountChange={handleWordCountChange}
          />
        </div>

        <CardContent className=" bg-none border-none shadow-none pt-6 relative">
          {!isFocused || isRestartFocused ? (
            <div
              onClick={() => {
                paragraphRef.current?.focus()
                setIsRestartFocused(false)
              }}
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
              {/* <Progress
                className={cn(['mb-4 h-4 rounded-[4px] bg-primary/5'])}
                value={accuracy}
              /> */}

              <p
                onClick={() => {
                  paragraphRef.current?.focus()
                  setIsFocused(true)
                  setIsRestartFocused(false)
                }}
                onFocus={() => {
                  console.log('focused')
                }}
                className="text-2xl font-light font-mono mb-4 flex flex-wrap outline-none transition-colors duration-300 ease-in-out"
              >
                {words.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className={cn(
                      ' transition-all text-primary/50 py-1 duration-300',
                      wordIndex === currentWordIndex
                        ? ' text-primary rounded-[1px] px-1'
                        : wordIndex < currentWordIndex
                        ? 'text-muted-foreground/90'
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
                            'bg-primary/50 text-primary rounded-[1px]',
                          wordIndex === currentWordIndex &&
                            letterIndex < text.length &&
                            text[letterIndex] !== letter &&
                            'bg-red-500/50 text-white rounded-[1px]'
                        )}
                      >
                        {letter}
                      </span>
                    ))}
                    {text.length > words[currentWordIndex].length &&
                      wordIndex === currentWordIndex && (
                        <span
                          className={cn(
                            'transition-all duration-150',
                            text[words[currentWordIndex].length] === ' '
                              ? 'text-muted-foreground/50'
                              : 'text-primary/50'
                          )}
                        >
                          {text
                            .slice(words[currentWordIndex].length)
                            .split('')
                            .map((letter, letterIndex) => (
                              <span
                                key={letterIndex}
                                className={cn(
                                  'transition-all duration-150',
                                  'bg-red-500/50 text-white rounded-[1px]'
                                )}
                              >
                                {letter}
                              </span>
                            ))}
                        </span>
                      )}
                    <span
                      className={cn(
                        'transition-all text-transparent inline overflow-hidden duration-300 w-0 h-0 ',
                        text.length === words[currentWordIndex].length &&
                          wordIndex === currentWordIndex &&
                          'bg-primary/50 rounded-[1px] w-2 h-[28px] translate-y-[1.5px] text-transparent '
                      )}
                    >
                      {'i'}
                    </span>
                  </span>
                ))}
              </p>
              <p className="text-sm text-muted-foreground animate-pulse">
                <span className="text-lg text-muted-foreground block mb-6 font-semibold">
                  {currentWordIndex} / {words.length}
                </span>
                Current input:{' '}
                <input
                  type="text"
                  className=" outline-none border-none bg-transparent"
                  onFocus={() => {
                    setIsFocused(true)
                    setIsRestartFocused(false)
                  }}
                  ref={paragraphRef}
                  onKeyDown={handleInput}
                  onChange={() => {}}
                  value={text}
                  // autoFocus
                  // onBlur={() => {
                  //   const restartButton =
                  //     document.getElementById('restart-button')

                  //   if (restartButton) {
                  //     if (!restartButton.contains(document.activeElement)) {
                  //       setIsFocused(false)
                  //       setIsRestartFocused(true)
                  //       restartButton.focus()
                  //       return
                  //     }
                  //   }

                  //   setIsFocused(true)
                  //   paragraphRef.current?.focus()
                  //   setIsRestartFocused(false)
                  // }}
                  // onKeyDownCapture={(e) => {
                  //   if (e.key === 'Tab') {
                  //     console.log('tab')
                  //     e.preventDefault()
                  //     // setIsFocused(false)
                  //     // setIsRestartFocused(true)
                  //     const restartButton: HTMLElement =
                  //       document.getElementsByClassName(
                  //         'restart-button'
                  //       )[0] as HTMLElement
                  //     if (restartButton) {
                  //       restartButton.focus()
                  //     }
                  //   }
                  // }}
                />
              </p>
            </>
          ) : (
            <div className="flex flex-col">
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
            </div>
          )}
        </CardContent>
      </Card>
      <div className={cn([' h-10'])}>
        <RestartButton
          resetTest={resetTest}
          setIsRestartFocused={setIsRestartFocused}
        />
        {/* <Button
          onFocus={() => setIsRestartFocused(true)}
          onBlur={() => setIsRestartFocused(false)}
          onClick={resetTest}
          variant="default"
          className="px-6 py-3 text-lg h-1  font-semibold transition-all duration-300 hover:scale-105"
        >
          Try Again
        </Button> */}
      </div>
    </main>
  )
}

const RestartButton = (props: {
  resetTest: () => void
  setIsRestartFocused: (value: boolean) => void
}) => {
  const { resetTest, setIsRestartFocused } = props
  const [isAnimating, setIsAnimating] = useState(false)
  const circleVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      height: 500,
      width: 500,
    },
    animate: {
      scale: 30,
      height: 500,
      width: 500,
      opacity: [1, 1, 1, 0],
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
    },
  }

  return (
    <div className="flex items-center justify-center ">
      <Button
        onFocus={() => {
          setIsRestartFocused(true)
          console.log('focused')
        }}
        onBlur={() => setIsRestartFocused(false)}
        onClick={() => {
          setIsAnimating(true)
          resetTest()
          console.log('clicked')
        }}
        variant="default"
        className="px-6 py-3 restart-button bg-background text-muted-foreground/50 hover:bg-transparent hover:text-primary text-sm  transition-all duration-300"
      >
        Try Again <span className="text-xs">⌘R</span>
      </Button>
      {/* Animated expanding circle */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed z-[100] top-1/2 left-1/2 -translate-x-1/2 backdrop-blur-[1px]  -translate-y-1/2 bg-background/0 rounded-full"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={circleVariants}
            onAnimationComplete={() => setIsAnimating(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
  // return (
  //   <>
  //     <div
  //       id="circle-animation"
  //       className="absolute flex items-center justify-center"
  //     >
  //       <motion.div
  //         variants={circleVariants}
  //         initial="initial"
  //         animate="animate"
  //         className="w-32 h-32 bg-white rounded-full"
  //       />
  //     </div>
  //     <Button
  //       onFocus={() => setIsRestartFocused(true)}
  //       onBlur={() => setIsRestartFocused(false)}
  //       onClick={handleRestartClick}
  //       variant="default"
  //       className="px-6 py-3 text-lg h-1 font-semibold transition-all duration-300"
  //     >
  //       Try Again <span className="text-xs">⌘R</span>
  //     </Button>
  //   </>
  // )
}
