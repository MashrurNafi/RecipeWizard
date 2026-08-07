export default function LoadingScreen() {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-emerald-50 text-3xl shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-500/10">
            🧙‍♂️
          </div>
          <span className="absolute -inset-2 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-500" />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-sm font-medium text-zinc-600">Brewing up your recipes...</span>
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:300ms]" />
          </span>
        </div>
      </div>
    </div>
  )
}
