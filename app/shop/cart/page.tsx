'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'
import ShopAd from '@/components/ShopAd'
// @ts-ignore
import { Country, State } from 'country-state-city'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', state: '', city: '', country: 'NG' })

  useEffect(() => {
    const savedCart = localStorage.getItem('foc_cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  const totalAmount = cart.reduce((sum, p) => sum + (p.selling_price_ngn * p.qty), 0)

  const updateQty = (index: number, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(index)
      return
    }
    const newCart = [...cart]
    newCart[index].qty = newQty
    setCart(newCart)
    localStorage.setItem('foc_cart', JSON.stringify(newCart))
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
    localStorage.setItem('foc_cart', JSON.stringify(newCart))
  }

  // Dynamically load Flutterwave script if it's missing
  const loadFlutterwaveScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).FlutterwaveCheckout) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.flutterwave.com/v3.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Flutterwave script'))
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const flwKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY
    if (!flwKey) {
      alert('Flutterwave Public Key is missing in .env.local')
      setLoading(false)
      return
    }

    try {
      // Ensure script is loaded before proceeding
      await loadFlutterwaveScript()
    } catch (error) {
      // AD BLOCKER DETECTION
      alert('Payment gateway could not be loaded. Please disable your Ad Blocker or Brave Shields for this website to proceed with secure payment.')
      setLoading(false)
      return
    }

    const reference = generateReference('SHOP')

    try {
      (window as any).FlutterwaveCheckout({
        public_key: flwKey,
        tx_ref: reference,
        amount: totalAmount,
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
    const { data, error } = await supabase.from('shop_orders').insert({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      delivery_address: form.address,
      state: form.state,
      city: form.city,
      country: form.country,
      total_selling_price: totalAmount,
      total_supplier_cost: 0,
      shipping_cost: 0,
      flutterwave_ref: flutterwave_ref,
      items: cart,
      source: 'foc',
      status: 'PAID',
      manual_status: 'Order Received'
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
      
      <ShopAd placement="cart_top" />

      <h1 className="serif text-4xl mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="premium-card p-6 bg-paper">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          {cart.map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 pb-4 border-b border-black/5">
              <img src={p.product_main_image_url} alt={p.product_title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.product_title}</p>
                <p className="text-sm text-primary">₦{p.selling_price_ngn.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-3 bg-white border border-black/10 rounded-full p-1">
                <button 
                  onClick={() => updateQty(i, p.qty - 1)}
                  className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center text-muted"
                >
                  <i className="fas fa-minus text-xs"></i>
                </button>
                <span className="text-sm font-medium w-5 text-center">{p.qty}</span>
                <button 
                  onClick={() => updateQty(i, p.qty + 1)}
                  className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center text-muted"
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(i)} 
                className="text-red-500 hover:text-red-700 transition p-2"
                title="Remove from cart"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t-2 border-black/10 space-y-2">
            <div className="flex justify-between pt-2">
              <span className="font-semibold">Total:</span>
              <span className="serif text-2xl text-primary">₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="premium-card p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <input required type="text" placeholder="Full Name" className="form-input" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="email" placeholder="Email" className="form-input" onChange={e => setForm({...form, email: e.target.value})} />
          <input required type="tel" placeholder="Phone Number" className="form-input" onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea required rows={2} placeholder="Delivery Address" className="form-input" onChange={e => setForm({...form, address: e.target.value})}></textarea>
          
          <div className="grid grid-cols-2 gap-4">
            <select required className="form-input" value={form.country} onChange={e => setForm({...form, country: e.target.value, state: ''})}>
              {Country.getAllCountries().map((c: any) => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
            <select required className="form-input" value={form.state} onChange={e => setForm({...form, state: e.target.value})}>
              <option value="">Select State</option>
              {State.getStatesOfCountry(form.country).map((s: any) => (
                <option key={s.isoCode} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <input required type="text" placeholder="City" className="form-input" onChange={e => setForm({...form, city: e.target.value})} />
          
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4">
            {loading ? 'Processing...' : <><i className="fas fa-lock mr-2"></i> Pay ₦{totalAmount.toLocaleString()}</>}
          </button>
        </form>
      </div>
    </div>
  )
}