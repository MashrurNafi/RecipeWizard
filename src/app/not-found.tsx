import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mb-4 text-6xl">🔮</div>
      <h1 className="mb-2 text-3xl font-bold">Recipe Not Found</h1>
      <p className="mb-6 text-zinc-600">
        This recipe doesn&apos;t exist or may have been deleted.
      </p>
      <Link
        href="/generate"
        className="inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Generate a New Recipe
      </Link>
    </div>
  )
}
