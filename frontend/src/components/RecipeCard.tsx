import Link from "next/link"

interface RecipeCardProps {
  id: string
  title: string
  cuisine: string | null
  timeMinutes: number
  servings: number
  dietary: string[]
  showUser?: boolean
  authorFirstName?: string | null
  authorImageUrl?: string | null
  source?: "AI" | "MANUAL" | null
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

export default function RecipeCard({
  id, title, cuisine, timeMinutes, servings, dietary, showUser, authorFirstName, authorImageUrl, source,
}: RecipeCardProps) {
  const emoji = cuisine ? CUISINE_EMOJI[cuisine.toLowerCase()] : null

  return (
    <Link
      href={`/recipe/${id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="mb-2 text-3xl">{emoji || "🍽️"}</div>
        {source && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
            source === "AI" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {source === "AI" ? "AI" : "own recipe"}
          </span>
        )}
      </div>
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
      {showUser && (
        <div className="mt-3 flex items-center gap-2 border-t border-zinc-100 pt-3">
          {authorImageUrl ? (
            <img src={authorImageUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {authorFirstName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <span className="text-xs text-zinc-500 truncate">
            by {authorFirstName || "Unknown"}
          </span>
        </div>
      )}
    </Link>
  )
}