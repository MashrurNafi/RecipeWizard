import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
        <div className="absolute -right-24 top-96 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(16,185,129,0.25) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        {/* Icon Hero Badge */}
        <div className="group relative mb-6">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-40" />
          <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-emerald-50/50 text-5xl shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            🧙‍♂️
          </div>
        </div>

        {/* Eyebrow */}
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI-Powered Recipes
        </span>

        {/* Main Heading */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Turn Ingredients Into{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Magic
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="8"
              viewBox="0 0 120 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M2 5.5C20 1.5 40 1.5 60 4C80 6.5 100 2.5 118 4.5"
                stroke="url(#underline-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="underline-gradient"
                  x1="0"
                  y1="0"
                  x2="120"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-8 max-w-lg text-lg leading-relaxed text-zinc-600">
          Tell us what&apos;s in your kitchen and we&apos;ll generate a
          delicious recipe tailored to your dietary needs, preferred cuisine,
          and time constraints.
        </p>

        {/* Call to Action Button */}
        <Link
          href="/generate"
          className="group relative overflow-hidden rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-95"
        >
          <span className="relative z-10">Generate a Recipe</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform duration-300 group-hover:scale-x-100" />
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl shadow-sm shadow-emerald-900/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:shadow-emerald-500/20">
              🥘
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 transition-colors group-hover:text-emerald-700">
              Any Ingredients
            </h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              Works with whatever you have in your pantry or fridge.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform duration-300 group-hover:scale-x-100" />
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl shadow-sm shadow-emerald-900/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:shadow-emerald-500/20">
              🥗
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 transition-colors group-hover:text-emerald-700">
              Dietary Preferences
            </h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              Vegan, gluten-free, keto, and more — we&apos;ve got you covered.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform duration-300 group-hover:scale-x-100" />
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl shadow-sm shadow-emerald-900/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:shadow-emerald-500/20">
              ⚡
            </div>
            <h3 className="mb-1 font-semibold text-zinc-900 transition-colors group-hover:text-emerald-700">
              Fast & Simple
            </h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              AI-generated recipes in seconds, saved to your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
