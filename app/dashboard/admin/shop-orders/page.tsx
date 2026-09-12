'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageShopOrders() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('shop_orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const handleApproveOrder = async (orderId: string) => {
    alert('Sending order to AliExpress...')

    // Call our Next.js API to trigger the AliExpress Dropshipping API
    const res = await fetch('/api/aliexpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'place_aliexpress_order', orderId })
    })
    const data = await res.json()

    if (data.success) {
      // Update Supabase with AliExpress Order ID
      await supabase.from('shop_orders').update({ 
        status: 'SENT_TO_SUPPLIER', 
        aliexpress_order_id: data.aliexpress_order_id 
      }).eq('foc_order_id', orderId)
      
      alert('Order successfully sent to AliExpress! ID: ' + data.aliexpress_order_id)
      fetchOrders()
    } else {
      alert('Failed to send order to AliExpress.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Shop Orders</h1>
      
      <div className="space-y-4">
        {orders.map((o: any) => (
          <div key={o.id} className="premium-card p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{o.foc_order_id}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === 'AWAITING_FULFILLMENT' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {o.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-sm text-muted">{o.customer_name} • {o.customer_email}</p>
              <p className="text-xs text-muted mt-1">Selling: ₦{o.total_selling_price.toLocaleString()} | Supplier Cost: ₦{o.total_supplier_cost.toLocaleString()}</p>
            </div>
            
            <div className="flex gap-2">
              {o.status === 'AWAITING_FULFILLMENT' && (
                <button onClick={() => handleApproveOrder(o.foc_order_id)} className="btn-primary !py-2 !px-4 text-xs">
                  <i className="fas fa-check mr-2"></i> Approve & Order
                </button>
              )}
              
              {o.tracking_number && (
                <span className="px-4 py-2 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                  Tracking: {o.tracking_number}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="premium-card p-12 text-center text-muted">No shop orders yet.</div>
        )}
      </div>
    </div>
  )
}