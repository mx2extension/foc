'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'

export default function ResourceCard({ resource }: { resource: any }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [email, setEmail] = useState('')

  const icons: Record<string, string> = {
    book: 'fa-book',
    podcast: 'fa-microphone-lines',
    movie: 'fa-film',
    tool: 'fa-toolbox',
    article: 'fa-newspaper',
    recommendation: 'fa-compass',
  }

  const colors: Record<string, string> = {
    book: 'bg-primary/10 text-primary',
    podcast: 'bg-accent/15 text-accent',
    movie: 'bg-ink/10 text-ink',
    tool: 'bg-primary/10 text-primary',
    article: 'bg-accent/15 text-accent',
    recommendation: 'bg-ink/10 text-ink',
  }

  const handlePurchase = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address to proceed.')
      return
    }

    if (typeof window === 'undefined' || !(window as any).PaystackPop) {
      alert('Payment gateway is still loading. Please try again in a moment.')
      return
    }

    setLoading(true)
    const reference = generateReference('RES')
    
    const { error } = await supabase.from('payments').insert({
      amount: resource.price,
      status: 'pending',
      reference,
      item_type: resource.type,
      item_id: resource.id,
    })

    if (error) {
      console.log('Supabase insert error:', error.message)
      setLoading(false)
      return
    }

    const handler = (window as any).PaystackPop.setup({
      key: 'pk_test_c3f9ed50135fe6f8def483b82411c7f4f4b78b9a', 
      email: email, 
      amount: resource.price * 100,
      ref: reference,
      metadata: { 
        item_type: resource.type, 
        item_id: resource.id,
        customer_email: email
      },
      callback: function(response: any) {
        setPaid(true)
        setLoading(false)
        window.location.href = `/api/paystack/verify?reference=${response.reference}`
      },
      onClose: function() {
        setLoading(false)
      }
    })
    handler.openIframe()
  }

  return (
    <div className={`premium-card overflow-hidden transition-all duration-500 ${expanded ? 'shadow-2xl' : ''}`}>
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-2xl ${colors[resource.type]} flex items-center justify-center`}>
            <i className={`fas ${icons[resource.type]} text-lg`}></i>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${resource.price === 0 ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'}`}>
              {resource.price === 0 ? 'Free' : `₦${resource.price.toLocaleString()}`}
            </span>
            <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-xs text-muted transition-transform`}></i>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-1 leading-tight">{resource.title}</h3>
        <p className="text-xs text-muted mb-3">by {resource.author}</p>
        <p className={`text-sm text-muted leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {resource.description}
        </p>
      </div>

      {/* Expanded Action Area */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-black/5 pt-4 mt-2">
          {resource.price === 0 || paid ? (
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center !py-3 text-sm">
              <i className="fas fa-arrow-up-right-from-square text-xs"></i> Access Resource
            </a>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Your Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-black/10 rounded-xl focus:outline-none focus:border-primary bg-white/50"
                />
              </div>
              <button onClick={handlePurchase} disabled={loading} className="btn-primary w-full justify-center !py-3 text-sm">
                {loading ? 'Processing...' : <><i className="fas fa-lock text-xs"></i> Pay & Unlock</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}