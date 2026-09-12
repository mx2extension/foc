'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const MARKUP = parseFloat(process.env.NEXT_PUBLIC_SHOP_MARKUP_PERCENTAGE || '1.3')
const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive']

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('foc_cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Combine search and category for better results
      const keywords = category === 'All' ? search : `${search} ${category}`
      const res = await fetch(`/api/aliexpress?action=search&keywords=${encodeURIComponent(keywords)}`)
      const data = await res.json()
      
      // Extract products safely from the Dropshipping API response
      const apiProducts = data?.aliexpress_solution_product_query_response?.result?.products?.product || data?.products || []
      
      // Apply FindOneCampus Markup
      const markedUpProducts = apiProducts.map((p: any) => {
        const supplierCostUSD = parseFloat(p.target_sale_price || p.product_price || '0')
        const supplierCostNGN = supplierCostUSD * 1500 // Convert USD to NGN
        const sellingPriceNGN = Math.ceil(supplierCostNGN * MARKUP / 100) * 100 // Round to nearest 100
        
        return {
          ...p,
          supplier_cost_ngn: supplierCostNGN,
          selling_price_ngn: sellingPriceNGN
        }
      })
      
      setProducts(markedUpProducts)
    } catch (error) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: any) => {
    const newCart = [...cart, { ...product, qty: 1 }]
    setCart(newCart)
    localStorage.setItem('foc_cart', JSON.stringify(newCart))
    alert(`${product.product_title} added to cart!`)
  }

  return (
    <div className="py-32 relative overflow-hidden">
      <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(193,18,31,0.06)', top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="section-label mb-6">The Campus Shop</div>
            <h1 className="serif" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Global Deals, <span className="serif-italic gradient-text">Delivered.</span>
            </h1>
            <p className="text-lg text-muted mt-4 max-w-xl">
              Browse millions of premium products from AliExpress. Add to cart, checkout securely, and we handle the rest.
            </p>
          </div>
          <Link href="/shop/cart" className="btn-secondary !py-3 !px-5 text-sm whitespace-nowrap">
            <i className="fas fa-cart-shopping mr-2"></i> View Cart ({cart.length})
          </Link>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mb-10">
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
        <div className="flex flex-wrap gap-2 mb-12">
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
            <i className="fas fa-spinner fa-spin text-3xl mb-4"></i>
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
              <div key={p.product_id} className="premium-card overflow-hidden flex flex-col h-full">
                <div className="aspect-square w-full bg-paper overflow-hidden">
                  <img 
                    src={p.product_main_image_url} 
                    alt={p.product_title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-medium text-sm text-ink leading-tight mb-2 line-clamp-2 flex-grow">
                    {p.product_title}
                  </h3>
                  
                  <div className="mb-3">
                    <span className="serif text-xl text-primary">₦{p.selling_price_ngn?.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={() => addToCart(p)} 
                    className="btn-primary w-full justify-center !py-2.5 text-xs"
                  >
                    <i className="fas fa-cart-plus mr-1.5"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}