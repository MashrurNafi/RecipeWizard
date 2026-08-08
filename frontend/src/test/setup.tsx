import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"
import { authState } from "./authState"

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    isSignedIn: authState.isSignedIn,
    isLoaded: authState.isLoaded,
    userId: authState.userId,
    getToken: authState.getToken,
  }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: authState.isSignedIn,
    user: authState.user,
  }),
  UserButton: () => <button>User menu</button>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignOutButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: () => null,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    replace: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string | { href: string }; children: React.ReactNode }) => (
    <a href={typeof href === "string" ? href : href.href} {...rest}>
      {children}
    </a>
  ),
}))
