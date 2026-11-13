'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Configuration: Markups
const REGULAR_MARKUP = 3 
const VIEWS_MARKUP = 30 

export default function SocialGrowthPage() {
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

    // Fully pre-filled WhatsApp message containing all order and Opay payment details
    const rawMsg = `Hello Chinemerem, I want to place a social media order and make my payment.\n\n📋 *Order Details*\n• Email: ${email}\n• Service: ${selectedService?.name}\n• Link: ${link}\n• Quantity: ${quantity}\n• Total Amount: ₦${totalCost.toLocaleString()}\n\n🏦 *Payment Info*\n• Bank: Opay\n• Account Number: 8149193063\n• Account Name: Chinemerem Nwankpa\n\n[Attached is my payment screenshot]`
    const encodedMsg = encodeURIComponent(rawMsg)
    
    setWaLink(`https://wa.me/2348149193063?text=${encodedMsg}`)
    setOrderPlaced(true)
  }

  const handleReset = () => {
    setOrderPlaced(false)
    setLink('')
    setServiceId('')
  }

  const handleCheckStatus = async () => {
    if (!orderId) {
      showToast('Please enter a valid Order/Ticket ID.')
      return
    }
    
    // Fallback status check alert
    showToast(`Order ${orderId} is currently being processed manually via WhatsApp.`)
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
            Seamlessly grow your audience across all major platforms. Select a service, fill in your details, and complete your bank transfer via WhatsApp.
          </p>
        </div>

        {/* Main Card */}
        <div className="premium-card p-8 md:p-12 mb-8">
          {orderPlaced ? (
            <div className="text-center space-y-6 max-w-md mx-auto py-4">
              <div>
                <i className="fas fa-wallet text-amber-600 text-5xl mb-3"></i>
                <h2 className="serif text-3xl mb-1">Complete Your Bank Transfer</h2>
                <p className="text-sm text-muted">Transfer the exact total amount to the account details below:</p>
              </div>

              <div className="bg-paper p-5 rounded-2xl border border-amber-200 text-left space-y-3 text-sm shadow-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Bank Name:</span>
                  <span className="font-bold text-ink">Opay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Account Number:</span>
                  <span className="font-bold text-primary select-all text-base">8149193063</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Account Name:</span>
                  <span className="font-bold text-ink">Chinemerem Nwankpa</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-black/5">
                  <span className="text-muted font-medium">Amount to Pay:</span>
                  <span className="font-bold text-emerald-600 text-xl">₦{totalCost.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-muted">
                After making the transfer, click the button below. Your order details and payment message are already fully pre-filled—just attach your transfer screenshot and send!
              </p>

              <div className="space-y-3 pt-2">
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center shadow-lg"
                  style={{ background: '#25D366', boxShadow: '0 20px 40px -15px rgba(37,211,102,0.4)' }}
                >
                  <i className="fab fa-whatsapp text-lg"></i> Send Pre-filled WhatsApp Message
                </a>
                
                <button 
                  onClick={handleReset}
                  className="text-sm text-muted hover:text-ink transition block mx-auto py-2"
                >
                  ← Edit Order Details
                </button>
              </div>
            </div>
          ) : loading && services.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <i className="fas fa-spinner fa-spin text-3xl mb-4 text-primary"></i>
              <p>Loading available services...</p>
            </div>
          ) : (
            <form onSubmit={handleProceedToPayment} className="grid md:grid-cols-2 gap-8">
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
                  <span className="text-sm text-muted font-medium">Total Amount:</span>
                  <span className="serif text-3xl gradient-text">₦{totalCost.toLocaleString()}</span>
                </div>

                <button 
                  type="submit" 
                  disabled={!serviceId} 
                  className="btn-primary w-full justify-center mt-2 disabled:opacity-50"
                >
                  <i className="fas fa-paper-plane mr-2"></i> Proceed to Bank Transfer
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Support Card */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted mb-4">Need help or want to speak with support?</p>
          <a 
            href="https://wa.me/2348149193063?text=Hello%20Chinemerem,%20I%20need%20assistance%20with%20my%20social%20media%20order." 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
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