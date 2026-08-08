import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import StarRating from "@/components/StarRating"

describe("StarRating", () => {
  it("renders five stars", () => {
    const { container } = render(<StarRating value={3} />)
    expect(container.querySelectorAll("svg")).toHaveLength(5)
  })

  it("fills stars up to the value", () => {
    const { container } = render(<StarRating value={3} />)
    const stars = container.querySelectorAll("svg")
    expect(stars[0].getAttribute("fill")).toBe("currentColor")
    expect(stars[2].getAttribute("fill")).toBe("currentColor")
    expect(stars[3].getAttribute("fill")).toBe("none")
    expect(stars[4].getAttribute("fill")).toBe("none")
  })

  it("renders buttons in interactive mode", () => {
    render(<StarRating value={0} onChange={vi.fn()} />)
    expect(screen.getAllByRole("button", { name: /Rate . out of 5/ })).toHaveLength(5)
  })

  it("does not render buttons in read-only mode", () => {
    render(<StarRating value={3} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("calls onChange with the clicked star value", async () => {
    const onChange = vi.fn()
    render(<StarRating value={0} onChange={onChange} />)
    await userEvent.click(screen.getByRole("button", { name: "Rate 4 out of 5" }))
    expect(onChange).toHaveBeenCalledWith(4)
  })
})
