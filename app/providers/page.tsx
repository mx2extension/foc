'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ProviderCard from '@/components/ProviderCard'

const CATEGORIES = [
  'Technology & IT', 'Design & Creatives', 'Business & Finance', 'Media & Entertainment',
  'Education & Training', 'Health & Wellness', 'Beauty & Fashion', 'Food & Catering',
  'Events & Planning', 'Home & Repair Services', 'Logistics & Transport',
  'Agriculture & Environment', 'Legal & Admin Services', 'Construction & Real Estate',
  'Construction & Engineering', 'Real Estate'
];

function ProvidersContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  
  const [providers, setProviders] = useState<any[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')
  const [visibleCount, setVisibleCount] = useState(12)
  
  // Toggle Filters
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [onlyPro, setOnlyPro] = useState(false)
  const [onlyInternship, setOnlyInternship] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await supabase.from('providers').select('country').not('country', 'is', null).neq('country', '')
      const uniqueCountries = Array.from(new Set(data?.map((p: any) => p.country.trim()).filter(Boolean)))
      setCountries(uniqueCountries.sort())
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchProviders = async () => {
      let query = supabase.from('providers').select('*').eq('is_approved', true)
      
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,profession.ilike.%${search}%,skills.cs.{${search}}`)
      }
      if (category) {
        query = query.eq('category', category)
      }
      if (country) {
        query = query.eq('country', country)
      }
      if (onlyVerified) {
        query = query.eq('verification_status', 'verified')
      }
      if (onlyPro) {
        query = query.eq('membership', 'pro')
      }
      if (onlyInternship) {
        query = query.eq('internship_eligible', true)
      }

      const { data } = await query

      if (data) {
        const sortedData = data.sort((a: any, b: any) => {
          const aScore = (a.verification_status === 'verified' ? 2 : 0) + (a.membership === 'pro' ? 1 : 0)
          const bScore = (b.verification_status === 'verified' ? 2 : 0) + (b.membership === 'pro' ? 1 : 0)
          
          if (aScore !== bScore) {
            return bScore - aScore
          }
          
          return Math.random() - 0.5
        })
        setProviders(sortedData)
        setVisibleCount(12)
      } else {
        setProviders([])
      }
    }
    fetchProviders()
  }, [search, category, country, onlyVerified, onlyPro, onlyInternship])

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-10 sm:py-32">
      <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-primary font-medium mb-2 sm:mb-6">
        <span className="w-4 sm:w-5 h-px bg-primary"></span>
        The directory
      </div>
      <h1 className="serif mb-2 sm:mb-6 text-3xl sm:text-6xl lg:text-8xl" style={{ lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        All <span className="serif-italic gradient-text">Providers.</span>
      </h1>
      <p className="text-xs sm:text-lg text-muted mb-4 sm:mb-12 max-w-xl">
        Search trusted professionals across every field. Filter by category, skills, country, or badges.
      </p>

      {/* Search and Dropdowns: Compact 2-column on mobile, 3-column on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
        <input 
          type="text" 
          placeholder="Search name or skill..." 
          className="form-input text-xs sm:text-base py-2 col-span-2 md:col-span-1" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input text-xs sm:text-base py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select className="form-input text-xs sm:text-base py-2" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Toggle Badges: Inline wrapping row so they don't stack awkwardly */}
      <div className="flex flex-row flex-wrap items-center gap-1.5 mb-6 border-b border-black/5 pb-3">
        <button 
          onClick={() => setOnlyVerified(!onlyVerified)}
          className={`px-3 py-1.5 rounded-full text-[11px] sm:text-sm font-medium transition flex items-center gap-1 whitespace-nowrap ${onlyVerified ? 'bg-blue-500 text-white' : 'bg-paper border border-black/5 text-muted hover:text-ink'}`}
        >
          <i className="fas fa-check-circle"></i> Verified Only
        </button>
        <button 
          onClick={() => setOnlyPro(!onlyPro)}
          className={`px-3 py-1.5 rounded-full text-[11px] sm:text-sm font-medium transition flex items-center gap-1 whitespace-nowrap ${onlyPro ? 'bg-accent text-white' : 'bg-paper border border-black/5 text-muted hover:text-ink'}`}
        >
          <i className="fas fa-crown"></i> Pro Members
        </button>
        <button 
          onClick={() => setOnlyInternship(!onlyInternship)}
          className={`px-3 py-1.5 rounded-full text-[11px] sm:text-sm font-medium transition flex items-center gap-1 whitespace-nowrap ${onlyInternship ? 'bg-green-600 text-white' : 'bg-paper border border-black/5 text-muted hover:text-ink'}`}
        >
          <i className="fas fa-shield-halved"></i> Internship Ready
        </button>
      </div>

      {providers.length === 0 ? (
        <p className="text-center py-20 text-muted">No providers match your search. Try different filters.</p>
      ) : (
        <>
          {/* 2x2 Grid on mobile (2 columns), 3 columns on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {providers.slice(0, visibleCount).map((p: any) => <ProviderCard key={p.id} provider={p} />)}
          </div>
          
          {/* View More Button */}
          {providers.length > visibleCount && (
            <div className="text-center mt-8">
              <button 
                onClick={() => setVisibleCount(visibleCount + 12)} 
                className="btn-secondary !py-2.5 !px-6 text-xs sm:text-base"
              >
                View More Providers <i className="fas fa-arrow-down ml-2 text-xs"></i>
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