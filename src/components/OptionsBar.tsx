import { Button } from '@/components/ui/button'

interface OptionsBarProps {
  wordCount: number
  onWordCountChange: (count: number) => void
  disabled?: boolean
}

const OptionsBar = ({ wordCount, onWordCountChange }: OptionsBarProps) => {
  const wordCounts = [10, 25, 50]

  return (
    <div className="inline-flex gap-2 p-1 bg-muted/30 rounded-lg">
      {wordCounts.map((count) => (
        <Button
          key={count}
          variant={wordCount === count ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onWordCountChange(count)}
          className={`min-w-[80px] ${
            wordCount === count ? '' : 'hover:bg-muted/50'
          }`}
        >
          {count} words
        </Button>
      ))}
    </div>
  )
}

export default OptionsBar
