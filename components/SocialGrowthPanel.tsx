'use client'
import { useState, useEffect } from 'react'

// Configuration: Markups
const REGULAR_MARKUP = 3 
const VIEWS_MARKUP = 30 

export default function SocialGrowthPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [services, setServices] = useState([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [successOrder, setSuccessOrder] = useState('')

  // Form state
  const [email, setEmail] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [link, setLink] = useState('')
  const [quantity, setQuantity] = useState(500)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    if (isOpen) fetchServices()
  }, [isOpen])

  // Listen for the Hero button click to open this panel
  useEffect(() => {
    const togglePanel = () => setIsOpen(prev => !prev)
    window.addEventListener('toggle-smm-panel', togglePanel)
    return () => window.removeEventListener('toggle-smm-panel', togglePanel)
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
    if (balanceData.balance) setBalance(balanceData.balance)
    
    setLoading(false)
  }

  const selectedService = services.find((s: any) => String(s.service) === String(serviceId))

  const getMarkup = (serviceName: string) => {
    return serviceName.toLowerCase().includes('view') ? VIEWS_MARKUP : REGULAR_MARKUP
  }

  const calculateTotal = () => {
    if (!selectedService || !quantity) return 0
    const markup = getMarkup(selectedService.name)
    const costPer1000NGN = parseFloat(selectedService.rate) * markup
    const totalNGN = Math.ceil((costPer1000NGN / 1000) * quantity)
    return isNaN(totalNGN) ? 0 : totalNGN
  }

  const totalCost = calculateTotal()

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

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

    // FALLBACK: If Paystack key is missing, open the Manual Bank Transfer Modal
    if (!paystackKey || typeof window === 'undefined' || !(window as any).PaystackPop) {
      window.dispatchEvent(new CustomEvent('show-fallback-payment', { 
        detail: { 
          amount: totalCost.toLocaleString(), 
          description: 'MX2ViralWorld Social Media Service' 
        } 
      }))
      return // Stop here so Paystack doesn't try to load
    }

    setLoading(true)
    const reference = `SMM_${Date.now()}`
    setSuccessOrder('')

    try {
      const handler = (window as any).PaystackPop.setup({
        key: paystackKey,
        email: email,
        amount: totalCost * 100,
        ref: reference,
        callback: function(response: any) {
          placeSmmOrder(reference)
        },
        onClose: function() {
          window.dispatchEvent(new CustomEvent('show-fallback-payment', { 
            detail: { 
              amount: totalCost.toLocaleString(), 
              description: 'MX2ViralWorld Social Media Service' 
            } 
          }))
          setLoading(false)
        }
      })
      handler.openIframe()
    } catch (error) {
      showToast('Error initiating payment.')
      setLoading(false)
    }
  }

  const placeSmmOrder = async (reference: string) => {
    const res = await fetch('/api/smm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', service: serviceId, link, quantity })
    })
    const data = await res.json()

    if (data.order) {
      setSuccessOrder(String(data.order))
      setOrderId(String(data.order))
      setLink('')
      fetchServices() 
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
      showToast('Could not find order status.')
    }
  }

  return (
    <>
      {/* Floating Button (Left Side) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[100] w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center p-2 hover:scale-105 transition-transform border-[1.5px] border-amber-400 overflow-hidden"
        aria-label="Open MX2ViralWorld Panel"
      >
        <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1786364796/ed0296b5-7a89-4ed7-bc64-5d1ad018de78.png" alt="MX2ViralWorld" className="w-full h-full object-contain" />
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[100] w-[calc(100vw-3rem)] sm:w-80 max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-ink text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1786364796/ed0296b5-7a89-4ed7-bc64-5d1ad018de78.png" alt="MX2ViralWorld" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-none">MX2ViralWorld</h3>
                <p className="text-[10px] text-white/70 mt-0.5">Boost your social media</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-white/50">Balance</div>
              <div className="font-bold text-accent text-sm">₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-paper">
            
            {/* Success Order Ticket Display */}
            {successOrder && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                <i className="fas fa-check-circle text-green-600 text-lg mb-1"></i>
                <p className="text-xs text-green-800 font-medium">Payment Successful!</p>
                <p className="text-[11px] text-green-700 mt-1">Your Order Ticket ID is: <span className="font-bold text-green-900">{successOrder}</span></p>
                <p className="text-[10px] text-green-600 mt-1">Save this ID to check your status below.</p>
              </div>
            )}

            {loading && services.length === 0 ? (
              <div className="text-center py-6 text-muted">
                <i className="fas fa-spinner fa-spin text-xl mb-2"></i>
                <p className="text-xs">Loading services...</p>
              </div>
            ) : (
              <form onSubmit={handleOrder} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1">Your Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    placeholder="you@email.com"
                    className="form-input !py-2 !text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1">Select Service</label>
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
                    className="form-input !py-2 !text-xs"
                  >
                    <option value="">Choose a service...</option>
                    {services.map((svc: any) => {
                      const markup = getMarkup(svc.name)
                      return (
                        <option key={svc.service} value={svc.service}>
                          {svc.name} (₦{(parseFloat(svc.rate) * markup).toFixed(2)}/1000)
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1">Link (Username/URL)</label>
                  <input 
                    type="text" 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)} 
                    required
                    placeholder="https://instagram.com/yourprofile"
                    className="form-input !py-2 !text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1">
                    Quantity 
                    <span className="text-muted/70 ml-1">(Min: 500, Max: 20,000)</span>
                  </label>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))} 
                    required
                    min={500}
                    max={20000}
                    className="form-input !py-2 !text-xs"
                  />
                </div>

                {serviceId && (
                  <div className="bg-white p-2.5 rounded-lg border border-black/5 flex justify-between items-center">
                    <span className="text-xs text-muted">Total Cost:</span>
                    <span className="serif text-xl text-primary">₦{totalCost.toLocaleString()}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading || !serviceId} 
                  className="btn-primary w-full justify-center !py-2.5 text-xs disabled:opacity-50"
                >
                  {loading ? 'Processing...' : <><i className="fas fa-lock mr-1.5"></i> Pay & Place Order</>}
                </button>
              </form>
            )}

            {/* Order Status Checker */}
            <div className="pt-3 border-t border-black/10">
              <label className="text-[11px] font-medium text-muted block mb-1.5">Check Order Status</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)} 
                  placeholder="Enter Ticket/Order ID"
                  className="form-input !py-2 !text-xs flex-1"
                />
                <button onClick={handleCheckStatus} className="btn-secondary !py-2 !px-3 text-xs">
                  Check
                </button>
              </div>
            </div>

            {/* WhatsApp Support Button */}
            <a 
              href="https://wa.me/2349017380098?text=Hello%20MX2ViralWorld,%20I%20need%20assistance" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 text-xs text-white bg-[#25D366] rounded-lg font-medium hover:opacity-90 transition"
            >
              <i className="fab fa-whatsapp text-base"></i> Chat for Support / Funding
            </a>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-[slideUp_0.3s_ease]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl text-white text-xs font-medium bg-ink">
            <i className="fas fa-info-circle text-base text-accent"></i>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </>
  )
}