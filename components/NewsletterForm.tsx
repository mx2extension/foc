'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    const { error } = await supabase.from('newsletter_subscribers').insert({ email })
    
    if (error) {
      // If error is due to unique constraint (already subscribed), we still show success
      if (error.code === '23505') {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } else {
      setStatus('success')
    }
    
    setEmail('')
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input 
        type="email" 
        required 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com" 
        className="form-input !py-2.5 !text-sm !rounded-r-none flex-1 min-w-0" 
      />
      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="bg-ink text-white px-4 rounded-l-none rounded-r-xl text-sm hover:bg-primary transition disabled:opacity-50"
      >
        {status === 'loading' ? '...' : status === 'success' ? '✓' : status === 'error' ? '!' : '→'}
      </button>
    </form>
  )
}