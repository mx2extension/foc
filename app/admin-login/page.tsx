'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in as admin
    const adminStatus = localStorage.getItem('foc_admin')
    if (adminStatus === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Admin credentials check
    const ADMIN_EMAIL = 'info5onecampus@gmail.com'
    const ADMIN_PASSWORD = 'admin123' // <--- Change your password here

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('foc_admin', 'true')
      setIsLoggedIn(true)
      router.push('/dashboard/admin')
    } else {
      setError('Invalid credentials. Access denied.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('foc_admin')
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setError('')
  }

  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        FindOneCampus
        <span className="w-6 h-px bg-primary"></span>
      </div>
      <h1 className="serif text-4xl md:text-5xl mb-4">Admin <span className="gradient-text">Access</span></h1>
      <p className="text-muted mb-12">Authorized personnel only. Please log in with your admin credentials.</p>
      
      <div className="premium-card p-8 space-y-6 text-left">
        {isLoggedIn ? (
          <div className="space-y-4 text-center py-4">
            <p className="text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              You are currently logged in as an admin.
            </p>
            <button 
              onClick={() => router.push('/dashboard/admin')}
              className="btn-primary w-full justify-center !py-3 text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input" 
                placeholder="admin@email.com" 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input" 
                placeholder="Enter password" 
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full justify-center !py-4">
              Secure Login
            </button>
          </form>
        )}

        {/* Logout button moved to the bottom of the card */}
        {isLoggedIn && (
          <div className="pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={handleLogout}
              className="w-full py-3 px-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Log Out Session
            </button>
          </div>
        )}
      </div>
      
      <p className="text-center text-sm text-muted mt-8">
        Not an admin? <Link href="/" className="text-primary font-medium hover:underline">Back to Home</Link>
      </p>
    </div>
  )
}