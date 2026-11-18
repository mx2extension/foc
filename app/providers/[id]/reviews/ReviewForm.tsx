'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function ReviewForm({
  providerId,
  providerName,
}: {
  providerId: string
  providerName: string
}) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerWhatsapp, setReviewerWhatsapp] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!reviewerName.trim() || !comment.trim()) {
      setError('Please enter your name and review.')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase.from('reviews').insert({
      provider_id: providerId,
      reviewer_name: reviewerName.trim(),
      reviewer_whatsapp: reviewerWhatsapp.trim() || null,
      rating,
      comment: comment.trim(),
      is_approved: true,
    })

    setSubmitting(false)

    if (insertError) {
      setError('Could not submit review right now. Please try again.')
      return
    }

    setSubmitted(true)
    router.refresh()
  }

  if (submitted) {
    return (
      <div className="premium-card p-8 border-l-4 border-l-green-500">
        <div className="flex items-center gap-3 mb-2">
          <i className="fas fa-check-circle text-green-600 text-xl"></i>
          <h3 className="text-lg font-semibold text-ink">Thank you for your feedback!</h3>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          Your review for <span className="font-medium text-ink">{providerName}</span> has been published.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="premium-card p-8">
      <h3 className="text-xl font-semibold text-ink mb-1">Leave a Review</h3>
      <p className="text-xs text-muted mb-6">
        Share an honest review of your experience working with {providerName}.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Interactive Star Selector */}
      <div className="mb-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-2xl transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <i
                className={
                  star <= (hoveredRating || rating)
                    ? 'fas fa-star text-amber-500'
                    : 'far fa-star text-black/20'
                }
              ></i>
            </button>
          ))}
          <span className="text-xs font-medium text-muted ml-2">
            {rating === 5 && 'Excellent'}
            {rating === 4 && 'Very Good'}
            {rating === 3 && 'Good'}
            {rating === 2 && 'Fair'}
            {rating === 1 && 'Poor'}
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="e.g. Amina Bello"
            className="w-full px-4 py-2.5 rounded-xl bg-paper border border-black/10 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            WhatsApp Number <span className="text-muted font-normal">(Private, optional)</span>
          </label>
          <input
            type="tel"
            value={reviewerWhatsapp}
            onChange={(e) => setReviewerWhatsapp(e.target.value)}
            placeholder="e.g. 08012345678"
            className="w-full px-4 py-2.5 rounded-xl bg-paper border border-black/10 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-ink mb-1.5">
          Your Review *
        </label>
        <textarea
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`How was your experience working with ${providerName}?`}
          className="w-full px-4 py-3 rounded-xl bg-paper border border-black/10 text-sm focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full sm:w-auto justify-center disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}