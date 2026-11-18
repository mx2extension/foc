'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ADMIN_SECTIONS = [
  { title: 'Manage Providers', desc: 'Approve, reject, edit & feature providers.', href: '/dashboard/admin/providers', icon: 'fas fa-users', color: 'text-primary', group: 'people' },
  { title: 'Verifications', desc: 'Review paid verification requests.', href: '/dashboard/admin/verifications', icon: 'fas fa-badge-check', color: 'text-accent', group: 'people' },
  { title: 'Messages', desc: 'View contact form submissions.', href: '/dashboard/admin/messages', icon: 'fas fa-inbox', color: 'text-accent', group: 'people' },
  { title: 'Newsletter', desc: 'Manage email subscribers.', href: '/dashboard/admin/newsletter', icon: 'fas fa-envelope-open-text', color: 'text-ink', group: 'people' },

  { title: 'Manage Books', desc: 'Add, edit, or remove bookstore titles.', href: '/dashboard/admin/books', icon: 'fas fa-book', color: 'text-ink', group: 'content' },
  { title: 'Manage Courses', desc: 'Oversee course listings & pricing.', href: '/dashboard/admin/courses', icon: 'fas fa-graduation-cap', color: 'text-primary', group: 'content' },
  { title: 'Pro Books Library', desc: 'Upload PDFs for Pro Members.', href: '/dashboard/admin/pro-books', icon: 'fas fa-book-bookmark', color: 'text-accent', group: 'content' },
  { title: 'Manage Resources', desc: 'Add free or paid downloadable resources.', href: '/dashboard/admin/resources', icon: 'fas fa-toolbox', color: 'text-ink', group: 'content' },
  { title: 'News & Updates', desc: 'Publish campus articles and updates.', href: '/dashboard/admin/news', icon: 'fas fa-newspaper', color: 'text-primary', group: 'content' },
  { title: 'Manage Downloads', desc: 'Update book download links.', href: '/dashboard/admin/downloads', icon: 'fas fa-download', color: 'text-accent', group: 'content' },

  { title: 'View Payments', desc: 'Track Paystack & Flutterwave logs.', href: '/dashboard/admin/payments', icon: 'fas fa-credit-card', color: 'text-primary', group: 'shop' },
  { title: 'Our Products', desc: 'Upload and manage shop inventory.', href: '/dashboard/admin/foc-products', icon: 'fas fa-shopping-bag', color: 'text-primary', group: 'shop' },
  { title: 'Shop Orders', desc: 'View guest orders & track delivery.', href: '/dashboard/admin/shop-orders', icon: 'fas fa-truck-fast', color: 'text-accent', group: 'shop' },
  { title: 'Shop Adverts', desc: 'Manage banner ads & monetization.', href: '/dashboard/admin/shop-ads', icon: 'fas fa-rectangle-ad', color: 'text-ink', group: 'shop' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingProviders: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    activeProviders: 0
  })
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'content' | 'shop'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      const { data: providersData } = await supabase.from('providers').select('*')
      
      const pendingProviders = providersData?.filter(p => !p.is_approved).length || 0
      const pendingVerifications = providersData?.filter(p => p.verification_status === 'pending_verification_review').length || 0
      const activeProviders = providersData?.filter(p => p.is_approved).length || 0

      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'success')
      
      const calculatedRevenue = paymentsData?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0

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

  const filteredSections = ADMIN_SECTIONS.filter(item => {
    const matchesTab = activeTab === 'all' || item.group === activeTab
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto pt-20 pb-28 sm:py-32 px-3 sm:px-6 lg:px-10">
      
      {/* Floating Modern Header Bar */}
      <div className="sticky top-16 sm:top-20 z-20 mb-8 backdrop-blur-xl bg-white/70 border border-black/5 shadow-sm rounded-2xl p-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-ink">Admin Control Center</span>
          </div>
          <button onClick={handleLogout} className="sm:hidden text-xs text-red-600 font-medium px-2.5 py-1 bg-red-50 rounded-lg">
            Logout
          </button>
        </div>

        {/* Quick Search Input inside Floating Bar */}
        <div className="w-full sm:w-72 relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs"></i>
          <input
            type="text"
            placeholder="Quick search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/[0.03] border border-black/5 rounded-xl pl-8 pr-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-primary/40 transition"
          />
        </div>

        <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition">
          <i className="fas fa-right-from-bracket"></i>
          <span>Log Out</span>
        </button>
      </div>

      {/* Main Title Banner */}
      <div className="mb-8">
        <h1 className="serif text-3xl sm:text-6xl mb-1 sm:mb-2" style={{ letterSpacing: '-0.02em' }}>
          Ecosystem <span className="serif-italic gradient-text">Overview.</span>
        </h1>
        <p className="text-xs sm:text-base text-muted">Monitor key campus metrics and manage your platform modules instantly.</p>
      </div>

      {/* Stats Grid: Compact 2x2 on Mobile, 4 columns on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Active Providers</div>
          <div className="serif text-2xl sm:text-4xl text-ink">{stats.activeProviders}</div>
        </div>
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Pending Approvals</div>
          <div className="serif text-2xl sm:text-4xl text-accent">{stats.pendingProviders}</div>
        </div>
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Verifications</div>
          <div className="serif text-2xl sm:text-4xl text-primary">{stats.pendingVerifications}</div>
        </div>
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
          <div className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Total Revenue</div>
          <div className="serif text-2xl sm:text-4xl text-green-600 truncate">₦{stats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {[
          { id: 'all', label: 'All Modules (14)' },
          { id: 'people', label: 'Users & Inbox' },
          { id: 'content', label: 'Content & Library' },
          { id: 'shop', label: 'Shop & Payments' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-ink text-white shadow-sm'
                : 'bg-white border border-black/5 text-muted hover:text-ink hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modern Grid Cards */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-16 bg-white border border-black/5 rounded-2xl text-muted text-xs sm:text-sm">
          No admin modules match your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {filteredSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-black/5 rounded-2xl p-4 sm:p-7 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-primary/10 transition">
                  <i className={`${item.icon} text-sm sm:text-xl ${item.color}`}></i>
                </div>
                <h3 className="serif text-base sm:text-xl mb-1 group-hover:text-primary transition">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-muted line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/[0.03] flex items-center justify-between text-[10px] sm:text-xs font-medium text-muted group-hover:text-ink">
                <span>Access module</span>
                <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}