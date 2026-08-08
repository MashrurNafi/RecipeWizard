import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import RecipeCard from "@/components/RecipeCard"

describe("RecipeCard", () => {
  const baseProps = {
    id: "recipe-1",
    title: "Spaghetti Carbonara",
    cuisine: "Italian",
    timeMinutes: 30,
    servings: 2,
    dietary: ["vegetarian"],
  }

  it("renders the recipe title and meta", () => {
    render(<RecipeCard {...baseProps} />)
    expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument()
    expect(screen.getByText("30 min")).toBeInTheDocument()
    expect(screen.getByText("2 servings")).toBeInTheDocument()
    expect(screen.getByText("Italian")).toBeInTheDocument()
    expect(screen.getByText("vegetarian")).toBeInTheDocument()
  })

  it("links to the recipe detail page", () => {
    render(<RecipeCard {...baseProps} />)
    expect(screen.getByRole("link")).toHaveAttribute("href", "/recipe/recipe-1")
  })

  it("shows the AI badge for AI recipes", () => {
    render(<RecipeCard {...baseProps} source="AI" />)
    expect(screen.getByText("AI")).toBeInTheDocument()
  })

  it("shows the own-recipe badge for manual recipes", () => {
    render(<RecipeCard {...baseProps} source="MANUAL" />)
    expect(screen.getByText("own recipe")).toBeInTheDocument()
  })

  it("shows the average rating when present", () => {
    render(<RecipeCard {...baseProps} averageRating={4.5} reviewCount={3} />)
    expect(screen.getByText("4.5")).toBeInTheDocument()
    expect(screen.getByText("(3 reviews)")).toBeInTheDocument()
  })

  it("shows 'No ratings yet' when there are no reviews", () => {
    render(<RecipeCard {...baseProps} averageRating={null} reviewCount={0} />)
    expect(screen.getByText("No ratings yet")).toBeInTheDocument()
  })

  it("shows the author when showUser is set", () => {
    render(<RecipeCard {...baseProps} showUser authorFirstName="Alice" />)
    expect(screen.getByText("by Alice")).toBeInTheDocument()
  })
})
