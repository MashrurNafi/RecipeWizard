import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TrashItem from "@/app/trash/TrashItem"

const mockApi = vi.hoisted(() => ({
  restoreRecipe: vi.fn(),
  deleteRecipeForever: vi.fn(),
}))

vi.mock("@/lib/api", () => mockApi)

const props = {
  id: "recipe-1",
  title: "Pancakes",
  cuisine: "American",
  timeMinutes: 20,
  servings: 4,
  source: "MANUAL" as const,
  daysLeft: 5,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("TrashItem", () => {
  it("renders the recipe details", () => {
    render(<TrashItem {...props} />)
    expect(screen.getByText("Pancakes")).toBeInTheDocument()
    expect(screen.getByText("American · 20 min · 4 servings · permanently deleted in 5 days")).toBeInTheDocument()
  })

  it("shows 'expiring soon' when no days are left", () => {
    render(<TrashItem {...props} daysLeft={0} />)
    expect(screen.getByText("American · 20 min · 4 servings · expiring soon")).toBeInTheDocument()
  })

  it("restores the recipe", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true)
    mockApi.restoreRecipe.mockResolvedValue({ success: true })

    render(<TrashItem {...props} />)
    await userEvent.click(screen.getByRole("button", { name: "Restore" }))

    await waitFor(() => {
      expect(mockApi.restoreRecipe).toHaveBeenCalledWith("recipe-1", "test-token")
    })
  })

  it("permanently deletes the recipe after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true)
    mockApi.deleteRecipeForever.mockResolvedValue({ success: true })

    render(<TrashItem {...props} />)
    await userEvent.click(screen.getByRole("button", { name: "Delete Forever" }))

    await waitFor(() => {
      expect(mockApi.deleteRecipeForever).toHaveBeenCalledWith("recipe-1", "test-token")
    })
  })

  it("does not purge when the confirmation is declined", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false)

    render(<TrashItem {...props} />)
    await userEvent.click(screen.getByRole("button", { name: "Delete Forever" }))

    expect(mockApi.deleteRecipeForever).not.toHaveBeenCalled()
  })
})
