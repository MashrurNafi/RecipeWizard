"use client"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: "sm" | "md" | "lg"
}

const SIZE_CLASSES: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
}

const STAR_VALUES = [1, 2, 3, 4, 5]

export default function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const sizeClass = SIZE_CLASSES[size]
  const interactive = Boolean(onChange)

  return (
    <div className="flex items-center gap-0.5">
      {STAR_VALUES.map((starValue) => {
        const filled = value >= starValue
        const star = (
          <svg
            viewBox="0 0 24 24"
            className={`${sizeClass} shrink-0 ${filled ? "text-amber-400" : "text-zinc-300"}`}
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2l2.955 5.99 6.61.96-4.782 4.66 1.128 6.58L12 17.64l-5.911 3.11 1.128-6.58L2.435 8.95l6.61-.96L12 2z" />
          </svg>
        )

        if (!interactive) return <span key={starValue}>{star}</span>

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange?.(starValue)}
            className="cursor-pointer rounded p-0 transition-transform hover:scale-110"
            aria-label={`Rate ${starValue} out of 5`}
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}
