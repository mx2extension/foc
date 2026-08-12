'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isAdmin = localStorage.getItem('foc_admin')
    if (!isAdmin) {
      router.push('/admin-login')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return <div className="py-32 text-center text-muted">Verifying admin access...</div>
  }

  return <>{children}</>
}