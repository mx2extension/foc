'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminVerifications() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('providers')
      .select('*')
      .eq('verification_status', 'pending_verification_review')
    setRequests(data || [])
  }

  const handleVerification = async (id: string, status: 'verified' | 'rejected') => {
    await supabase.from('providers').update({ verification_status: status }).eq('id', id)
    fetchRequests()
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Verification Requests</h1>
      <p className="text-muted mb-12">Applicants have paid the review fee. Review their details and approve or reject.</p>

      <div className="space-y-4">
        {requests.length === 0 && <p className="text-muted">No pending verification requests.</p>}
        {requests.map((p: any) => (
          <div key={p.id} className="premium-card p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{p.full_name}</h3>
              <p className="text-sm text-muted">{p.profession}</p>
              <div className="flex gap-4 mt-2 text-xs text-muted">
                <span><i className="fas fa-envelope mr-1"></i> {p.email}</span>
                <span><i className="fab fa-whatsapp mr-1"></i> {p.whatsapp}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <a 
                href={`https://wa.me/${p.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-medium bg-paper border border-black/5 hover:bg-black/5 transition"
              >
                Request Info
              </a>
              <button 
                onClick={() => handleVerification(p.id, 'rejected')}
                className="px-4 py-2 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition"
              >
                Reject
              </button>
              <button 
                onClick={() => handleVerification(p.id, 'verified')}
                className="px-4 py-2 rounded-full text-xs font-medium bg-primary text-white hover:opacity-90 transition"
              >
                Grant Verified Badge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}