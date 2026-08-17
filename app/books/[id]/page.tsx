// app/books/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically load the universal PDF Modal
const PdfModal = dynamic(() => import('@/components/PdfModal'), { ssr: false })

export default function AboutBookPage() {
  const params = useParams()
  const bookId = params?.id as string
  
  const [book, setBook] = useState<any>(null)
  const [reader, setReader] = useState<any>(null)
  const [isOwned, setIsOwned] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [isReaderOpen, setIsReaderOpen] = useState(false)

  useEffect(() => { const r = localStorage.getItem('foc_reader'); if (r) try { setReader(JSON.parse(r)) } catch (e) {} }, [])
  useEffect(() => { if (!bookId) return; const f = async () => { const { data } = await supabase.from('books').select('*').eq('id', bookId).single(); setBook(data); setLoading(false) }; f() }, [bookId])
  useEffect(() => { if (!reader || !book) return; const c = async () => { const { data } = await supabase.from('book_purchases').select('id').eq('reader_email', reader.email.toLowerCase()).eq('book_id', book.id); if (data && data.length > 0) setIsOwned(true) }; c() }, [reader, book])

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 4000) }

  const handleBuy = async () => {
    if (!reader) { showToast('Please log in first.'); window.location.href = `/login?redirect=/books/${book.id}`; return }
    
    const flwKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY
    if (!flwKey || !(window as any).FlutterwaveCheckout) {
      window.dispatchEvent(new CustomEvent('show-fallback-payment', { detail: { amount: book.price.toLocaleString(), description: `${book.title} (Book)` }}))
      return
    }

    setPaying(true)
    const reference = generateReference('BOOK')
    const buyerEmail = reader.email.toLowerCase()
    await supabase.from('payments').insert({ amount: book.price, status: 'pending', reference, item_type: 'book', item_id: book.id, email: buyerEmail })
    try {
      (window as any).FlutterwaveCheckout({
        public_key: flwKey,
        tx_ref: reference,
        amount: book.price,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: { email: buyerEmail },
        callback: function(data: any) {
          if (data.status === 'successful' || data.status === 'completed') {
            const vp = async () => {
              await supabase.from('payments').update({ status: 'success' }).eq('reference', reference)
              await supabase.from('book_purchases').insert({ reader_email: buyerEmail, book_id: book.id, reference: reference })
              setIsOwned(true); showToast('Purchase successful!')
            }; vp()
          }
        },
        onclose: function() { setPaying(false) }
      })
    } catch (error) { showToast('Error initiating payment.'); setPaying(false) }
  }

  if (loading) return <div className="py-32 text-center text-muted">Loading book...</div>
  if (!book) return <div className="py-32 text-center text-muted">Book not found.</div>

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out "${book.title}" by ${book.author} on FindOneCampus!`

  return (
    <div className="relative overflow-hidden py-32 px-6 lg:px-10">
      
      {/* --- UNIVERSAL PDF MODAL --- */}
      {isReaderOpen && (
        <PdfModal 
          url={book.download_url} 
          title={book.title} 
          onClose={() => setIsReaderOpen(false)} 
        />
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[slideUp_0.3s_ease]">
          <div className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white text-sm font-medium bg-green-600"><i className="fas fa-check-circle text-lg"></i><span>{toast}</span></div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <Link href="/books" className="mb-12 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition"><i className="fas fa-arrow-left text-xs"></i> Back to Bookstore</Link>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="aspect-[3/4] rounded-xl relative overflow-hidden shadow-2xl flex flex-col justify-between p-8 text-white sticky top-32" style={book.cover_config?.image_url ? { backgroundImage: `url(${book.cover_config.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: book.cover_config?.bg || 'linear-gradient(135deg, #1A1A1A, #C1121F)' }}>
              {!book.cover_config?.image_url && (
                <>
                  <div className="text-xs tracking-[0.3em] opacity-70">{book.cover_config?.label || 'FOC PRESS'}</div>
                  <div>
                    <div className="serif text-3xl leading-tight mb-2">{book.title}</div>
                    <div className="text-sm opacity-70 italic">{book.cover_config?.sub || 'Book'}</div>
                    <div className="text-sm mt-6 opacity-80">by {book.author}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="section-label mb-4">Book Details</div>
            <h1 className="serif text-4xl md:text-5xl mb-3" style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>{book.title}</h1>
            <p className="text-primary font-medium mb-6">by {book.author}</p>
            <p className="text-lg text-muted leading-relaxed mb-8 font-light">{book.description}</p>
            <div className="flex items-center gap-4 mb-10">
              {book.price === 0 ? (<span className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-bold text-sm">Free</span>) : (<span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">₦{book.price.toLocaleString()}</span>)}
              {isOwned || book.price === 0 ? (<button onClick={() => setIsReaderOpen(true)} className="btn-primary !py-3 !px-6 text-sm"><i className="fas fa-book-open"></i> Read Book</button>) : (<button onClick={handleBuy} disabled={paying} className="btn-primary !py-3 !px-6 text-sm disabled:opacity-50">{paying ? 'Processing...' : <><i className="fas fa-cart-shopping"></i> Buy Now</>}</button>)}
            </div>
            {book.about && (<div className="premium-card p-8 mb-10"><h2 className="serif text-2xl mb-4">About the Book</h2><div className="prose prose-lg max-w-none text-ink/80 leading-relaxed space-y-4">{book.about.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)}</div></div>)}
            <div className="border-t border-black/5 pt-8">
              <h3 className="text-sm font-semibold text-ink/80 mb-4">Share this book</h3>
              <div className="flex items-center gap-3">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-twitter"></i></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition"><i className="fab fa-whatsapp"></i></a>
                <button onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('Link copied!') }} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fas fa-link"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </div>
  )
}