'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageSmmOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('pending_smm_orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const retryOrder = async (order: any) => {
    setLoading(true)
    
    // Try to place the order on RSS again
    const params = new URLSearchParams()
    params.append('key', process.env.NEXT_PUBLIC_SMM_API_KEY || '') // You might need to expose this or use a secure route
    params.append('action', 'add')
    params.append('service', order.service_id)
    params.append('link', order.link)
    params.append('quantity', String(order.quantity))

    // NOTE: For production, you should create an API route for this to keep your SMM key secret.
    // For MVP, if your key is in NEXT_PUBLIC vars, it will work here.
    const res = await fetch('https://reallysimplesocial.com/api/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    const data = await res.json()

    if (data.order) {
      // Success! Update the database to mark as fulfilled
      await supabase.from('pending_smm_orders').update({ 
        status: 'fulfilled', 
        smm_order_id: String(data.order) 
      }).eq('id', order.id)
      
      alert(`Order successfully placed on RSS! Order ID: ${data.order}`)
    } else {
      alert('Still insufficient balance or error. Please top up your RSS account.')
    }
    
    setLoading(false)
    fetchOrders()
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Queued SMM Orders</h1>
      <p className="text-muted mb-12">These orders were paid for but couldn't be sent to ReallySimpleSocial due to low balance. Click "Retry Order" after topping up your balance.</p>

      <div className="premium-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper border-b border-black/5">
            <tr>
              <th className="p-4 text-left font-medium text-muted">Customer Email</th>
              <th className="p-4 text-left font-medium text-muted">Service</th>
              <th className="p-4 text-left font-medium text-muted">Link</th>
              <th className="p-4 text-left font-medium text-muted">Qty</th>
              <th className="p-4 text-left font-medium text-muted">Amount Paid</th>
              <th className="p-4 text-left font-medium text-muted">Status</th>
              <th className="p-4 text-left font-medium text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-black/5">
                <td className="p-4 font-medium">{o.reader_email}</td>
                <td className="p-4 text-xs">{o.service_name}</td>
                <td className="p-4 text-xs text-primary truncate max-w-[150px]"><a href={o.link} target="_blank" rel="noopener noreferrer">{o.link}</a></td>
                <td className="p-4">{o.quantity}</td>
                <td className="p-4 font-bold">₦{o.amount_paid.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4">
                  {o.status === 'queued' ? (
                    <button onClick={() => retryOrder(o)} disabled={loading} className="btn-primary !py-1.5 !px-3 text-xs disabled:opacity-50">
                      Retry Order
                    </button>
                  ) : (
                    <span className="text-xs text-muted">RSS ID: {o.smm_order_id}</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted">No queued orders. Everything is running smoothly!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}