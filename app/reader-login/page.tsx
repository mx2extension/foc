'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReaderLogin() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Upsert reader into the database (creates if new, updates if exists)
    const { data, error } = await supabase
      .from('readers')
      .upsert({ name: name.trim(), email: email.trim().toLowerCase() }, { onConflict: 'email' })
      .select()
      .single()

    if (data) {
      localStorage.setItem('foc_reader', JSON.stringify(data))
      router.push('/books')
    } else {
      alert('Error logging in. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        The Bookstore
        <span className="w-6 h-px bg-primary"></span>
      </div>
      <h1 className="serif text-4xl md:text-5xl mb-4">Reader <span className="gradient-text">Portal</span></h1>
      <p className="text-muted mb-12">Register or log in with your name and email to browse, buy, and read your books.</p>
      
      <form onSubmit={handleLogin} className="premium-card p-8 space-y-6 text-left">
        <div>
          <label className="text-sm font-medium mb-2 block">Full Name</label>
          <input 
            type="text" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input" 
            placeholder="Jane Doe" 
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input" 
            placeholder="you@email.com" 
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
          {loading ? 'Accessing...' : 'Access Bookstore'}
        </button>
      </form>
      
      <p className="text-center text-sm text-muted mt-8">
        Just browsing? <Link href="/" className="text-primary font-medium hover:underline">Back to Home</Link>
      </p>
    </div>
  )
}