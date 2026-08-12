'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingProviders: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    activeProviders: 0
  })
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Fetch Providers
      const { data: providersData } = await supabase.from('providers').select('*')
      
      const pendingProviders = providersData?.filter(p => !p.is_approved).length || 0
      const pendingVerifications = providersData?.filter(p => p.verification_status === 'pending_verification_review').length || 0
      const activeProviders = providersData?.filter(p => p.is_approved).length || 0

      // 2. Fetch all SUCCESSFUL payments and calculate total revenue
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'success')
      
      const calculatedRevenue = paymentsData?.reduce((sum, payment) => sum + payment.amount, 0) || 0

      setStats({
        pendingProviders,
        pendingVerifications,
        activeProviders,
        totalRevenue: calculatedRevenue
      })
    }
    fetchStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('foc_admin')
    router.push('/admin-login')
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="serif text-5xl mb-2">Admin Dashboard</h1>
          <p className="text-muted">Manage the campus ecosystem.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        <div className="premium-card p-6">
          <div className="text-xs text-muted uppercase tracking-wider mb-2">Active Providers</div>
          <div className="serif text-4xl">{stats.activeProviders}</div>
        </div>
        <div className="premium-card p-6">
          <div className="text-xs text-muted uppercase tracking-wider mb-2">Pending Approvals</div>
          <div className="serif text-4xl text-accent">{stats.pendingProviders}</div>
        </div>
        <div className="premium-card p-6">
          <div className="text-xs text-muted uppercase tracking-wider mb-2">Pending Verifications</div>
          <div className="serif text-4xl text-primary">{stats.pendingVerifications}</div>
        </div>
        <div className="premium-card p-6">
          <div className="text-xs text-muted uppercase tracking-wider mb-2">Total Revenue</div>
          <div className="serif text-4xl text-green-600">₦{stats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Management Links */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Link href="/dashboard/admin/providers" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-users text-2xl text-primary mb-4"></i>
          <h3 className="serif text-2xl mb-2">Manage Providers</h3>
          <p className="text-sm text-muted">Approve, reject, edit, and feature providers.</p>
        </Link>
        
        <Link href="/dashboard/admin/verifications" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-badge-check text-2xl text-accent mb-4"></i>
          <h3 className="serif text-2xl mb-2">Verifications</h3>
          <p className="text-sm text-muted">Review paid verification requests.</p>
        </Link>
        
        <Link href="/dashboard/admin/books" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-book text-2xl text-ink mb-4"></i>
          <h3 className="serif text-2xl mb-2">Manage Books</h3>
          <p className="text-sm text-muted">Add, edit, or remove bookstore titles.</p>
        </Link>
        
        <Link href="/dashboard/admin/courses" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-graduation-cap text-2xl text-primary mb-4"></i>
          <h3 className="serif text-2xl mb-2">Manage Courses</h3>
          <p className="text-sm text-muted">Oversee course listings and pricing.</p>
        </Link>

        <Link href="/dashboard/admin/pro-books" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-book-bookmark text-2xl text-accent mb-4"></i>
          <h3 className="serif text-2xl mb-2">Pro Books Library</h3>
          <p className="text-sm text-muted">Upload PDFs for Pro Members.</p>
        </Link>
        
        <Link href="/dashboard/admin/resources" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-toolbox text-2xl text-ink mb-4"></i>
          <h3 className="serif text-2xl mb-2">Manage Resources</h3>
          <p className="text-sm text-muted">Add free or paid resources.</p>
        </Link>

        <Link href="/dashboard/admin/payments" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-credit-card text-2xl text-primary mb-4"></i>
          <h3 className="serif text-2xl mb-2">View Payments</h3>
          <p className="text-sm text-muted">Track all Paystack transactions.</p>
        </Link>
        
        <Link href="/dashboard/admin/downloads" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-download text-2xl text-accent mb-4"></i>
          <h3 className="serif text-2xl mb-2">Manage Downloads</h3>
          <p className="text-sm text-muted">Update book download links.</p>
        </Link>

        <Link href="/dashboard/admin/news" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-newspaper text-2xl text-ink mb-4"></i>
          <h3 className="serif text-2xl mb-2">News & Updates</h3>
          <p className="text-sm text-muted">Publish articles and updates.</p>
        </Link>

        <Link href="/dashboard/admin/messages" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-inbox text-2xl text-primary mb-4"></i>
          <h3 className="serif text-2xl mb-2">Messages</h3>
          <p className="text-sm text-muted">View contact form submissions.</p>
        </Link>

        <Link href="/dashboard/admin/newsletter" className="premium-card p-8 hover:border-primary/30 transition">
          <i className="fas fa-envelope-open-text text-2xl text-accent mb-4"></i>
          <h3 className="serif text-2xl mb-2">Newsletter</h3>
          <p className="text-sm text-muted">View email subscribers.</p>
        </Link>
      </div>

      {/* Logout button moved to the bottom */}
      <div className="flex justify-center border-t border-gray-100 pt-8">
        <button 
          onClick={handleLogout} 
          className="w-full max-w-md py-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Log Out Session
        </button>
      </div>
    </div>
  )
}