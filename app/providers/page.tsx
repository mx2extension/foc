'use client'
import { useState, useEffect, Suspense, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ProviderCard from '@/components/ProviderCard'

const CATEGORIES = [
  'Technology & IT', 'Design & Creatives', 'Business & Finance', 'Media & Entertainment',
  'Education & Training', 'Health & Wellness', 'Beauty & Fashion', 'Food & Catering',
  'Events & Planning', 'Home & Repair Services', 'Construction & Engineering', 'Real Estate',
  'Logistics & Transport', 'Agriculture & Environment', 'Legal & Admin Services'
]

const ITEMS_PER_PAGE = 9 // Number of providers shown initially and per "View More" click

function ProvidersContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  
  const [providers, setProviders] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchProviders = async () => {
      let query = supabase.from('providers').select('*').eq('is_approved', true)
      
      if (search) query = query.or(`full_name.ilike.%${search}%,profession.ilike.%${search}%,skills.cs.{${search}}`)
      if (category) query = query.eq('category', category)
      if (country) query = query.eq('country', country)

      const { data } = await query
      if (data) {
        const privilegedUsers: any[] = []
        const freeUsers: any[] = []

        // Separate users into their respective tiers
        data.forEach((p: any) => {
          const isPrivileged = p.verification_status === 'verified' || p.membership === 'pro'
          if (isPrivileged) {
            privilegedUsers.push(p)
          } else {
            freeUsers.push(p)
          }
        })

        // Randomize the privileged tier internally so Pro/Verified users rotate fairly among themselves
        const shuffledPrivileged = [...privilegedUsers].sort(() => Math.random() - 0.5)

        // Randomize the free tier internally so all standard users get equal rotation chances
        const shuffledFreeUsers = [...freeUsers].sort(() => Math.random() - 0.5)

        // Combine: Shuffled privileged users stay on top, followed by shuffled free users underneath
        setProviders([...shuffledPrivileged, ...shuffledFreeUsers])
        setVisibleCount(ITEMS_PER_PAGE) // Reset pagination view limit on filter change
      } else {
        setProviders([])
      }
    }
    
    startTransition(() => {
      fetchProviders()
    })
  }, [search, category, country])

  const handleViewMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE)
  }

  const displayedProviders = providers.slice(0, visibleCount)
  const hasMore = visibleCount < providers.length

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>The directory
      </div>
      <h1 className="serif mb-6" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        All <span className="serif-italic gradient-text">Providers.</span>
      </h1>
      <p className="text-lg text-muted mb-12 max-w-xl">Search trusted professionals across every field. Filter by category, skills, country, or location.</p>

      <div className="grid md:grid-cols-3 gap-3 mb-10">
        <input 
          type="text" 
          placeholder="Search by name or skill..." 
          className="form-input" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select className="form-input" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          <option>Nigeria</option><option>Kenya</option><option>Ghana</option><option>South Africa</option>
        </select>
      </div>

      {isPending ? (
        <div className="text-center py-20 text-muted">Refreshing directory...</div>
      ) : providers.length === 0 ? (
        <p className="text-center py-20 text-muted">No providers match your search. Try different filters.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProviders.map((p: any) => <ProviderCard key={p.id} provider={p} />)}
          </div>

          {/* View More Button Section */}
          {hasMore && (
            <div className="mt-16 text-center">
              <button 
                onClick={handleViewMore}
                className="px-8 py-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all duration-300 border border-primary/20"
              >
                View More Providers ({providers.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ProvidersDirectory() {
  return (
    <Suspense fallback={<div className="py-32 text-center">Loading directory...</div>}>
      <ProvidersContent />
    </Suspense>
  )
}