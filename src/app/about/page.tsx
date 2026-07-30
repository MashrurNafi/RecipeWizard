import Link from "next/link"

export default function AboutPage() {
  const steps = [
    {
      number: 1,
      icon: "🥘",
      title: "Tell Us Your Ingredients",
      description:
        "Enter the ingredients you have on hand, separated by commas. Add any dietary preferences (vegan, gluten-free, keto, etc.) and choose a cuisine style if you're in the mood for something specific.",
    },
    {
      number: 2,
      icon: "✨",
      title: "AI Generates Your Recipe",
      description:
        "Our AI (powered by Groq's Llama 3 model) creates a complete recipe with a title, ingredient list with quantities, step-by-step instructions, and cooking time — all tailored to your inputs.",
    },
    {
      number: 3,
      icon: "📚",
      title: "Save & Explore",
      description:
        "Every recipe is automatically saved to your personal collection. Browse recipes from other users on the Explore page for inspiration. No account needed — your recipes are linked to your browser.",
    },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background, consistent with the rest of the app */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute -right-24 top-64 h-72 w-72 rounded-full bg-teal-200/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-10 text-center sm:text-left">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Three simple steps
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            How It Works
          </h1>
        </div>

        <div className="relative space-y-10">
          {/* Connecting timeline line */}
          <div
            className="absolute bottom-8 left-4 top-4 w-px bg-gradient-to-b from-emerald-500 via-emerald-300 to-transparent sm:left-[1.375rem]"
            aria-hidden
          />

          {steps.map((step) => (
            <section key={step.number} className="group relative flex gap-4 sm:gap-5">
              <div className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-600/20 ring-4 ring-zinc-50 transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11">
                {step.number}
              </div>

              <div className="min-w-0 flex-1 rounded-xl border border-transparent p-4 pt-0.5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-emerald-500/15 group-hover:bg-white/70 group-hover:shadow-md group-hover:shadow-emerald-500/5 sm:p-5 sm:pt-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-lg leading-none">{step.icon}</span>
                  <h2 className="text-xl font-semibold text-zinc-900">{step.title}</h2>
                </div>
                <p className="text-zinc-600">{step.description}</p>
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="relative mt-14 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-b from-white to-emerald-50 text-2xl shadow-sm ring-1 ring-emerald-500/10">
            🧙‍♂️
          </div>
          <h2 className="mb-1 text-lg font-semibold text-zinc-900">Ready to cook?</h2>
          <p className="mb-5 text-sm text-zinc-500">Start by generating your first recipe.</p>
          <Link
            href="/generate"
            className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}