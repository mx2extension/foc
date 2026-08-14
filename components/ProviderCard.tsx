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
}

export default function ProviderCard({ provider }: { provider: Provider }) {
  const avatar = getProfessionAvatar(provider.profession, provider.full_name)
  
  // Pre-formatted WhatsApp message
  const waMsg = encodeURIComponent(`Hello ${provider.full_name}, I found you on FindOneCampus (www.findoncampus.com) and I'm interested in your services.`)
  const waLink = `https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${waMsg}`
  
  return (
    <div className="premium-card p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="relative">
          <img src={avatar} alt={provider.full_name} className="w-16 h-16 rounded-2xl object-cover" />
          {provider.verification_status === 'verified' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center">
              <i className="fas fa-check-circle text-blue-500 text-sm"></i>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg leading-tight">{provider.full_name}</h3>
            {provider.membership === 'pro' && (
              <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase">Pro</span>
            )}
          </div>
          <p className="text-sm text-primary">{provider.profession}</p>
          <p className="text-xs text-muted flex items-center gap-1 mt-1">
            <i className="fas fa-location-dot text-[10px]"></i> {provider.city}, {provider.country}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-3">{provider.bio}</p>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {provider.skills.slice(0, 3).map((s: string, i: number) => (
          <span key={i} className="px-2.5 py-1 rounded-full bg-paper text-xs text-ink/70 border border-black/5">{s}</span>
        ))}
      </div>
      <div className="flex gap-2">
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium text-center hover:opacity-90 transition flex items-center justify-center gap-2">
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
        <Link href={`/providers/${provider.id}`} className="flex-1 py-2.5 rounded-full border border-black/10 text-sm font-medium hover:bg-paper transition text-center flex items-center justify-center">
          View Profile
        </Link>
      </div>
    </div>
  )
}