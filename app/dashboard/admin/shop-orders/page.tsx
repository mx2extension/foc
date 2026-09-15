'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

const STATUSES = ['Order Received', 'Payment Confirmed', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Failed', 'Cancelled']

export default function ManageShopOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<any>({})

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('shop_orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const toggleOpen = (order: any) => {
    if (openId === order.id) {
      setOpenId(null)
    } else {
      setOpenId(order.id)
      // Initialize the draft form with the current order data
      setDrafts({
        ...drafts,
        [order.id]: {
          status: order.manual_status || 'Order Received',
          tracking: order.tracking_number || ''
        }
      })
    }
  }

  const handleSave = async (id: string) => {
    const draft = drafts[id]
    if (!draft) return

    await supabase.from('shop_orders').update({
      manual_status: draft.status,
      tracking_number: draft.tracking
    }).eq('id', id)

    // Update local state so UI updates instantly
    setOrders(prev => prev.map(o => o.id === id ? { ...o, manual_status: draft.status, tracking_number: draft.tracking } : o))
    setOpenId(null) // Collapse after saving
  }

  const getStatusColor = (status: string) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-800'
    if (status === 'Shipped' || status === 'In Transit') return 'bg-blue-100 text-blue-800'
    if (status === 'Failed' || status === 'Cancelled') return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="max-w-5xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Shop Fulfillment</h1>
      
      <div className="space-y-4">
        {orders.map((o: any) => (
          <div key={o.id} className="premium-card overflow-hidden">
            {/* Collapsed Header (Click to expand) */}
            <button 
              onClick={() => toggleOpen(o)}
              className="w-full p-6 flex flex-wrap items-center justify-between gap-4 text-left hover:bg-paper transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{o.foc_order_id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(o.manual_status)}`}>
                    {o.manual_status}
                  </span>
                </div>
                <p className="text-sm text-muted mt-1">{o.customer_name} • ₦{o.total_selling_price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {o.tracking_number && (
                  <span className="hidden sm:flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <i className="fas fa-truck-fast"></i> {o.tracking_number}
                  </span>
                )}
                <i className={`fas fa-chevron-${openId === o.id ? 'up' : 'down'} text-muted text-sm transition-transform`}></i>
              </div>
            </button>

            {/* Expanded Details (Shows when clicked) */}
            {openId === o.id && drafts[o.id] && (
              <div className="p-6 border-t border-black/5 bg-paper space-y-6">
                {/* Customer Info & Items */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Delivery Info</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted">Name:</span> <strong>{o.customer_name}</strong></p>
                      <p><span className="text-muted">Phone:</span> <strong>{o.customer_phone}</strong></p>
                      <p><span className="text-muted">Address:</span> <strong>{o.delivery_address}, {o.city}, {o.state}, {o.country}</strong></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Items</h4>
                    <div className="space-y-2">
                      {o.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <img src={item.product_main_image_url} alt={item.product_title} className="w-10 h-10 rounded-md object-cover" />
                          <span className="flex-1 truncate">{item.product_title} (x{item.qty})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fulfillment Actions */}
                <div className="pt-4 border-t border-black/10 grid md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-muted block mb-1">Order Status</label>
                    <select 
                      className="form-input !py-2.5 text-sm"
                      value={drafts[o.id].status}
                      onChange={(e) => setDrafts({
                        ...drafts,
                        [o.id]: { ...drafts[o.id], status: e.target.value }
                      })}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-muted block mb-1">Tracking Number</label>
                    <input 
                      type="text" 
                      className="form-input !py-2.5 text-sm" 
                      placeholder="Enter courier tracking ID"
                      value={drafts[o.id].tracking}
                      onChange={(e) => setDrafts({
                        ...drafts,
                        [o.id]: { ...drafts[o.id], tracking: e.target.value }
                      })}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <button 
                      onClick={() => handleSave(o.id)}
                      className="btn-primary w-full md:w-auto !py-2.5 !px-8 text-sm"
                    >
                      Save Updates
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="premium-card p-12 text-center text-muted">No shop orders yet.</div>
        )}
      </div>
    </div>
  )
}