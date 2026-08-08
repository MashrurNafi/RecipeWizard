import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecipeWizard — AI-Powered Recipe Generator",
  description:
    "Generate delicious recipes from ingredients you have on hand, powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkRootLayout>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900">
          <Nav />
          <main className="flex-1">{children}</main>

          <footer className="relative mt-auto overflow-hidden border-t border-zinc-200 bg-white">
            {/* top hairline accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-b from-white to-emerald-50 text-base shadow-sm ring-1 ring-emerald-500/10">
                    🧙‍♂️
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-sm font-semibold tracking-tight text-transparent">
                    RecipeWizard
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  <span>
                    &copy; {new Date().getFullYear()} RecipeWizard. All rights
                    reserved.
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkRootLayout>
  );
}

function ClerkRootLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
