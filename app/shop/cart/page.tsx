'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', state: '', city: '' })

  useEffect(() => {
    const savedCart = localStorage.getItem('foc_cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  const totalSellingPrice = cart.reduce((sum, p) => sum + (p.selling_price_ngn * p.qty), 0)
  const totalSupplierCost = cart.reduce((sum, p) => sum + (p.supplier_cost_ngn * p.qty), 0)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const flwKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY
    if (!flwKey || !(window as any).FlutterwaveCheckout) {
      alert('Payment gateway not loaded.')
      setLoading(false)
      return
    }

    const reference = generateReference('SHOP')

    try {
      (window as any).FlutterwaveCheckout({
        public_key: flwKey,
        tx_ref: reference,
        amount: totalSellingPrice,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: { email: form.email, name: form.name, phone_number: form.phone },
        customization: {
          title: "FindOneCampus Shop",
          description: "Payment for Items",
          logo: "https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png"
        },
        callback: function(data: any) {
          if (data.status === 'successful' || data.status === 'completed') {
            saveOrder(reference)
          } else {
            alert('Payment failed.')
            setLoading(false)
          }
        },
        onclose: function() { setLoading(false) }
      })
    } catch (error) {
      alert('Error initiating payment.')
      setLoading(false)
    }
  }

  const saveOrder = async (flutterwave_ref: string) => {
    // Save order to Supabase
    const { data, error } = await supabase.from('shop_orders').insert({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      delivery_address: form.address,
      state: form.state,
      city: form.city,
      total_selling_price: totalSellingPrice,
      total_supplier_cost: totalSupplierCost,
      flutterwave_ref: flutterwave_ref,
      items: cart,
      status: 'AWAITING_FULFILLMENT'
    }).select().single()

    if (!error && data) {
      localStorage.removeItem('foc_cart')
      window.location.href = `/shop/track?order=${data.foc_order_id}&success=true`
    } else {
      alert('Payment received but failed to save order. Please contact support with ref: ' + flutterwave_ref)
    }
    setLoading(false)
  }

  if (cart.length === 0) {
    return <div className="py-32 text-center text-muted">Your cart is empty. <a href="/shop" className="text-primary">Continue shopping</a>.</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-32 px-6 lg:px-10">
      <h1 className="serif text-4xl mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Cart Items */}
        <div className="premium-card p-6 bg-paper">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          {cart.map((p, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 pb-4 border-b border-black/5">
              <img src={p.product_main_image_url} alt={p.product_title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.product_title}</p>
                <p className="text-sm text-primary">₦{p.selling_price_ngn?.toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t-2 border-black/10 flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="serif text-2xl text-primary">₦{totalSellingPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <form onSubmit={handleCheckout} className="premium-card p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <input required type="text" placeholder="Full Name" className="form-input" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" placeholder="Email" className="form-input" onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="tel" placeholder="Phone Number" className="form-input" onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea required rows={2} placeholder="Delivery Address" className="form-input" onChange={e => setForm({...form, address: e.target.value})}></textarea>
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="State" className="form-input" onChange={e => setForm({...form, state: e.target.value})} />
            <input required type="text" placeholder="City" className="form-input" onChange={e => setForm({...form, city: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4">
            {loading ? 'Processing...' : <><i className="fas fa-lock mr-2"></i> Pay ₦{totalSellingPrice.toLocaleString()}</>}
          </button>
        </form>
      </div>
    </div>
  )
}