'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageProviders() {
  const [providers, setProviders] = useState<any[]>([])
  const [filter, setFilter] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProviders()
  }, [filter, searchTerm])

  const fetchProviders = async () => {
    let query = supabase.from('providers').select('*')
    
    if (filter === 'pending') query = query.eq('is_approved', false)
    if (filter === 'approved') query = query.eq('is_approved', true)
    if (filter === 'featured') query = query.eq('is_featured', true)
    if (filter === 'verified') query = query.eq('verification_status', 'verified')
    if (filter === 'normal') query = query.neq('verification_status', 'verified')
    if (filter === 'internship_requests') query = query.eq('internship_request_status', 'pending')
    
    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,profession.ilike.%${searchTerm}%`)
    }

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

  // NEW: Manual Grant/Revoke Internship Logic
  const toggleInternship = async (id: string, current: boolean) => {
    await supabase.from('providers').update({ 
      internship_eligible: !current, 
      internship_request_status: !current ? 'approved' : 'rejected' 
    }).eq('id', id)
    fetchProviders()
  }

  // Handle Request Approvals
  const handleInternshipRequest = async (id: string, status: 'approved' | 'rejected') => {
    const isApproved = status === 'approved'
    await supabase.from('providers').update({ 
      internship_eligible: isApproved, 
      internship_request_status: status 
    }).eq('id', id)
    fetchProviders()
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage Providers</h1>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by name, email, or profession..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['pending', 'approved', 'featured', 'verified', 'normal', 'internship_requests'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition ${filter === f ? 'bg-ink text-white' : 'bg-paper border border-black/5'}`}
          >
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {providers.map((p: any) => (
          <div key={p.id} className="premium-card p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">{p.full_name}</h3>
                {p.verification_status === 'verified' && <i className="fas fa-check-circle text-blue-500"></i>}
                {p.membership === 'pro' && <span className="px-2 py-0.5 bg-accent/15 text-accent text-[10px] font-bold uppercase rounded-full">Pro</span>}
                {p.internship_eligible && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">Internship Ready</span>}
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

              {/* NEW: Manual Internship Toggle (Always visible) */}
              <button 
                onClick={() => toggleInternship(p.id, p.internship_eligible)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${p.internship_eligible ? 'bg-green-600 text-white' : 'bg-paper border border-black/5 text-green-600'}`}
              >
                <i className="fas fa-shield-halved mr-1"></i> {p.internship_eligible ? 'Intern Active' : 'Grant Intern'}
              </button>

              {/* Internship Request Actions (Shows if they requested it) */}
              {p.internship_request_status === 'pending' && (
                <div className="flex gap-1 ml-2 pl-2 border-l border-black/10">
                  <button onClick={() => handleInternshipRequest(p.id, 'approved')} className="px-4 py-2 rounded-full text-xs font-medium bg-green-600 text-white hover:opacity-90 transition">
                    Approve Request
                  </button>
                  <button onClick={() => handleInternshipRequest(p.id, 'rejected')} className="px-4 py-2 rounded-full text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition">
                    Reject Request
                  </button>
                </div>
              )}

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
            No {filter.replace(/_/g, ' ')} providers found.
          </div>
        )}
      </div>
    </div>
  )
}