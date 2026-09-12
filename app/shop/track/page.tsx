'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TrackOrderPage() {
  const [form, setForm] = useState({ foc_order_id: '', email: '' })
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    const { data, error } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('foc_order_id', form.foc_order_id.toUpperCase())
      .or(`customer_email.ilike.${form.email},customer_phone.ilike.%${form.email}%`)
      .single()

    if (data) {
      setOrder(data)
    } else {
      setError('Order not found. Please check your Order ID and Email/Phone.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-32">
      <h1 className="serif text-4xl mb-8 text-center">Track Your Order</h1>
      
      <form onSubmit={handleTrack} className="premium-card p-6 space-y-4 mb-12">
        <input required type="text" placeholder="FOC Order ID (e.g., FOC-2026-000184)" className="form-input" onChange={e => setForm({...form, foc_order_id: e.target.value})} />
        <input required type="text" placeholder="Email or Phone Number used at checkout" className="form-input" onChange={e => setForm({...form, email: e.target.value})} />
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3">
          {loading ? 'Searching...' : <><i className="fas fa-search mr-2"></i> Track Order</>}
        </button>
      </form>

      {error && <p className="text-center text-red-600">{error}</p>}

      {order && (
        <div className="premium-card p-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b">
            <div>
              <p className="text-xs text-muted uppercase">Order ID</p>
              <p className="font-bold text-lg">{order.foc_order_id}</p>
            </div>
            <span className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <img src={item.product_main_image_url} alt={item.product_title} className="w-10 h-10 rounded" />
                  <p className="text-sm">{item.product_title}</p>
                </div>
              ))}
            </div>

            {order.tracking_number ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Shipped!</h3>
                <p className="text-sm text-green-700">AliExpress Tracking ID: <strong>{order.tracking_number}</strong></p>
                {order.tracking_url && (
                  <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline mt-2 inline-block">
                    Click to track shipment →
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-paper p-4 rounded-lg text-center">
                <p className="text-sm text-muted">Tracking is not yet available. We will update this once your item ships.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}