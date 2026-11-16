import { supabase } from '@/lib/supabase/client'
import { getProfessionAvatar } from '@/lib/paystack'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReviewForm from './ReviewForm'

export const dynamic = 'force-dynamic'

// Dynamic SEO Metadata for Google Indexing
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: provider } = await supabase
    .from('providers')
    .select('full_name, profession, city, average_rating, review_count')
    .eq('id', params.id)
    .eq('is_approved', true)
    .single()

  if (!provider) return { title: 'Provider Not Found | FindOneCampus' }

  const ratingText = provider.review_count > 0 
    ? `Rated ${Number(provider.average_rating).toFixed(1)}/5 from ${provider.review_count} reviews.` 
    : 'Read verified client feedback or leave a review.'

  return {
    title: `${provider.full_name} Reviews (${provider.profession}) | FindOneCampus`,
    description: `Client reviews and ratings for ${provider.full_name}, ${provider.profession} in ${provider.city}. ${ratingText}`,
  }
}

export default async function ProviderReviewsPage({ params }: { params: { id: string } }) {
  const [{ data: provider }, { data: reviews }] = await Promise.all([
    supabase
      .from('providers')
      .select('*')
      .eq('id', params.id)
      .eq('is_approved', true)
      .single(),
    supabase
      .from('reviews')
      .select('id, reviewer_name, rating, comment, created_at')
      .eq('provider_id', params.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false }),
  ])

  if (!provider) return notFound()

  const avatar = getProfessionAvatar(provider.profession, provider.full_name)
  const approvedReviews = reviews || []
  const totalReviews = approvedReviews.length
  const averageRating = totalReviews > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0'

  // Calculate star breakdown (5 down to 1)
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = approvedReviews.filter((r) => r.rating === star).length
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
    return { star, count, percentage }
  })

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: provider.full_name,
    jobTitle: provider.profession,
    url: `https://www.findoncampus.com/providers/${provider.id}`,
    ...(totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: totalReviews,
        bestRating: '5',
        worstRating: '1',
      },
      review: approvedReviews.slice(0, 10).map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.reviewer_name },
        datePublished: r.created_at,
        reviewBody: r.comment,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: '5',
          worstRating: '1',
        },
      })),
    }),
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/providers/${provider.id}`}
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition"
      >
        <i className="fas fa-arrow-left text-xs"></i> Back to {provider.full_name}&apos;s profile
      </Link>

      {/* Provider Mini-Header */}
      <div className="premium-card p-6 md:p-8 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={provider.full_name}
            className="w-16 h-16 rounded-2xl object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="serif text-2xl md:text-3xl text-ink">{provider.full_name}</h1>
              {provider.verification_status === 'verified' && (
                <i className="fas fa-check-circle text-blue-500 text-base"></i>
              )}
            </div>
            <p className="text-sm text-primary font-medium">{provider.profession}</p>
            <p className="text-xs text-muted mt-0.5">{provider.city}, {provider.country}</p>
          </div>
        </div>

        <a
          href="#write-review"
          className="btn-primary justify-center shrink-0 text-sm"
        >
          <i className="fas fa-star text-xs"></i> Write a Review
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left Column: Rating Score & Breakdown */}
        <div className="md:col-span-1">
          <div className="premium-card p-6 sticky top-32">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">
              Rating Overview
            </h2>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="serif text-5xl font-semibold text-ink">{averageRating}</span>
              <span className="text-sm text-muted">out of 5.0</span>
            </div>

            <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={
                    Number(averageRating) >= star
                      ? 'fas fa-star'
                      : Number(averageRating) >= star - 0.5
                      ? 'fas fa-star-half-alt'
                      : 'far fa-star text-black/20'
                  }
                ></i>
              ))}
            </div>

            <p className="text-xs text-muted mb-6">
              Based on {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
            </p>

            {/* Star Distribution Bars */}
            <div className="space-y-2.5 pt-4 border-t border-black/5">
              {ratingBreakdown.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-medium text-ink flex items-center gap-1">
                    {star} <i className="fas fa-star text-[10px] text-amber-500"></i>
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-paper overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-muted">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reviews Feed & Submission Form */}
        <div className="md:col-span-2 space-y-8">
          {/* Reviews List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Client Reviews ({totalReviews})
            </h2>

            {approvedReviews.length === 0 ? (
              <div className="premium-card p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center mx-auto mb-3 text-muted">
                  <i className="far fa-comment-dots text-xl"></i>
                </div>
                <h3 className="font-semibold text-ink mb-1">No reviews yet</h3>
                <p className="text-sm text-muted max-w-md mx-auto">
                  Worked with {provider.full_name} recently? Share your experience below to help other clients on FindOneCampus.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedReviews.map((review) => (
                  <div key={review.id} className="premium-card p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center uppercase">
                          {review.reviewer_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-ink">{review.reviewer_name}</p>
                          <p className="text-[11px] text-muted">
                            {new Date(review.created_at).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={star <= review.rating ? 'fas fa-star' : 'far fa-star text-black/20'}
                          ></i>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Review Form */}
          <div id="write-review" className="scroll-mt-32 pt-4">
            <ReviewForm providerId={provider.id} providerName={provider.full_name} />
          </div>
        </div>
      </div>
    </div>
  )
}