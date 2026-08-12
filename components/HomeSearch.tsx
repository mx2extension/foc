'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function HomeSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    providers: any[]
    books: any[]
    courses: any[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Redirect to providers page when they click Search or hit Enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/providers?search=${encodeURIComponent(query.trim())}`)
    }
  }

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 1) {
        setResults(null)
        setLoading(false)
        return
      }

      setLoading(true)
      const q = query.trim().toLowerCase()

      try {
        // Fetch a larger pool of providers to ensure Pro/Verified are included before sorting
        const [providersRes, booksRes, coursesRes] = await Promise.all([
          supabase.from('providers').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(100),
          supabase.from('books').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('courses').select('*').order('created_at', { ascending: false }).limit(20),
        ])

        const filteredProviders = (providersRes.data || [])
          .filter((p: any) => 
            Object.values(p).some((val: any) => 
              String(val || '').toLowerCase().includes(q)
            )
          )
          // Sort: Verified (2 pts) first, then Pro (1 pt), then Free (0 pts)
          .sort((a: any, b: any) => {
            const aScore = (a.verification_status === 'verified' ? 2 : 0) + (a.membership === 'pro' ? 1 : 0)
            const bScore = (b.verification_status === 'verified' ? 2 : 0) + (b.membership === 'pro' ? 1 : 0)
            return bScore - aScore
          })
          .slice(0, 3)

        const filteredBooks = (booksRes.data || []).filter((b: any) => 
          Object.values(b).some((val: any) => 
            String(val || '').toLowerCase().includes(q)
          )
        ).slice(0, 3)

        const filteredCourses = (coursesRes.data || []).filter((c: any) => 
          Object.values(c).some((val: any) => 
            String(val || '').toLowerCase().includes(q)
          )
        ).slice(0, 3)

        setResults({
          providers: filteredProviders,
          books: filteredBooks,
          courses: filteredCourses,
        })
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchResults, 250)
    return () => clearTimeout(timer)
  }, [query])

  const quickSearch = (term: string) => {
    setQuery(term)
  }

  const hasResults =
    results &&
    (results.providers.length > 0 ||
      results.books.length > 0 ||
      results.courses.length > 0)

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Wrapped in a form so Enter key works, and button is type="submit" */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border border-black/10 rounded-full shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] focus-within:border-primary focus-within:shadow-[0_20px_60px_-20px_rgba(193,18,31,0.25)] transition-all overflow-hidden">
        <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'} absolute left-7 text-muted pointer-events-none`}></i>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search providers, books, courses..."
          className="w-full bg-transparent pl-16 pr-4 py-6 text-lg focus:outline-none"
        />
        <div className="pr-2">
          <button type="submit" className="btn-primary !py-3.5 !px-6 text-sm whitespace-nowrap">
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Quick Suggestions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-muted mr-2">Try:</span>
        <button onClick={() => quickSearch('strategist')} className="px-3 py-1.5 rounded-full bg-paper border border-black/5 hover:border-primary/30 hover:text-primary transition">strategist</button>
        <button onClick={() => quickSearch('python')} className="px-3 py-1.5 rounded-full bg-paper border border-black/5 hover:border-primary/30 hover:text-primary transition">python</button>
        <button onClick={() => quickSearch('productivity')} className="px-3 py-1.5 rounded-full bg-paper border border-black/5 hover:border-primary/30 hover:text-primary transition">productivity</button>
        <button onClick={() => quickSearch('design')} className="px-3 py-1.5 rounded-full bg-paper border border-black/5 hover:border-primary/30 hover:text-primary transition">design</button>
      </div>

      {/* Live Dropdown Results */}
      {hasResults && (
        <div className="absolute mt-4 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden text-left w-full z-50 max-h-[70vh] overflow-y-auto">
          {results.providers.length > 0 && (
            <div className="p-3">
              <div className="px-3 py-2 text-xs text-muted uppercase tracking-wider">Providers & Services</div>
              {results.providers.map((p: any) => (
                <Link href={`/providers/${p.id}`} key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-paper transition cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                    {p.full_name?.charAt(0) || p.name?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      {p.full_name || p.name}
                      {/* Prioritized Badges */}
                      {p.verification_status === 'verified' && <i className="fas fa-check-circle text-blue-500 text-xs"></i>}
                      {p.membership === 'pro' && <span className="text-[9px] bg-accent/15 text-accent font-bold px-1.5 py-0.5 rounded uppercase">Pro</span>}
                    </div>
                    <div className="text-xs text-muted">{p.profession || p.service || 'Provider'}</div>
                  </div>
                  <i className="fas fa-arrow-right text-xs text-muted"></i>
                </Link>
              ))}
            </div>
          )}
          
          {results.books.length > 0 && (
            <div className="p-3 border-t border-black/5">
              <div className="px-3 py-2 text-xs text-muted uppercase tracking-wider">Books</div>
              {results.books.map((b: any) => (
                <Link href={`/books`} key={b.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-paper transition cursor-pointer">
                  <div className="w-8 h-10 rounded bg-ink flex items-center justify-center text-white text-xs">
                    <i className="fas fa-book"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{b.title}</div>
                    <div className="text-xs text-muted">by {b.author}</div>
                  </div>
                  <i className="fas fa-arrow-right text-xs text-muted"></i>
                </Link>
              ))}
            </div>
          )}

          {results.courses.length > 0 && (
            <div className="p-3 border-t border-black/5">
              <div className="px-3 py-2 text-xs text-muted uppercase tracking-wider">Courses</div>
              {results.courses.map((c: any) => (
                <Link href={`/courses`} key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-paper transition cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                    <i className="fas fa-graduation-cap text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-muted">
                      {c.instructor} {c.price ? `• ₦${c.price.toLocaleString()}` : ''}
                    </div>
                  </div>
                  <i className="fas fa-arrow-right text-xs text-muted"></i>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}