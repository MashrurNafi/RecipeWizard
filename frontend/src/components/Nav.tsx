"use client"

import Link from "next/link"
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs"

export default function Nav() {
  const { isSignedIn } = useAuth()

  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-emerald-600">
          RecipeWizard
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <a href="/generate" className="hover:text-emerald-600 transition-colors">Generate</a>
          <a href="/saved" className="hover:text-emerald-600 transition-colors">Saved</a>
          <a href="/browse" className="hover:text-emerald-600 transition-colors">Browse</a>
          <a href="/about" className="hover:text-emerald-600 transition-colors">About</a>
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <a href="/profile" className="hover:text-emerald-600 transition-colors">Profile</a>
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
    </header>
  )
}
