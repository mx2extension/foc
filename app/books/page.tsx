'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'
import Link from 'next/link'

export default function BooksPage() {
  const [reader, setReader] = useState<any>(null)
  const [books, setBooks] = useState([])
  const [ownedBookIds, setOwnedBookIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all')

  useEffect(() => {
    const storedReader = localStorage.getItem('foc_reader')
    if (storedReader) {
      try {
        const parsedReader = JSON.parse(storedReader)
        if (parsedReader && parsedReader.email) setReader(parsedReader)
        else { localStorage.removeItem('foc_reader'); setLoading(false) }
      } catch (e) { localStorage.removeItem('foc_reader'); setLoading(false) }
    } else { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!reader) return
    const fetchData = async () => {
      setLoading(true)
      const { data: booksData } = await supabase.from('books').select('*').order('created_at', { ascending: false })
      setBooks(booksData || [])
      const { data: purchasesData } = await supabase.from('book_purchases').select('book_id').eq('reader_email', reader.email.toLowerCase())
      setOwnedBookIds(purchasesData?.map((p: any) => p.book_id) || [])
      setLoading(false)
    }
    fetchData()
  }, [reader])

  const showToast = (message: string) => { setToast(message); setTimeout(() => setToast(null), 4000) }

  const handleLogout = () => {
    localStorage.removeItem('foc_reader')
    setReader(null); setOwnedBookIds([]); setBooks([]); setActiveTab('all')
  }

  const handleBuyBook = async (book: any) => {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    
    // FALLBACK: If Paystack is missing, open manual bank transfer modal
    if (!paystackKey || !(window as any).PaystackPop) {
      window.dispatchEvent(new CustomEvent('show-fallback-payment', { 
        detail: { amount: book.price.toLocaleString(), description: `${book.title} (Book)` }
      }))
      return
    }

    const reference = generateReference('BOOK')
    const buyerEmail = reader?.email.toLowerCase()

    await supabase.from('payments').insert({ amount: book.price, status: 'pending', reference, item_type: 'book', item_id: book.id, email: buyerEmail })

    try {
      const handler = (window as any).PaystackPop.setup({
        key: paystackKey, email: buyerEmail, amount: book.price * 100, ref: reference,
        metadata: { item_type: 'book', item_id: book.id },
        callback: function(response: any) {
          const verifyPayment = async () => {
            await supabase.from('payments').update({ status: 'success' }).eq('reference', reference)
            await supabase.from('book_purchases').insert({ reader_email: buyerEmail, book_id: book.id, reference: reference })
            setOwnedBookIds(prev => [...prev, book.id])
            showToast('Purchase successful! You can now read the book.')
          }
          verifyPayment()
        },
        onClose: function() {}
      })
      handler.openIframe()
    } catch (error) { showToast('Error initiating payment.') }
  }

  if (!reader) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
          <span className="w-6 h-px bg-primary"></span>The Bookstore<span className="w-6 h-px bg-primary"></span>
        </div>
        <h1 className="serif text-4xl md:text-5xl mb-4">Reader <span className="gradient-text">Portal</span></h1>
        <p className="text-muted mb-12">Please log in to browse, buy, and read your books.</p>
        <Link href="/login?redirect=/books" className="btn-primary !py-4 !px-8">Login / Register</Link>
      </div>
    )
  }

  const displayedBooks = activeTab === 'mine' ? books.filter((b: any) => ownedBookIds.includes(b.id) || b.price === 0) : books

  return (
    <div className="relative overflow-hidden">
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[slideUp_0.3s_ease]">
          <div className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white text-sm font-medium bg-green-600">
            <i className="fas fa-check-circle text-lg"></i><span>{toast}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="section-label mb-6">The bookstore</div>
            <h1 className="serif" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>Your <span className="serif-italic gradient-text">Library.</span></h1>
            <p className="text-muted mt-4 text-sm">Welcome back, <span className="font-medium text-ink">{reader.name}</span></p>
          </div>
          <button onClick={handleLogout} className="btn-secondary !py-2.5 !px-5 text-sm">Log Out</button>
        </div>

        <div className="flex gap-2 mb-10 border-b border-black/5 pb-4">
          <button onClick={() => setActiveTab('all')} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${activeTab === 'all' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>All Books</button>
          <button onClick={() => setActiveTab('mine')} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${activeTab === 'mine' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>My Books ({ownedBookIds.length})</button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">Loading your library...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBooks.map((book: any) => {
              const isOwned = ownedBookIds.includes(book.id)
              const isFree = book.price === 0
              return (
                <div key={book.id} className="premium-card p-6 flex flex-col">
                  <div 
                    className="aspect-[3/4] rounded-lg mb-6 relative overflow-hidden shadow-xl flex flex-col justify-between p-6 text-white"
                    style={book.cover_config?.image_url ? { backgroundImage: `url(${book.cover_config.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: book.cover_config?.bg || 'linear-gradient(135deg, #1A1A1A, #C1121F)' }}
                  >
                    {!book.cover_config?.image_url && (
                      <>
                        <div className="text-[10px] tracking-[0.3em] opacity-70">{book.cover_config?.label || 'FOC PRESS'}</div>
                        <div>
                          <div className="serif text-2xl leading-tight mb-2">{book.title}</div>
                          <div className="text-xs opacity-70 italic">{book.cover_config?.sub || 'Book'}</div>
                          <div className="text-xs mt-4 opacity-80">by {book.author}</div>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{book.description}</p>
                  
                  <div className="mt-auto space-y-2">
                    {isOwned || isFree ? (
                      <Link href={`/books/${book.id}`} className="btn-primary w-full justify-center !py-3 text-sm">
                        <i className="fas fa-book-open"></i> Read / Download
                      </Link>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleBuyBook(book)} className="flex-1 btn-primary justify-center !py-3 text-sm">
                          <i className="fas fa-cart-shopping text-xs"></i> Buy ₦{book.price.toLocaleString()}
                        </button>
                        <Link href={`/books/${book.id}`} className="flex-1 btn-secondary justify-center !py-3 text-sm !bg-paper">
                          <i className="fas fa-info-circle text-xs"></i> About
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            {displayedBooks.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted">No books available.</div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </div>
  )
}