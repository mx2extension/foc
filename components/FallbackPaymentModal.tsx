'use client'
import { useState, useEffect } from 'react'

export default function FallbackPaymentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [details, setDetails] = useState({
    amount: '',
    description: 'your purchase'
  })

  useEffect(() => {
    const showModal = (e: any) => {
      setDetails({
        amount: e.detail?.amount || '',
        description: e.detail?.description || 'your purchase'
      })
      setIsOpen(true)
    }
    window.addEventListener('show-fallback-payment', showModal)
    return () => window.removeEventListener('show-fallback-payment', showModal)
  }, [])

  const copyAccount = () => {
    navigator.clipboard.writeText('8149193063')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper flex items-center justify-center text-muted hover:bg-black/5 transition"
        >
          <i className="fas fa-times text-sm"></i>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-university text-amber-600 text-xl"></i>
          </div>
          <h3 className="serif text-2xl mb-1">Complete Your Payment</h3>
          <p className="text-sm text-muted">Having trouble with the card payment? You can pay directly via bank transfer.</p>
        </div>

        {details.amount && (
          <div className="bg-paper p-4 rounded-xl text-center mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Amount to Pay</p>
            <p className="serif text-2xl text-primary font-bold">₦{details.amount}</p>
          </div>
        )}

        <div className="space-y-4 border-y border-black/5 py-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Bank Name</span>
            <span className="font-semibold text-sm">Palmpay</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Account Name</span>
            <span className="font-semibold text-sm">Chinemerem Nwankpa</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Account Number</span>
            <button onClick={copyAccount} className="flex items-center gap-2 font-semibold text-sm text-primary hover:underline">
              8149193063 <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-xs`}></i>
            </button>
          </div>
        </div>

        <a 
          href={`https://wa.me/2348149193063?text=Hello%20FindOneCampus,%20I%20just%20made%20a%20bank%20transfer%20of%20${details.amount || 'funds'}%20for%20${details.description}.%20Here%20is%20the%20screenshot.`}
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary w-full justify-center !py-3.5"
        >
          <i className="fab fa-whatsapp text-lg"></i> Send Receipt on WhatsApp
        </a>
        
        <p className="text-[10px] text-center text-muted mt-4">
          Your account will be activated manually once the payment is confirmed. Please allow a few minutes.
        </p>
      </div>
    </div>
  )
}