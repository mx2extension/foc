'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const TRACKING_STEPS = [
  'Order Received',
  'Payment Confirmed',
  'Processing',
  'Shipped',
  'In Transit',
  'Delivered'
]

export default function TrackOrderPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrders([])

    let query = supabase.from('shop_orders').select('*')
    
    // Smart logic: If it contains "FOC-", treat as Order ID. If it contains "@", treat as email. Else, phone.
    if (searchTerm.toUpperCase().includes('FOC-')) {
      query = query.eq('foc_order_id', searchTerm.toUpperCase())
    } else if (searchTerm.includes('@')) {
      query = query.eq('customer_email', searchTerm.toLowerCase())
    } else {
      query = query.eq('customer_phone', searchTerm)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (data && data.length > 0) {
      setOrders(data)
    } else {
      setError('No orders found. Please check your Order ID, Email, or Phone number.')
    }
    setLoading(false)
  }

  const getStepIndex = (status: string) => {
    const index = TRACKING_STEPS.indexOf(status)
    return index === -1 ? 0 : index
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-32">
      <h1 className="serif text-4xl mb-8 text-center">Track Your Order</h1>
      
      <form onSubmit={handleTrack} className="premium-card p-6 space-y-4 mb-12">
        <input 
          required 
          type="text" 
          placeholder="Enter Order ID (e.g., FOC-2026-000184) OR Email" 
          className="form-input" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
          {loading ? 'Searching...' : <><i className="fas fa-search mr-2"></i> Track Order</>}
        </button>
      </form>

      {error && <p className="text-center text-red-600 mb-8">{error}</p>}

      <div className="space-y-12">
        {orders.map((order: any) => {
          const currentStep = getStepIndex(order.manual_status)
          const isFailed = order.manual_status === 'Failed' || order.manual_status === 'Cancelled'

          return (
            <div key={order.id} className="premium-card p-8">
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                <div>
                  <p className="text-xs text-muted uppercase">Order ID</p>
                  <p className="font-bold text-lg">{order.foc_order_id}</p>
                  <p className="text-xs text-muted mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${isFailed ? 'bg-red-100 text-red-700' : 'bg-primary text-white'}`}>
                  {order.manual_status}
                </span>
              </div>

              {/* Visual Timeline (Hidden if failed/cancelled) */}
              {!isFailed && (
                <div className="relative mb-8">
                  <div className="absolute top-4 left-0 w-full h-1 bg-black/5 rounded-full">
                    <div 
                      className="h-1 bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="relative flex justify-between">
                    {TRACKING_STEPS.map((step, i) => (
                      <div key={step} className="flex flex-col items-center w-1/6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${i <= currentStep ? 'bg-primary border-primary text-white' : 'bg-white border-black/10 text-muted'}`}>
                          {i <= currentStep ? <i className="fas fa-check text-xs"></i> : <span className="text-xs">{i+1}</span>}
                        </div>
                        <span className={`text-[10px] mt-2 text-center ${i <= currentStep ? 'text-ink font-medium' : 'text-muted'}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm">Items in this Order</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-paper rounded-lg">
                      <img src={item.product_main_image_url} alt={item.product_title} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_title}</p>
                        <p className="text-xs text-muted">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-medium">₦{item.selling_price_ngn.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Number Box */}
              {order.tracking_number ? (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800 text-sm">Tracking ID Available!</h3>
                    <p className="text-lg font-bold text-blue-900 mt-1">{order.tracking_number}</p>
                  </div>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(order.tracking_number); alert('Tracking ID copied!') }}
                    className="px-4 py-2 bg-blue-600 text-white text-xs rounded-full font-medium hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-copy mr-1"></i> Copy ID
                  </button>
                </div>
              ) : (
                <div className="bg-paper p-4 rounded-lg text-center">
                  <p className="text-sm text-muted">Tracking number will appear here once the item ships.</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}