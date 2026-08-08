import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ReviewSection from "@/components/ReviewSection"
import { authState } from "@/test/authState"

const mockApi = vi.hoisted(() => ({
  getReviews: vi.fn(),
  createReview: vi.fn(),
  updateReview: vi.fn(),
  deleteReview: vi.fn(),
}))

vi.mock("@/lib/api", () => mockApi)

const review = {
  id: "rev-1",
  rating: 4,
  comment: "Delicious!",
  userId: "user-2",
  recipeId: "rc1",
  createdAt: "2026-01-01T00:00:00Z",
  user: { id: "user-2", firstName: "Alice", lastName: null, imageUrl: null },
}

afterEach(() => {
  authState.isSignedIn = true
  vi.clearAllMocks()
})

describe("ReviewSection", () => {
  it("loads and displays reviews with the average rating", async () => {
    mockApi.getReviews.mockResolvedValue({ reviews: [review], averageRating: 4 })

    render(<ReviewSection recipeId="rc1" currentUserId="user-1" />)

    expect(await screen.findByText("Delicious!")).toBeInTheDocument()
    expect(screen.getByText("(1 review)")).toBeInTheDocument()
    expect(screen.getAllByText("4.0").length).toBeGreaterThanOrEqual(1)
  })

  it("shows the empty state when there are no reviews", async () => {
    mockApi.getReviews.mockResolvedValue({ reviews: [], averageRating: null })

    render(<ReviewSection recipeId="rc1" currentUserId="user-1" />)

    expect(
      await screen.findByText("No reviews yet. Be the first to review this recipe!")
    ).toBeInTheDocument()
  })

  it("shows an error when reviews fail to load", async () => {
    mockApi.getReviews.mockRejectedValue(new Error("network"))

    render(<ReviewSection recipeId="rc1" currentUserId="user-1" />)

    expect(await screen.findByText("Failed to load reviews")).toBeInTheDocument()
  })

  it("prompts sign-in when the user is signed out", async () => {
    authState.isSignedIn = false
    mockApi.getReviews.mockResolvedValue({ reviews: [], averageRating: null })

    render(<ReviewSection recipeId="rc1" currentUserId="user-1" />)

    expect(
      await screen.findByText("Sign in to rate and review this recipe.")
    ).toBeInTheDocument()
  })

  it("creates a review when signed in without an existing one", async () => {
    mockApi.getReviews.mockResolvedValue({ reviews: [], averageRating: null })
    mockApi.createReview.mockResolvedValue({ review: { ...review, userId: "user-1" } })

    render(<ReviewSection recipeId="rc1" currentUserId="user-1" />)

    await userEvent.click(await screen.findByRole("button", { name: "Rate 5 out of 5" }))
    await userEvent.type(screen.getByLabelText("Your comment"), "Amazing!")
    await userEvent.click(screen.getByRole("button", { name: "Post Review" }))

    await waitFor(() => {
      expect(mockApi.createReview).toHaveBeenCalledWith(
        "rc1",
        { rating: 5, comment: "Amazing!" },
        "test-token"
      )
    })
  })

  it("shows the edit and delete actions for the current user's review", async () => {
    mockApi.getReviews.mockResolvedValue({
      reviews: [{ ...review, userId: "user-1", user: { ...review.user, id: "user-1" } }],
      averageRating: 4,
    })

    render(<ReviewSection recipeId="rc1" currentUserId="user-1" />)

    expect(await screen.findByRole("button", { name: "Edit" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("deletes the review after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true)
    mockApi.getReviews.mockResolvedValue({
      reviews: [{ ...review, userId: "user-1", user: { ...review.user, id: "user-1" } }],
      averageRating: 4,
    })
    mockApi.deleteReview.mockResolvedValue({ success: true })

    render(<ReviewSection recipeId="rc1" currentUserId="user-1" />)

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }))

    await waitFor(() => {
      expect(mockApi.deleteReview).toHaveBeenCalledWith("rc1", "rev-1", "test-token")
    })
  })
})
