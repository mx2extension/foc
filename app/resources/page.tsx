'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import ResourceCard from '@/components/ResourceCard'

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
      setResources(data || [])
    }
    fetchResources()
  }, [])

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter((r: any) => r.type === filter)

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'book', label: 'Books' },
    { key: 'podcast', label: 'Podcasts' },
    { key: 'movie', label: 'Movies' },
    { key: 'tool', label: 'Tools' },
    { key: 'article', label: 'Articles' },
    { key: 'recommendation', label: 'Recommendations' },
  ]

  return (
    <div className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
            <span className="w-6 h-px bg-primary"></span>
            The library
            <span className="w-6 h-px bg-primary"></span>
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Resources for the <span className="serif-italic gradient-text">lifelong learner.</span>
          </h1>
        </div>

        {/* Filter Toggles */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => (
            <button 
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`tab-btn ${filter === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((r: any) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
          
          {filteredResources.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted">
              No resources available in this category yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}