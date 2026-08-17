'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProviderLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { data, error: dbError } = await supabase
      .from('providers')
      .select('id, email, full_name')
      .ilike('email', email.trim()) 
      .single()

    if (data) {
      localStorage.setItem('foc_provider', JSON.stringify(data))
      router.push('/dashboard/provider')
    } else {
      setError('You are not registered as a provider yet. Please sign up first.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        FindOneCampus
        <span className="w-6 h-px bg-primary"></span>
      </div>
      <h1 className="serif text-4xl md:text-5xl mb-4">Provider <span className="gradient-text">Login</span></h1>
      <p className="text-muted mb-12">Enter your registered email to access your dashboard.</p>

      <form onSubmit={handleLogin} className="premium-card p-8 space-y-6 text-left">
        <div>
          <label className="text-sm font-medium mb-2 block">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input" 
            placeholder="you@email.com"
            name="email"
            id="email"
            autoComplete="email"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4">
          {loading ? 'Checking...' : 'Access Dashboard'}
        </button>
      </form>
      
      <p className="text-center text-sm text-muted mt-8">
        Not a provider yet? <Link href="/become-a-provider" className="text-primary font-medium hover:underline">Register here</Link>
      </p>
    </div>
  )
}