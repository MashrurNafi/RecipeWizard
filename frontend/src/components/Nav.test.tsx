import { describe, it, expect, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import Nav from "@/components/Nav"
import { authState } from "@/test/authState"

afterEach(() => {
  authState.isSignedIn = true
  authState.isLoaded = true
})

describe("Nav", () => {
  it("renders all navigation links", () => {
    render(<Nav />)
    expect(screen.getByText("RecipeWizard")).toHaveAttribute("href", "/")
    expect(screen.getByText("Generate")).toHaveAttribute("href", "/generate")
    expect(screen.getByText("Post Recipe")).toHaveAttribute("href", "/post")
    expect(screen.getByText("Saved")).toHaveAttribute("href", "/saved")
    expect(screen.getByText("Trash")).toHaveAttribute("href", "/trash")
    expect(screen.getByText("Browse")).toHaveAttribute("href", "/browse")
    expect(screen.getByText("About")).toHaveAttribute("href", "/about")
  })

  it("shows the profile link and user menu when signed in", () => {
    render(<Nav />)
    expect(screen.getByText("Profile")).toHaveAttribute("href", "/profile")
    expect(screen.getByRole("button", { name: "User menu" })).toBeInTheDocument()
  })

  it("shows the sign-in button when signed out", () => {
    authState.isSignedIn = false
    render(<Nav />)
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
    expect(screen.queryByText("Profile")).not.toBeInTheDocument()
  })

  it("shows a spinner while auth is loading", () => {
    authState.isLoaded = false
    const { container } = render(<Nav />)
    expect(container.querySelector(".animate-spin")).toBeInTheDocument()
  })
})
