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
  const [visibleCount, setVisibleCount] = useState(12) // Start by showing 12 providers
  
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
          
          // If scores are different, prioritize the higher badge (Verified > Pro > Free)
          if (aScore !== bScore) {
            return bScore - aScore
          }
          
          // If scores are the same, scramble them randomly on every load/refresh!
          return Math.random() - 0.5
        })
        setProviders(sortedData)
        setVisibleCount(12) // Reset visible count to 12 when filters change
      } else {
        setProviders([])
      }
    }
    fetchProviders()
  }, [search, category, country, onlyVerified, onlyPro, onlyInternship])

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        The directory
      </div>
      <h1 className="serif mb-6" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        All <span className="serif-italic gradient-text">Providers.</span>
      </h1>
      <p className="text-lg text-muted mb-12 max-w-xl">
        Search trusted professionals across every field. Filter by category, skills, country, or badges.
      </p>

      {/* Search and Dropdowns */}
      <div className="grid md:grid-cols-3 gap-3 mb-6">
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
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Toggle Badges */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-black/5 pb-4">
        <button 
          onClick={() => setOnlyVerified(!onlyVerified)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${onlyVerified ? 'bg-blue-500 text-white' : 'bg-paper border border-black/5 text-muted hover:text-ink'}`}
        >
          <i className="fas fa-check-circle"></i> Verified Only
        </button>
        <button 
          onClick={() => setOnlyPro(!onlyPro)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${onlyPro ? 'bg-accent text-white' : 'bg-paper border border-black/5 text-muted hover:text-ink'}`}
        >
          <i className="fas fa-crown"></i> Pro Members
        </button>
        <button 
          onClick={() => setOnlyInternship(!onlyInternship)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${onlyInternship ? 'bg-green-600 text-white' : 'bg-paper border border-black/5 text-muted hover:text-ink'}`}
        >
          <i className="fas fa-shield-halved"></i> Internship Ready
        </button>
      </div>

      {providers.length === 0 ? (
        <p className="text-center py-20 text-muted">No providers match your search. Try different filters.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Only slice the array to show the visibleCount amount */}
            {providers.slice(0, visibleCount).map((p: any) => <ProviderCard key={p.id} provider={p} />)}
          </div>
          
          {/* View More Button */}
          {providers.length > visibleCount && (
            <div className="text-center mt-12">
              <button 
                onClick={() => setVisibleCount(visibleCount + 12)} 
                className="btn-secondary !py-3 !px-8"
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