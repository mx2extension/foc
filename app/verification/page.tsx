'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'

export default function VerificationPage() {
  const [form, setForm] = useState({ full_name: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)

  const handlePaystack = async () => {
    setLoading(true)
    const reference = generateReference('VER')
    
    // Save pending payment record
    await supabase.from('payments').insert({
      amount: 5000, // 50 NGN or whatever the review fee is
      status: 'pending',
      reference,
      item_type: 'verification',
      // provider_id will be linked on success webhook or manual verification
    })

    // Use Paystack Inline popup
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: 5000 * 100, 
      ref: reference,
      metadata: form,
      callback: function(response: any) {
        window.location.href = `/api/paystack/verify?reference=${response.reference}&trxref=${response.trxref}`
      },
      onClose: function() {
        setLoading(false)
        alert('Payment window closed.')
      }
    })
    handler.openIframe()
  }

  return (
    <div className="max-w-3xl mx-auto py-32 px-6">
      <h1 className="serif text-5xl mb-4">Get <span className="gradient-text">Verified</span></h1>
      <p className="text-muted mb-8">
        Verification is a status earned through review, not purchased. Pay the review fee, submit your details, and our team will review your application.
      </p>
      
      <div className="premium-card p-8 space-y-4">
        <input className="form-input" placeholder="Full Name" onChange={e => setForm({...form, full_name: e.target.value})} />
        <input className="form-input" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input className="form-input" placeholder="WhatsApp Number" onChange={e => setForm({...form, whatsapp: e.target.value})} />
        
        <button disabled={loading} onClick={handlePaystack} className="btn-primary w-full justify-center">
          {loading ? 'Processing...' : 'Pay Review Fee (₦5,000)'}
        </button>
      </div>
    </div>
  )
}