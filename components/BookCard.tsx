'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'

export default function BookCard({ book }: { book: any }) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    
    // 1. Create pending payment record
    const reference = generateReference('BOOK')
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('payments').insert({
      amount: book.price,
      status: 'pending',
      reference,
      item_type: 'book',
      item_id: book.id,
      // provider_id: user?.id // If logged in
    })

    // 2. Initialize Paystack
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || 'guest@findonecampus.com',
      amount: book.price * 100,
      ref: reference,
      metadata: { item_type: 'book', item_id: book.id },
      callback: function(response: any) {
        window.location.href = `/api/paystack/verify?reference=${response.reference}`
      },
      onClose: function() {
        setLoading(false)
      }
    })
    handler.openIframe()
  }

  return (
    <div className="premium-card p-6">
      <div 
        className="aspect-[3/4] rounded-lg mb-6 relative overflow-hidden shadow-xl flex flex-col justify-between p-6 text-white"
        style={{ background: book.cover_config.bg }}
      >
        <div className="text-[10px] tracking-[0.3em] opacity-70">{book.cover_config.label}</div>
        <div>
          <div className="serif text-2xl leading-tight mb-2">{book.title}</div>
          <div className="text-xs opacity-70 italic">{book.cover_config.sub}</div>
          <div className="text-xs mt-4 opacity-80">by {book.author}</div>
        </div>
      </div>
      
      <p className="text-sm text-muted leading-relaxed mb-5 min-h-[60px]">{book.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted">Price</div>
          <div className="serif text-2xl">₦{book.price.toLocaleString()}</div>
        </div>
      </div>
      
      <button onClick={handlePurchase} disabled={loading} className="btn-primary w-full justify-center !py-3 text-sm">
        {loading ? 'Processing...' : <><i className="fas fa-book"></i> Buy & Download</>}
      </button>
    </div>
  )
}