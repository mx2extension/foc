import { getProfessionAvatar } from '@/lib/paystack'
import Link from 'next/link'

interface Provider {
  id: string
  full_name: string
  profession: string
  bio: string
  whatsapp: string
  country: string
  city: string
  skills: string[]
  social_links: any
  verification_status: string
  membership: string
  internship_eligible: boolean
}

export default function ProviderCard({ provider }: { provider: Provider }) {
  const avatar = getProfessionAvatar(provider.profession, provider.full_name)
  
  const waMsg = encodeURIComponent(`Hello ${provider.full_name}, I found you on FindOneCampus (www.findoncampus.com) and I'm interested in your services.`)
  const waLink = `https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${waMsg}`
  
  return (
    <div className="premium-card overflow-hidden flex flex-col justify-between h-full p-0 sm:p-6">
      <div>
        {/* Mobile Top Banner (LinkedIn style) - Hidden on Desktop */}
        <div className="h-12 bg-gradient-to-r from-primary/15 to-accent/15 sm:hidden relative">
          {provider.membership === 'pro' && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 text-accent text-[9px] font-bold uppercase shadow-xs">
              Pro
            </span>
          )}
          {provider.internship_eligible && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-green-600 text-white text-[9px] font-bold uppercase shadow-xs">
              Intern
            </span>
          )}
        </div>

        {/* Header: Centered & overlapping banner on mobile, side-by-side on desktop */}
        <div className="px-3 sm:px-0 -mt-8 sm:mt-0 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 mb-2.5 sm:mb-5">
          <div className="relative shrink-0">
            <img 
              src={avatar} 
              alt={provider.full_name} 
              className="w-16 h-16 rounded-full sm:rounded-2xl object-cover border-2 border-white sm:border-0 shadow-sm sm:shadow-none bg-white" 
            />
            {provider.verification_status === 'verified' && (
              <div className="absolute bottom-0 right-0 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-white flex items-center justify-center">
                <i className="fas fa-check-circle text-blue-500 text-xs sm:text-sm"></i>
              </div>
            )}
            {provider.internship_eligible && (
              <div className="hidden sm:flex absolute -top-1 -left-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white items-center justify-center" title="Secured Internship Available">
                <i className="fas fa-shield-halved text-white text-[10px]"></i>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-lg leading-snug line-clamp-2 sm:line-clamp-1">
                {provider.full_name}
              </h3>
              {/* Desktop Badges */}
              {provider.membership === 'pro' && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase">Pro</span>
              )}
              {provider.internship_eligible && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Internship Ready</span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-primary line-clamp-2 sm:line-clamp-1 mt-0.5 leading-tight">
              {provider.profession}
            </p>
            <p className="text-[11px] sm:text-xs text-muted flex items-center justify-center sm:justify-start gap-1 mt-1 truncate">
              <i className="fas fa-location-dot text-[9px]"></i> {provider.city}, {provider.country}
            </p>
          </div>
        </div>

        {/* Bio & Skills: Hidden on mobile so 4 cards fit cleanly in view; visible on desktop */}
        <p className="hidden sm:line-clamp-3 text-sm text-muted leading-relaxed mb-5">
          {provider.bio}
        </p>
        
        <div className="hidden sm:flex flex-wrap gap-1.5 mb-6">
          {provider.skills?.slice(0, 3).map((s: string, i: number) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-paper text-xs text-ink/70 border border-black/5">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons: Clean pill layout on mobile, dual full buttons on desktop */}
      <div className="px-3 pb-3 sm:p-0 flex items-center gap-1.5 sm:gap-2 mt-auto">
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1 py-1.5 sm:py-2.5 rounded-full bg-[#25D366] text-white text-xs sm:text-sm font-medium text-center hover:opacity-90 transition flex items-center justify-center gap-1.5"
        >
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
        <Link 
          href={`/providers/${provider.id}`} 
          title="View Profile"
          className="w-8 h-8 sm:w-auto sm:h-auto sm:flex-1 sm:py-2.5 rounded-full border border-black/15 text-xs sm:text-sm font-medium hover:bg-paper transition flex items-center justify-center shrink-0"
        >
          <span className="hidden sm:inline">View Profile</span>
          <i className="fas fa-arrow-up-right-from-square text-[11px] sm:hidden text-ink/70"></i>
        </Link>
      </div>
    </div>
  )
}