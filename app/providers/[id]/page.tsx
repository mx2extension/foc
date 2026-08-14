import { supabase } from '@/lib/supabase/client'
import { getProfessionAvatar } from '@/lib/paystack'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProviderProfile({ params }: { params: { id: string } }) {
  const { data: provider } = await supabase
    .from('providers')
    .select('*')
    .eq('id', params.id)
    .eq('is_approved', true)
    .single()

  if (!provider) return notFound()

  const avatar = getProfessionAvatar(provider.profession, provider.full_name)
  
  // Pre-formatted WhatsApp message
  const waMsg = encodeURIComponent(`Hello ${provider.full_name}, I found you on FindOneCampus (www.findoncampus.com) and I'm interested in your services.`)
  const waLink = `https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${waMsg}`

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-32">
      <Link href="/providers" className="mb-12 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition">
        <i className="fas fa-arrow-left text-xs"></i> Back to providers
      </Link>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="sticky top-32">
            <img src={avatar} alt={provider.full_name} className="w-full aspect-square rounded-3xl object-cover mb-6" />
            
            <div className="flex items-center gap-2 mb-4">
              <h1 className="serif text-3xl">{provider.full_name}</h1>
              {provider.verification_status === 'verified' && (
                <i className="fas fa-check-circle text-blue-500 text-xl"></i>
              )}
              {provider.membership === 'pro' && (
                <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase">Pro</span>
              )}
            </div>
            
            <p className="text-primary font-medium mb-2">{provider.profession}</p>
            <p className="text-muted text-sm flex items-center gap-2 mb-6">
              <i className="fas fa-location-dot"></i> {provider.city}, {provider.country}
            </p>

            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mb-4">
              <i className="fab fa-whatsapp"></i> Contact via WhatsApp
            </a>

            {/* Mediation Note for Clients */}
            <div className="bg-paper p-4 rounded-xl border border-black/5 mt-6">
              <h4 className="text-xs font-semibold text-ink mb-1">Need Assistance?</h4>
              <p className="text-[11px] text-muted leading-relaxed">
                If you have complaints, need mediation, or require assistance with this provider, FindOneCampus is here to stand in the middle. WhatsApp us: {' '}
                <a href="https://wa.me/2349017380098?text=Hello%20FindOneCampus,%20I%20need%20assistance%20with%20a%20provider" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                  09017380098
                </a>.
              </p>
            </div>

            {/* Social Links (Pro Only) */}
            {provider.membership === 'pro' && (
              <div className="mt-8 space-y-3">
                {provider.social_links?.linkedin && (
                  <a href={provider.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition">
                    <i className="fab fa-linkedin w-5"></i> LinkedIn
                  </a>
                )}
                {provider.social_links?.twitter && (
                  <a href={provider.social_links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition">
                    <i className="fab fa-twitter w-5"></i> Twitter / X
                  </a>
                )}
                {provider.social_links?.tiktok && (
                  <a href={provider.social_links.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition">
                    <i className="fab fa-tiktok w-5"></i> TikTok
                  </a>
                )}
                {provider.social_links?.portfolio && (
                  <a href={provider.social_links.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition">
                    <i className="fas fa-globe w-5"></i> Portfolio Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="premium-card p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{provider.bio}</p>
          </div>

          {/* Long Description (Pro Only) */}
          {provider.membership === 'pro' && provider.long_description && (
            <div className="premium-card p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Detailed Experience <i className="fas fa-crown text-accent text-sm"></i></h2>
              <p className="text-muted leading-relaxed whitespace-pre-line">{provider.long_description}</p>
            </div>
          )}

          {/* Education Details */}
          {(provider.education_level || provider.school) && (
            <div className="premium-card p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-2 text-sm">
                {provider.education_level && <p><span className="text-muted">Degree:</span> <span className="font-medium">{provider.education_level}</span></p>}
                {provider.school && <p><span className="text-muted">Institution:</span> <span className="font-medium">{provider.school}</span></p>}
              </div>
            </div>
          )}

          <div className="premium-card p-8">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill: string, i: number) => (
                <span key={i} className="px-4 py-2 rounded-full bg-paper text-sm border border-black/5">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}