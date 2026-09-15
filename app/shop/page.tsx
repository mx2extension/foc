'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import ShopAd from '@/components/ShopAd'

const CATEGORIES: Record<string, string[]> = {
  'All': [],
  'Electronics': ['Smartphones', 'Laptops', 'Accessories', 'Audio'],
  'Fashion': ['Male', 'Female', 'Unisex', 'Accessories'],
  'Home & Garden': ['Furniture', 'Decor', 'Kitchen'],
  'Health & Beauty': ['Skincare', 'Haircare', 'Fitness'],
  'Sports & Outdoors': ['Gear', 'Apparel', 'Equipment']
};

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [subCategory, setSubCategory] = useState('')
  const [sort, setSort] = useState('created_at_desc')
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('foc_cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, category, subCategory, sort])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase.from('foc_products').select('*')
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (category !== 'All') {
      query = query.eq('category', category)
      if (subCategory) query = query.eq('sub_category', subCategory)
    }

    if (sort === 'price_asc') query = query.order('price_ngn', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price_ngn', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const addToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      product_id: product.id,
      product_title: product.title,
      selling_price_ngn: product.price_ngn,
      product_main_image_url: product.images[0],
      qty: 1
    }
    const newCart = [...cart, cartItem]
    setCart(newCart)
    localStorage.setItem('foc_cart', JSON.stringify(newCart))
    alert('Added to cart!')
  }

  return (
    <div className="py-32 relative overflow-hidden">
      <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(193,18,31,0.06)', top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="section-label mb-6">The Campus Shop</div>
            <h1 className="serif" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Premium Goods, <span className="serif-italic gradient-text">Curated.</span>
            </h1>
            <p className="text-lg text-muted mt-4 max-w-xl">
              Browse our exclusive collection. Add to cart, checkout securely, and we handle the rest.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/shop/track" className="btn-secondary !py-3 !px-5 text-sm whitespace-nowrap">
              <i className="fas fa-truck-fast mr-2"></i> Track Order
            </Link>
            <Link href="/shop/cart" className="btn-primary !py-3 !px-5 text-sm whitespace-nowrap">
              <i className="fas fa-cart-shopping mr-2"></i> View Cart ({cart.length})
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative flex items-center bg-white border border-black/10 rounded-full shadow-lg overflow-hidden">
            <i className="fas fa-search absolute left-5 text-muted"></i>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search our products..." className="w-full bg-transparent pl-14 pr-4 py-4 text-base focus:outline-none" />
          </div>
          <select className="form-input md:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="created_at_desc">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(CATEGORIES).map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setSubCategory('') }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${category === cat ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted hover:text-ink'}`}>
              {cat}
            </button>
          ))}
        </div>

        {category !== 'All' && CATEGORIES[category].length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-black/5">
            <button onClick={() => setSubCategory('')} className={`px-4 py-2 rounded-full text-xs font-medium transition ${subCategory === '' ? 'bg-primary text-white' : 'bg-paper border border-black/5 text-muted'}`}>
              All {category}
            </button>
            {CATEGORIES[category].map(sub => (
              <button key={sub} onClick={() => setSubCategory(sub)} className={`px-4 py-2 rounded-full text-xs font-medium transition ${subCategory === sub ? 'bg-primary text-white' : 'bg-paper border border-black/5 text-muted'}`}>
                {sub}
              </button>
            ))}
          </div>
        )}

        <ShopAd placement="shop_top" />

        {loading ? (
          <div className="text-center py-20 text-muted">
            <i className="fas fa-spinner fa-spin text-3xl mb-4"></i>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <i className="fas fa-box-open text-4xl mb-4 opacity-50"></i>
            <p>No products found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <div key={p.id} className="premium-card overflow-hidden flex flex-col h-full">
                <Link href={`/shop/${p.id}`} className="aspect-square w-full bg-paper overflow-hidden block">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <Link href={`/shop/${p.id}`}>
                    <h3 className="font-medium text-sm text-ink leading-tight mb-2 line-clamp-2 flex-grow hover:text-primary transition">
                      {p.title}
                    </h3>
                  </Link>
                  <div className="mb-3">
                    <span className="serif text-xl text-primary">₦{p.price_ngn.toLocaleString()}</span>
                  </div>
                  <button onClick={() => addToCart(p)} className="btn-primary w-full justify-center !py-2.5 text-xs">
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