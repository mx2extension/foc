'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ViewPayments() {
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
      setPayments(data || [])
    }
    fetchPayments()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Payment Transactions</h1>
      <div className="premium-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper border-b border-black/5">
            <tr>
              <th className="p-4 text-left font-medium text-muted">Reference</th>
              <th className="p-4 text-left font-medium text-muted">Type</th>
              <th className="p-4 text-left font-medium text-muted">Amount</th>
              <th className="p-4 text-left font-medium text-muted">Status</th>
              <th className="p-4 text-left font-medium text-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p: any) => (
              <tr key={p.id} className="border-b border-black/5 hover:bg-paper transition">
                <td className="p-4 font-mono text-xs">{p.reference}</td>
                <td className="p-4 capitalize">{p.item_type}</td>
                <td className="p-4 font-medium">₦{p.amount.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.status === 'success' ? 'bg-green-100 text-green-800' : 
                    p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>{p.status}</span>
                </td>
                <td className="p-4 text-muted text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}