'use client'
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = [
  'All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive'
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const keywords = category === 'All' ? search : `${search} ${category}`
      const res = await fetch(`/api/aliexpress?action=search&keywords=${encodeURIComponent(keywords)}`)
      const data = await res.json()
      
      const apiProducts = data?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product || []
      setProducts(apiProducts)
    } catch (error) {
      console.error('Fetch error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-32 relative overflow-hidden">
      <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(193,18,31,0.06)', top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
            <span className="w-6 h-px bg-primary"></span>
            The Campus Shop
            <span className="w-6 h-px bg-primary"></span>
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Global Deals, <span className="serif-italic gradient-text">Delivered.</span>
          </h1>
          <p className="text-lg text-muted mt-6 max-w-2xl mx-auto">
            Browse millions of products from AliExpress. As an affiliate, we connect you to the best global deals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative flex items-center bg-white border border-black/10 rounded-full shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] focus-within:border-primary focus-within:shadow-[0_20px_60px_-20px_rgba(193,18,31,0.25)] transition-all overflow-hidden">
            <i className="fas fa-search absolute left-7 text-muted pointer-events-none"></i>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-transparent pl-16 pr-4 py-5 text-base focus:outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${category === cat ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted hover:text-ink'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted">
            <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <i className="fas fa-box-open text-4xl mb-4 opacity-50"></i>
            <p>No products found. Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}