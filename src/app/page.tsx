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
      <a
        href="/generate"
        className="rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
      >
        Generate a Recipe
      </a>
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-left">
          <div className="mb-2 text-2xl">🥘</div>
          <h3 className="mb-1 font-semibold">Any Ingredients</h3>
          <p className="text-sm text-zinc-500">Works with whatever you have in your pantry or fridge.</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-left">
          <div className="mb-2 text-2xl">🥗</div>
          <h3 className="mb-1 font-semibold">Dietary Preferences</h3>
          <p className="text-sm text-zinc-500">Vegan, gluten-free, keto, and more — we&apos;ve got you covered.</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-left">
          <div className="mb-2 text-2xl">⚡</div>
          <h3 className="mb-1 font-semibold">Fast & Simple</h3>
          <p className="text-sm text-zinc-500">AI-generated recipes in seconds, saved for later.</p>
        </div>
      </div>
    </div>
  )
}
