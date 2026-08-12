'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ProviderCard from '@/components/ProviderCard'

const CATEGORIES = [
  'Technology & IT', 'Design & Creatives', 'Business & Finance', 'Media & Entertainment',
  'Education & Training', 'Health & Wellness', 'Beauty & Fashion', 'Food & Catering',
  'Events & Planning', 'Home & Repair Services', 'Logistics & Transport',
  'Agriculture & Environment', 'Legal & Admin Services'
]

function ProvidersContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || ''; // Fixed null error
  
  const [providers, setProviders] = useState<any[]>([]) // Fixed never[] error
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    const fetchProviders = async () => {
      let query = supabase.from('providers').select('*').eq('is_approved', true)
      if (search) query = query.or(`full_name.ilike.%${search}%,profession.ilike.%${search}%,skills.cs.{${search}}`)
      if (category) query = query.eq('category', category)
      if (country) query = query.eq('country', country)

      const { data } = await query
      if (data) {
        const sortedData = data.sort((a: any, b: any) => {
          const aScore = (a.verification_status === 'verified' ? 2 : 0) + (a.membership === 'pro' ? 1 : 0)
          const bScore = (b.verification_status === 'verified' ? 2 : 0) + (b.membership === 'pro' ? 1 : 0)
          return bScore - aScore
        })
        setProviders(sortedData)
      } else {
        setProviders([])
      }
    }
    fetchProviders()
  }, [search, category, country])

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
        <input type="text" placeholder="Search by name or skill..." className="form-input" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select className="form-input" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          <option>Nigeria</option><option>Kenya</option><option>Ghana</option><option>South Africa</option>
        </select>
      </div>

      {providers.length === 0 ? (
        <p className="text-center py-20 text-muted">No providers match your search. Try different filters.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p: any) => <ProviderCard key={p.id} provider={p} />)}
        </div>
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