'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Configuration: Markups
const REGULAR_MARKUP = 2 
const VIEWS_MARKUP = 30 

export default function SocialGrowthPage() {
  const [services, setServices] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [successOrder, setSuccessOrder] = useState('')
  const [waConfirmLink, setWaConfirmLink] = useState('')

  // Form state
  const [email, setEmail] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [link, setLink] = useState('')
  const [quantity, setQuantity] = useState(500)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const fetchServices = async () => {
    setLoading(true)
    const servicesRes = await fetch('/api/smm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'services' })
    })
    const servicesData = await servicesRes.json()
    if (Array.isArray(servicesData)) setServices(servicesData)

    const balanceRes = await fetch('/api/smm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'balance' })
    })
    const balanceData = await balanceRes.json()
    if (balanceData.balance) setBalance(parseFloat(balanceData.balance))
    
    setLoading(false)
  }

  // Extract unique categories for the dropdown
  const categories = Array.from(new Set(services.map((s: any) => s.category).filter(Boolean)))

  // Filter services based on selected category
  const filteredServices = selectedCategory 
    ? services.filter((s: any) => s.category === selectedCategory) 
    : services

  const selectedService = services.find((s: any) => String(s.service) === String(serviceId))

  const getMarkup = (serviceName: string) => {
    return serviceName.toLowerCase().includes('view') ? VIEWS_MARKUP : REGULAR_MARKUP
  }

  const getLinkPlaceholder = (serviceName: string = '') => {
    const lower = serviceName.toLowerCase()
    if (lower.includes('view') || lower.includes('like') || lower.includes('comment') || lower.includes('share') || lower.includes('retweet') || lower.includes('impression')) {
      return "Enter Post URL (e.g., /p/CxYz...)"
    }
    return "Enter Profile URL (e.g., /username)"
  }

  const calculateTotal = () => {
    if (!selectedService || !quantity) return 0
    const markup = getMarkup(selectedService.name)
    const costPer1000NGN = parseFloat(selectedService.rate) * markup
    const totalNGN = Math.ceil((costPer1000NGN / 1000) * quantity)
    return isNaN(totalNGN) ? 0 : totalNGN
  }

  const totalCost = calculateTotal()

  const triggerFallback = () => {
    const rawMsg = `Hello MX2ViralWorld, I just paid for my order.\n\nService: ${selectedService?.name}\nLink: ${link}\nQuantity: ${quantity}\nTotal Paid: ₦${totalCost.toLocaleString()}\n\nAttached is the payment screenshot.`
    const waMsg = encodeURIComponent(rawMsg)

    window.dispatchEvent(new CustomEvent('show-fallback-payment', { 
      detail: { 
        amount: totalCost.toLocaleString(), 
        description: 'MX2ViralWorld Social Media Service',
        whatsappMessage: waMsg 
      } 
    }))
  }

  const initiateFlutterwave = () => {
    const flwKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY

    if (!flwKey || typeof window === 'undefined' || !(window as any).FlutterwaveCheckout) {
      triggerFallback()
      return
    }

    setLoading(true)
    const reference = `SMM_${Date.now()}`
    setSuccessOrder('')
    setWaConfirmLink('')

    try {
      (window as any).FlutterwaveCheckout({
        public_key: flwKey, 
        tx_ref: reference,
        amount: totalCost,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: {
          email: email,
        },
        customization: {
          title: "MX2ViralWorld",
          description: "Social Media Growth Service",
          logo: "https://res.cloudinary.com/drnrbfltr/image/upload/v1786364796/ed0296b5-7a89-4ed7-bc64-5d1ad018de78.png"
        },
        callback: function(data: any) {
          if (data.status === 'successful' || data.status === 'completed') {
            placeSmmOrder(reference)
          } else {
            showToast('Payment was not successful. Please try again.')
            setLoading(false)
          }
        },
        onclose: function() {
          triggerFallback()
          setLoading(false)
        }
      })
    } catch (error) {
      showToast('Error initiating payment.')
      setLoading(false)
    }
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      showToast('Please enter your email to proceed.')
      return
    }

    if (quantity < 500 || quantity > 20000) {
      showToast('Quantity must be between 500 and 20,000.')
      return
    }

    initiateFlutterwave()
  }

  const placeSmmOrder = async (reference: string) => {
    const currentSvcName = selectedService?.name || 'Social Service'
    const currentLink = link
    const currentQty = quantity

    const res = await fetch('/api/smm', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        service_id: serviceId, 
        service_name: currentSvcName,
        link: currentLink, 
        quantity: currentQty, 
        amount_paid: totalCost,
        email: email,
        reference: reference
      })
    })
    const data = await res.json()

    if (data.status === 'success' || data.status === 'queued') {
      const ticketId = data.status === 'success' ? String(data.order) : `MX2-${Date.now().toString().slice(-6)}`
      
      setSuccessOrder(ticketId)
      setOrderId(ticketId)
      
      const waMsg = `Hello MX2ViralWorld, my order has been placed.\n\nTicket ID: ${ticketId}\nService: ${currentSvcName}\nLink: ${currentLink}\nQuantity: ${currentQty}\n\nI am sending this to confirm and track my order.`
      setWaConfirmLink(`https://wa.me/2349017380098?text=${encodeURIComponent(waMsg)}`)
      
      setLink('')
      fetchServices() 

      if (data.status === 'queued') {
        showToast('Payment successful! Your order is now processing.')
      }
    } else {
      showToast(`Payment received, but order failed. Contact support with ref: ${reference}`)
    }
    setLoading(false)
  }

  const handleCheckStatus = async () => {
    if (!orderId) return
    const res = await fetch('/api/smm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', order: orderId })
    })
    const data = await res.json()
    if (data.status) {
      showToast(`Order ${orderId}: ${data.status.toUpperCase()} (Remains: ${data.remains})`)
    } else {
      showToast(`Order ${orderId} is still processing in our queue.`)
    }
  }

  const handleCopyTrackingId = () => {
    navigator.clipboard.writeText(successOrder)
    showToast('Tracking ID Copied!')
  }

  return (
    <div className="relative min-h-screen bg-paper overflow-hidden">
      {/* Background Orbs */}
      <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(193,18,31,0.08)', top: '10%', left: '-100px' }}></div>
      <div className="orb" style={{ width: '500px', height: '500px', background: 'rgba(212,160,23,0.08)', bottom: '10%', right: '-100px' }}></div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-20 md:py-32 z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm text-muted hover:text-primary transition">
            <i className="fas fa-arrow-left text-xs"></i> Back to Campus
          </Link>
          
          <div className="flex justify-center mb-8">
            <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1786364796/ed0296b5-7a89-4ed7-bc64-5d1ad018de78.png" alt="MX2ViralWorld" className="w-20 h-20 object-contain rounded-full shadow-md border border-black/5" />
          </div>
          
          <div className="section-label justify-center mb-6 inline-flex">MX2ViralWorld</div>
          <h1 className="serif mb-6" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Boost your social <span className="serif-italic gradient-text">presence.</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Seamlessly grow your audience across all major platforms. Select a service, enter your link, and watch your numbers grow.
          </p>
        </div>

        {/* Main Card */}
        <div className="premium-card p-8 md:p-12 mb-8">
          {successOrder ? (
            <div className="text-center space-y-6 py-8">
              <div>
                <i className="fas fa-check-circle text-green-600 text-5xl mb-4"></i>
                <h2 className="serif text-3xl mb-2">Payment Successful!</h2>
                <p className="text-muted">Your order has been placed and is now processing.</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <p className="text-sm text-muted mb-3">Your Order Tracking ID is:</p>
                <div className="flex items-center justify-between bg-paper p-4 rounded-xl border border-black/5 shadow-sm">
                  <span className="font-bold text-ink text-lg tracking-wider">{successOrder}</span>
                  <button 
                    onClick={handleCopyTrackingId}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 transition flex items-center gap-2"
                  >
                    <i className="fas fa-copy"></i> Copy ID
                  </button>
                </div>
                <p className="text-[11px] text-red-500 font-medium mt-3 animate-pulse">
                  ⚠️ Please copy and save this ID to track your order status below.
                </p>
              </div>

              <div className="pt-6 border-t border-black/5 max-w-md mx-auto">
                <p className="text-sm text-muted mb-4">Click below to send us a quick DM on WhatsApp confirming your order:</p>
                <a 
                  href={waConfirmLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                  style={{ background: '#25D366', boxShadow: '0 20px 40px -15px rgba(37,211,102,0.4)' }}
                >
                  <i className="fab fa-whatsapp text-lg"></i> Send DM to Confirm
                </a>
              </div>
              
              <button 
                onClick={() => setSuccessOrder('')} 
                className="text-sm text-primary font-medium hover:underline mt-4"
              >
                Place Another Order
              </button>
            </div>
          ) : (
            <>
              {loading && services.length === 0 ? (
                <div className="text-center py-16 text-muted">
                  <i className="fas fa-spinner fa-spin text-3xl mb-4 text-primary"></i>
                  <p>Loading available services...</p>
                </div>
              ) : (
                <form onSubmit={handleOrder} className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-muted block mb-2">Your Email</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        placeholder="you@email.com"
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted block mb-2">Service Type (Category)</label>
                      <select 
                        value={selectedCategory} 
                        onChange={(e) => {
                          setSelectedCategory(e.target.value)
                          setServiceId('')
                        }}
                        className="form-input"
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted block mb-2">Select Service</label>
                      <select 
                        value={serviceId} 
                        onChange={(e) => {
                          setServiceId(e.target.value)
                          const svc = services.find((s: any) => String(s.service) === e.target.value)
                          if (svc) {
                            const apiMin = parseInt(svc.min) || 500
                            setQuantity(Math.max(500, apiMin))
                          }
                        }}
                        required
                        className="form-input"
                      >
                        <option value="">Choose a service...</option>
                        {filteredServices.map((svc: any) => {
                          const markup = getMarkup(svc.name)
                          return (
                            <option key={svc.service} value={svc.service}>
                              {svc.name} (₦{(parseFloat(svc.rate) * markup).toFixed(2)}/1000)
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-5 flex flex-col">
                    <div>
                      <label className="text-sm font-medium text-muted block mb-2">Link</label>
                      <input 
                        type="text" 
                        value={link} 
                        onChange={(e) => setLink(e.target.value)} 
                        required
                        placeholder={getLinkPlaceholder(selectedService?.name)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted block mb-2">
                        Quantity 
                        <span className="text-muted/70 ml-2 text-xs">(Min: 500, Max: 20,000)</span>
                      </label>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))} 
                        required
                        min={500}
                        max={20000}
                        className="form-input"
                      />
                    </div>

                    <div className="mt-auto bg-paper p-5 rounded-2xl border border-black/5 flex justify-between items-center">
                      <span className="text-sm text-muted font-medium">Total Cost:</span>
                      <span className="serif text-3xl gradient-text">₦{totalCost.toLocaleString()}</span>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading || !serviceId} 
                      className="btn-primary w-full justify-center mt-2"
                    >
                      {loading ? 'Processing...' : <><i className="fas fa-lock mr-2"></i> Pay & Place Order</>}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Order Status Checker Card */}
        <div className="premium-card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <h3 className="serif text-2xl">Check Order Status</h3>
              <p className="text-sm text-muted">Enter your tracking ID to see your order progress.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={orderId} 
              onChange={(e) => setOrderId(e.target.value)} 
              placeholder="Enter Ticket/Order ID"
              className="form-input flex-1"
            />
            <button onClick={handleCheckStatus} className="btn-secondary justify-center">
              Check Status <i className="fas fa-search text-xs ml-2"></i>
            </button>
          </div>
        </div>

        {/* Support Card */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted mb-4">Need help or want to fast-track an order?</p>
          <a 
            href="https://wa.me/2349017380098?text=Hello%20MX2ViralWorld,%20I%20need%20assistance" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <i className="fab fa-whatsapp text-lg text-[#25D366]"></i> Chat for Support / Funding
          </a>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-[slideUp_0.3s_ease]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl text-white text-xs font-medium bg-ink">
            <i className="fas fa-info-circle text-base text-accent"></i>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}