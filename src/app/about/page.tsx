import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <h1 className="mb-6 text-3xl font-bold">How It Works</h1>

      <div className="space-y-8">
        <section>
          <div className="mb-2 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">1</span>
            <h2 className="text-xl font-semibold">Tell Us Your Ingredients</h2>
          </div>
          <p className="ml-11 text-zinc-600">
            Enter the ingredients you have on hand, separated by commas. Add any dietary preferences
            (vegan, gluten-free, keto, etc.) and choose a cuisine style if you&apos;re in the mood for something specific.
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">2</span>
            <h2 className="text-xl font-semibold">AI Generates Your Recipe</h2>
          </div>
          <p className="ml-11 text-zinc-600">
            Our AI (powered by Groq&apos;s Llama 3 model) creates a complete recipe with a title, ingredient list
            with quantities, step-by-step instructions, and cooking time — all tailored to your inputs.
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">3</span>
            <h2 className="text-xl font-semibold">Save & Explore</h2>
          </div>
          <p className="ml-11 text-zinc-600">
            Every recipe is automatically saved to your personal collection. Browse recipes from other users
            on the Explore page for inspiration. No account needed — your recipes are linked to your browser.
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold">Ready to cook?</h2>
        <p className="mb-4 text-sm text-zinc-500">Start by generating your first recipe.</p>
        <Link
          href="/generate"
          className="inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
