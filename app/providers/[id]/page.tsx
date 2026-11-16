import { supabase } from '@/lib/supabase/client'
import { getProfessionAvatar } from '@/lib/paystack'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ShareReviewLink from './ShareReviewLink'

export const dynamic = 'force-dynamic'

export default async function ProviderProfile({ params }: { params: { id: string } }) {
  // Fetch provider and atomically increment view_count
  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('id', params.id)
    .eq('is_approved', true)
    .single()

  if (!provider) return notFound()

  // Increment view count in background (non-blocking)
  await supabase
    .from('providers')
    .update({ view_count: (provider.view_count || 0) + 1 })
    .eq('id', provider.id)

  const avatar = getProfessionAvatar(provider.profession, provider.full_name)
  
  const waMsg = encodeURIComponent(`Hello ${provider.full_name}, I found you on FindOneCampus (www.findoncampus.com) and I'm interested in your services.`)
  const waLink = `https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${waMsg}`

  const hasReviews = (provider.review_count || 0) > 0

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-24 md:py-32">
      <Link href="/providers" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition">
        <i className="fas fa-arrow-left text-xs"></i> Back to providers
      </Link>

      {/* MOBILE & DESKTOP TOP HEADER SECTION (Side-by-side on mobile to save space) */}
      <div className="premium-card p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4 sm:gap-6">
            <img 
              src={avatar} 
              alt={provider.full_name} 
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl md:rounded-3xl object-cover shrink-0 shadow-sm border border-black/5" 
            />
            
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="serif text-2xl sm:text-3xl text-ink">{provider.full_name}</h1>
                {provider.verification_status === 'verified' && (
                  <i className="fas fa-check-circle text-blue-500 text-lg" title="Verified Provider"></i>
                )}
                {provider.membership === 'pro' && (
                  <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase">Pro</span>
                )}
                {provider.internship_eligible && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                    <i className="fas fa-shield-halved"></i> Internship Ready
                  </span>
                )}
              </div>
              
              <p className="text-primary font-medium text-sm sm:text-base">{provider.profession}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted flex-wrap pt-1">
                <span className="flex items-center gap-1.5">
                  <i className="fas fa-location-dot"></i> {provider.city}, {provider.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fas fa-eye text-primary/70"></i> {provider.view_count || 1} profile views
                </span>
              </div>

              {/* Rating Pill */}
              <div className="pt-2">
                <Link 
                  href={`/providers/${provider.id}/reviews`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper border border-black/10 hover:border-primary/40 transition group"
                >
                  <i className="fas fa-star text-amber-500 text-xs"></i>
                  {hasReviews ? (
                    <span className="text-xs font-semibold text-ink">
                      {Number(provider.average_rating).toFixed(1)}{' '}
                      <span className="text-muted font-normal group-hover:text-primary transition underline-offset-2 group-hover:underline">
                        ({provider.review_count} {provider.review_count === 1 ? 'review' : 'reviews'})
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted group-hover:text-primary transition">
                      No reviews yet · <span className="font-medium text-ink group-hover:text-primary">Be the first</span>
                    </span>
                  )}
                  <i className="fas fa-chevron-right text-[10px] text-muted group-hover:translate-x-0.5 transition-transform"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons at Top (WhatsApp & Write Review) */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-64">
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary justify-center text-sm py-3 shadow-sm"
            >
              <i className="fab fa-whatsapp text-base"></i> Contact via WhatsApp
            </a>
            <Link 
              href={`/providers/${provider.id}/reviews#write-review`}
              className="py-2.5 px-4 rounded-full border border-black/10 text-xs font-medium text-ink hover:bg-paper transition flex items-center justify-center gap-2"
            >
              <i className="far fa-pen-to-square text-muted"></i> Write a Review
            </Link>
          </div>
        </div>
      </div>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        {/* Left Sidebar: Assistance & Socials */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-paper p-5 rounded-2xl border border-black/5">
            <h4 className="text-xs font-semibold text-ink mb-1">Need Assistance?</h4>
            <p className="text-[11px] text-muted leading-relaxed">
              If you have complaints, need mediation, or require assistance with this provider, FindOneCampus is here to stand in the middle. WhatsApp us: {' '}
              <a href="https://wa.me/2349017380098?text=Hello%20FindOneCampus,%20I%20need%20assistance%20with%20a%20provider" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                09017380098
              </a>.
            </p>
          </div>

          {/* Provider Share Review Tool Component */}
          <ShareReviewLink providerName={provider.full_name} providerId={provider.id} />

          {/* Other Social Links (Pro Only) */}
          {provider.membership === 'pro' && provider.social_links && (
            <div className="premium-card p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Social Channels</h4>
              {provider.social_links.twitter && (
                <a href={provider.social_links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs hover:text-primary transition">
                  <i className="fab fa-twitter w-4 text-primary"></i> Twitter / X
                </a>
              )}
              {provider.social_links.tiktok && (
                <a href={provider.social_links.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs hover:text-primary transition">
                  <i className="fab fa-tiktok w-4 text-primary"></i> TikTok
                </a>
              )}
              {provider.social_links.portfolio && (
                <a href={provider.social_links.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs hover:text-primary transition">
                  <i className="fas fa-globe w-4 text-primary"></i> Portfolio Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Main Column: About, Experience, Internship, Education, Skills */}
        <div className="md:col-span-2 space-y-6">
          <div className="premium-card p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-semibold mb-3">About</h2>
            <p className="text-muted text-sm md:text-base leading-relaxed whitespace-pre-line">{provider.bio}</p>
          </div>

          {provider.membership === 'pro' && provider.long_description && (
            <div className="premium-card p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">Detailed Experience <i className="fas fa-crown text-accent text-sm"></i></h2>
              <p className="text-muted text-sm md:text-base leading-relaxed whitespace-pre-line">{provider.long_description}</p>
            </div>
          )}

          {provider.internship_eligible && provider.internship_role && (
            <div className="premium-card p-6 md:p-8 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-shield-halved text-green-600 text-xl"></i>
                <h2 className="text-lg md:text-xl font-semibold text-ink">Open to Internship</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">Desired Role</span>
                  <p className="text-base md:text-lg font-medium text-ink">{provider.internship_role}</p>
                </div>
                
                {provider.internship_pitch && (
                  <div className="pt-2 border-t border-black/5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2 mt-3">Why I'm a Great Fit</span>
                    <p className="text-muted text-sm md:text-base leading-relaxed whitespace-pre-line">{provider.internship_pitch}</p>
                  </div>
                )}

                {provider.social_links?.linkedin && (
                  <div className="pt-4 mt-2 border-t border-black/5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">LinkedIn Profile</span>
                    <a 
                      href={provider.social_links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm text-white bg-[#0077B5] rounded-full font-medium hover:opacity-90 transition shadow-md"
                    >
                      <i className="fab fa-linkedin text-lg"></i> View LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {(provider.education_level || provider.school) && (
            <div className="premium-card p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold mb-3">Education</h2>
              <div className="space-y-2 text-sm">
                {provider.education_level && <p><span className="text-muted">Degree:</span> <span className="font-medium">{provider.education_level}</span></p>}
                {provider.school && <p><span className="text-muted">Institution:</span> <span className="font-medium">{provider.school}</span></p>}
              </div>
            </div>
          )}

          <div className="premium-card p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill: string, i: number) => (
                <span key={i} className="px-3.5 py-1.5 rounded-full bg-paper text-xs md:text-sm border border-black/5">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}