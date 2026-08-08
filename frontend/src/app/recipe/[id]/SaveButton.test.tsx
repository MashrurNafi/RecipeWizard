import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SaveButton from "@/app/recipe/[id]/SaveButton"

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("SaveButton", () => {
  it("saves an unsaved recipe", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal("fetch", fetchMock)

    render(<SaveButton recipeId="recipe-1" initialSaved={false} />)
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Save" }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/saved-recipes",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ recipeId: "recipe-1" }),
          headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
        })
      )
    })
    expect(screen.getByRole("button", { name: "Saved ✓" })).toBeInTheDocument()
    vi.unstubAllGlobals()
  })

  it("unsaves a saved recipe", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal("fetch", fetchMock)

    render(<SaveButton recipeId="recipe-1" initialSaved={true} />)

    await userEvent.click(screen.getByRole("button", { name: "Saved ✓" }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/saved-recipes/recipe-1",
        expect.objectContaining({ method: "DELETE" })
      )
    })
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
    vi.unstubAllGlobals()
  })

  it("stays unsaved when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))

    render(<SaveButton recipeId="recipe-1" initialSaved={false} />)
    await userEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})
