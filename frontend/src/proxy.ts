import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/generate(.*)", "/post(.*)", "/saved(.*)", "/trash(.*)", "/recipe(.*)", "/profile(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
