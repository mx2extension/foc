'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageProviders() {
  const [providers, setProviders] = useState([])
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetchProviders()
  }, [filter])

  const fetchProviders = async () => {
    let query = supabase.from('providers').select('*')
    if (filter === 'pending') query = query.eq('is_approved', false)
    if (filter === 'approved') query = query.eq('is_approved', true)
    if (filter === 'featured') query = query.eq('is_featured', true)
    if (filter === 'unverified') query = query.neq('verification_status', 'verified')
    
    const { data } = await query
    setProviders(data || [])
  }

  const toggleApproval = async (id: string, current: boolean) => {
    await supabase.from('providers').update({ is_approved: !current }).eq('id', id)
    fetchProviders()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('providers').update({ is_featured: !current }).eq('id', id)
    fetchProviders()
  }

  const togglePro = async (id: string, current: boolean) => {
    await supabase.from('providers').update({ membership: current ? 'free' : 'pro' }).eq('id', id)
    fetchProviders()
  }

  const toggleVerified = async (id: string, current: boolean) => {
    const newStatus = current ? 'not_verified' : 'verified'
    await supabase.from('providers').update({ verification_status: newStatus }).eq('id', id)
    fetchProviders()
  }

  const deleteProvider = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      await supabase.from('providers').delete().eq('id', id)
      fetchProviders()
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage Providers</h1>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {['pending', 'approved', 'featured', 'unverified'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition ${filter === f ? 'bg-ink text-white' : 'bg-paper border border-black/5'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {providers.map((p: any) => (
          <div key={p.id} className="premium-card p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{p.full_name}</h3>
                {p.verification_status === 'verified' && <i className="fas fa-check-circle text-blue-500"></i>}
                {p.membership === 'pro' && <span className="px-2 py-0.5 bg-accent/15 text-accent text-[10px] font-bold uppercase rounded-full">Pro</span>}
              </div>
              <p className="text-sm text-muted">{p.profession} • {p.email}</p>
              <p className="text-xs text-muted mt-1">Verification Status: <span className="capitalize font-medium text-ink/70">{p.verification_status.replace(/_/g, ' ')}</span></p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => toggleApproval(p.id, p.is_approved)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${p.is_approved ? 'bg-green-100 text-green-800' : 'bg-primary text-white'}`}
              >
                {p.is_approved ? 'Approved' : 'Approve'}
              </button>
              
              {p.is_approved && (
                <button 
                  onClick={() => toggleFeatured(p.id, p.is_featured)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition ${p.is_featured ? 'bg-accent text-white' : 'bg-paper border border-black/5'}`}
                >
                  {p.is_featured ? 'Featured' : 'Feature'}
                </button>
              )}

              <button 
                onClick={() => togglePro(p.id, p.membership === 'pro')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${p.membership === 'pro' ? 'bg-ink text-white' : 'bg-paper border border-black/5'}`}
              >
                {p.membership === 'pro' ? 'Pro Active' : 'Grant Pro'}
              </button>

              <button 
                onClick={() => toggleVerified(p.id, p.verification_status === 'verified')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${p.verification_status === 'verified' ? 'bg-blue-500 text-white' : 'bg-paper border border-black/5 text-blue-600'}`}
              >
                {p.verification_status === 'verified' ? 'Verified' : 'Grant Verified'}
              </button>

              <button 
                onClick={() => deleteProvider(p.id, p.full_name)}
                className="px-4 py-2 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {providers.length === 0 && (
          <div className="premium-card p-12 text-center text-muted">
            No {filter} providers found.
          </div>
        )}
      </div>
    </div>
  )
}