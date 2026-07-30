import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import Nav from "@/components/Nav"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RecipeWizard — AI-Powered Recipe Generator",
  description: "Generate delicious recipes from ingredients you have on hand, powered by AI.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkRootLayout>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900">
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
            RecipeWizard — Powered by Groq AI
          </footer>
        </body>
      </html>
    </ClerkRootLayout>
  )
}

function ClerkRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>{children}</Providers>
  )
}
