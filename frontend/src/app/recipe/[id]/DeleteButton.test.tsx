import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DeleteButton from "@/app/recipe/[id]/DeleteButton"

const mockPush = vi.hoisted(() => vi.fn())

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: vi.fn(), back: vi.fn() }),
}))

beforeEach(() => {
  mockPush.mockClear()
})

describe("DeleteButton", () => {
  it("deletes the recipe and navigates to the trash", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true)
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))

    render(<DeleteButton recipeId="recipe-1" />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/trash")
    })
    vi.unstubAllGlobals()
  })

  it("does not navigate when the user cancels", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false)

    render(<DeleteButton recipeId="recipe-1" />)
    await userEvent.click(screen.getByRole("button", { name: "Delete" }))

    expect(mockPush).not.toHaveBeenCalled()
  })
})
