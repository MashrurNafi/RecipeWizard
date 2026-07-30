import Link from "next/link"

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <div className="mb-6 text-6xl">🧙‍♂️</div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Turn Ingredients Into Magic
      </h1>
      <p className="mb-8 max-w-lg text-lg text-zinc-600">
        Tell us what&apos;s in your kitchen and we&apos;ll generate a delicious recipe tailored to your
        dietary needs, preferred cuisine, and time constraints.
      </p>
      <Link
        href="/generate"
        className="rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 hover:shadow-md"
      >
        Generate a Recipe
      </Link>
      
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="group rounded-xl border border-zinc-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl transition-transform duration-300 group-hover:scale-110">
            🥘
          </div>
          <h3 className="mb-1 font-semibold text-zinc-900 transition-colors group-hover:text-emerald-700">
            Any Ingredients
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Works with whatever you have in your pantry or fridge.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group rounded-xl border border-zinc-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl transition-transform duration-300 group-hover:scale-110">
            🥗
          </div>
          <h3 className="mb-1 font-semibold text-zinc-900 transition-colors group-hover:text-emerald-700">
            Dietary Preferences
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Vegan, gluten-free, keto, and more — we&apos;ve got you covered.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group rounded-xl border border-zinc-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl transition-transform duration-300 group-hover:scale-110">
            ⚡
          </div>
          <h3 className="mb-1 font-semibold text-zinc-900 transition-colors group-hover:text-emerald-700">
            Fast & Simple
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            AI-generated recipes in seconds, saved to your profile.
          </p>
        </div>
      </div>
    </div>
  )
}