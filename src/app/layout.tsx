import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import UserIdSetup from "@/components/UserIdSetup"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RecipeWizard — AI-Powered Recipe Generator",
  description: "Generate delicious recipes from ingredients you have on hand, powered by AI.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900">
        <UserIdSetup />
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <a href="/" className="text-xl font-bold tracking-tight text-emerald-600">
              RecipeWizard
            </a>
            <div className="flex items-center gap-4 text-sm font-medium">
              <a href="/generate" className="hover:text-emerald-600 transition-colors">Generate</a>
              <a href="/saved" className="hover:text-emerald-600 transition-colors">Saved</a>
              <a href="/browse" className="hover:text-emerald-600 transition-colors">Browse</a>
              <a href="/about" className="hover:text-emerald-600 transition-colors">About</a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
          RecipeWizard — Powered by Groq AI
        </footer>
      </body>
    </html>
  )
}
