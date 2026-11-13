'use client'
import { useState, useEffect } from 'react'

// Configuration: Markups
const REGULAR_MARKUP = 3 
const VIEWS_MARKUP = 30 

export default function SocialGrowthPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [waLink, setWaLink] = useState('')

  // Form state
  const [email, setEmail] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [link, setLink] = useState('')
  const [quantity, setQuantity] = useState(500)

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
    try {
      const servicesRes = await fetch('/api/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'services' })
      })
      const servicesData = await servicesRes.json()
      if (Array.isArray(servicesData)) setServices(servicesData)
    } catch (error) {
      showToast('Error loading services.')
    }
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

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      showToast('Please enter your email to proceed.')
      return
    }

    if (!serviceId) {
      showToast('Please select a service.')
      return
    }

    if (quantity < 500 || quantity > 20000) {
      showToast('Quantity must be between 500 and 20,000.')
      return
    }

    // Fully formatted WhatsApp message containing all order and payment details
    const rawMsg = `Hello MX2ViralWorld, I have made my payment.\n\n📋 *Order Details*\n• Service: ${selectedService?.name}\n• Link: ${link}\n• Quantity: ${quantity}\n• Total Amount: ₦${totalCost.toLocaleString()}\n\n🏦 *Payment Info*\n• Bank: Opay\n• Account Number: 8149193063\n• Account Name: Chinemerem Nwankpa\n\n[Attached is my payment screenshot]`
    const encodedMsg = encodeURIComponent(rawMsg)
    
    setWaLink(`https://wa.me/2348149193063?text=${encodedMsg}`)
    setOrderPlaced(true)
  }

  const handleReset = () => {
    setOrderPlaced(false)
    setLink('')
    setServiceId('')
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
        <div className="fixed bottom-24 left-6 z-[100] w-[calc(100vw-3rem)] sm:w-80 max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
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
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close Panel"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-paper">
            {orderPlaced ? (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg space-y-3 text-center">
                <div>
                  <i className="fas fa-wallet text-amber-600 text-xl mb-1"></i>
                  <p className="text-xs text-amber-900 font-bold">Complete Your Bank Transfer</p>
                </div>

                <div className="bg-white p-3 rounded-md border border-amber-200 text-left space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Bank Name:</span>
                    <span className="font-bold text-ink">Opay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Account Number:</span>
                    <span className="font-bold text-primary select-all">8149193063</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Account Name:</span>
                    <span className="font-bold text-ink">Chinemerem Nwankpa</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-black/5">
                    <span className="text-muted">Amount to Pay:</span>
                    <span className="font-bold text-emerald-600 text-sm">₦{totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[10px] text-amber-800">
                  After making the transfer, click below. Your order details are already formatted—just attach your screenshot and send!
                </p>

                <div className="space-y-2 pt-1">
                  <a 
                    href={waLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-xs text-white bg-[#25D366] rounded-lg font-medium hover:opacity-90 transition shadow"
                  >
                    <i className="fab fa-whatsapp text-base"></i> Send Pre-filled WhatsApp Message
                  </a>
                  
                  <button 
                    onClick={handleReset}
                    className="w-full py-1.5 text-[11px] text-muted hover:text-ink transition"
                  >
                    ← Back to Order Form
                  </button>
                </div>
              </div>
            ) : loading && services.length === 0 ? (
              <div className="text-center py-6 text-muted">
                <i className="fas fa-spinner fa-spin text-xl mb-2"></i>
                <p className="text-xs">Loading services...</p>
              </div>
            ) : (
              <form onSubmit={handleProceedToPayment} className="space-y-3">
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

                {/* Category Dropdown */}
                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1">Service Type (Category)</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setServiceId('') // Reset service when category changes
                    }}
                    className="form-input !py-2 !text-xs"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
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

                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1">Link</label>
                  <input 
                    type="text" 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)} 
                    required
                    placeholder={getLinkPlaceholder(selectedService?.name)}
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
                    <span className="text-xs text-muted">Total Amount:</span>
                    <span className="serif text-xl text-primary">₦{totalCost.toLocaleString()}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={!serviceId} 
                  className="btn-primary w-full justify-center !py-2.5 text-xs disabled:opacity-50"
                >
                  <><i className="fas fa-paper-plane mr-1.5"></i> Proceed to Bank Transfer</>
                </button>
              </form>
            )}

            {/* WhatsApp Support Button */}
            <a 
              href="https://wa.me/2348149193063?text=Hello%20Chinemerem,%20I%20need%20assistance%20with%20my%20social%20media%20order." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 text-xs text-white bg-[#25D366] rounded-lg font-medium hover:opacity-90 transition"
            >
              <i className="fab fa-whatsapp text-base"></i> Chat for Support
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