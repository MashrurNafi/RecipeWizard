"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { createReview, deleteReview, getReviews, updateReview, type ReviewData } from "@/lib/api"
import StarRating from "./StarRating"

interface ReviewSectionProps {
  recipeId: string
  currentUserId: string | null
}

export default function ReviewSection({ recipeId, currentUserId }: ReviewSectionProps) {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const myReview = currentUserId ? reviews.find((review) => review.user.id === currentUserId) ?? null : null

  async function loadReviews() {
    try {
      const data = await getReviews(recipeId)
      setReviews(data.reviews)
      setAverageRating(data.averageRating)
    } catch {
      setError("Failed to load reviews")
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getReviews(recipeId)
        if (cancelled) return
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
      } catch {
        if (!cancelled) setError("Failed to load reviews")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [recipeId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating < 1) {
      setError("Please select a rating")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) return
      if (myReview) {
        await updateReview(recipeId, myReview.id, { rating, comment: comment || undefined }, token)
      } else {
        await createReview(recipeId, { rating, comment: comment || undefined }, token)
      }
      setComment("")
      setRating(0)
      setEditing(false)
      await loadReviews()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!myReview || !confirm("Delete your review?")) return
    setSubmitting(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) return
      await deleteReview(recipeId, myReview.id, token)
      setEditing(false)
      setComment("")
      setRating(0)
      await loadReviews()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review")
    } finally {
      setSubmitting(false)
    }
  }

  function startEditing() {
    if (!myReview) return
    setRating(myReview.rating)
    setComment(myReview.comment ?? "")
    setEditing(true)
  }

  const showForm = isSignedIn && !myReview

  return (
    <section className="mt-10 border-t border-zinc-200 pt-8">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {averageRating !== null && (
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <StarRating value={averageRating} size="sm" />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span>({reviews.length} review{reviews.length === 1 ? "" : "s"})</span>
          </div>
        )}
      </div>

      {!isLoaded ? (
        <p className="mb-6 flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          Checking your account...
        </p>
      ) : !isSignedIn ? (
        <p className="mb-6 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          Sign in to rate and review this recipe.
        </p>
      ) : null}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
          <label className="mb-2 block text-sm font-medium text-zinc-700">Your rating</label>
          <div className="mb-4 flex items-center gap-3">
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && <span className="text-sm font-semibold text-zinc-700">{rating.toFixed(1)}</span>}
          </div>
          <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-zinc-700">
            Your comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="What did you think of this recipe?"
            className="mb-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      )}

      {myReview && editing && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <label className="mb-2 block text-sm font-medium text-zinc-700">Update your rating</label>
          <div className="mb-4 flex items-center gap-3">
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && <span className="text-sm font-semibold text-zinc-700">{rating.toFixed(1)}</span>}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Update your comment"
            className="mb-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-4 text-sm text-zinc-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="py-4 text-sm text-zinc-500">No reviews yet. Be the first to review this recipe!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {review.user.imageUrl ? (
                    <img src={review.user.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {review.user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">
                      {review.user.firstName || "User"}{" "}
                      {review.user.lastName ? review.user.lastName : ""}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-xs font-semibold text-zinc-600">{review.rating.toFixed(1)}</span>
                </div>
              </div>
              {review.comment && <p className="text-sm leading-relaxed text-zinc-700">{review.comment}</p>}
              {myReview?.id === review.id && !editing && (
                <div className="mt-3 flex gap-2 border-t border-zinc-100 pt-3">
                  <button
                    onClick={startEditing}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
