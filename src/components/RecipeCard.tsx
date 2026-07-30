import Link from "next/link"

interface RecipeCardProps {
  id: string
  title: string
  cuisine: string | null
  timeMinutes: number
  servings: number
  dietary: string[]
}

const CUISINE_EMOJI: Record<string, string> = {
  italian: "🍝",
  mexican: "🌮",
  indian: "🍛",
  chinese: "🥡",
  japanese: "🍜",
  thai: "🍜",
  korean: "🥘",
  mediterranean: "🥙",
  french: "🥖",
  american: "🍔",
  greek: "🥗",
  lebanese: "🥙",
}

export default function RecipeCard({ id, title, cuisine, timeMinutes, servings, dietary }: RecipeCardProps) {
  const emoji = cuisine ? CUISINE_EMOJI[cuisine.toLowerCase()] : null

  return (
    <Link
      href={`/recipe/${id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 text-3xl">{emoji || "🍽️"}</div>
      <h3 className="mb-2 font-semibold text-zinc-900 line-clamp-2">{title}</h3>
      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
        {cuisine && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 capitalize">{cuisine}</span>
        )}
        <span className="rounded-full bg-zinc-100 px-2 py-0.5">{timeMinutes} min</span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5">{servings} servings</span>
      </div>
      {dietary.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {dietary.map((d) => (
            <span key={d} className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 capitalize">
              {d}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
