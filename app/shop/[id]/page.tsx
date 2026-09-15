'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchProduct = async () => {
      const { data } = await supabase.from('foc_products').select('*').eq('id', id).single()
      if (data) {
        setProduct(data)
        setActiveImage(data.images[0])
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const addToCart = () => {
    if (!product) return
    const cartItem = {
      id: product.id,
      product_id: product.id,
      product_title: product.title,
      selling_price_ngn: product.price_ngn,
      product_main_image_url: product.images[0],
      qty: 1
    }
    
    const existingCart = JSON.parse(localStorage.getItem('foc_cart') || '[]')
    const newCart = [...existingCart, cartItem]
    localStorage.setItem('foc_cart', JSON.stringify(newCart))
    
    // Redirect straight to checkout
    window.location.href = '/shop/cart'
  }

  if (loading) return <div className="py-32 text-center text-muted">Loading product...</div>
  if (!product) return <div className="py-32 text-center text-muted">Product not found. <Link href="/shop" className="text-primary">Back to shop</Link></div>

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-32">
      <Link href="/shop" className="mb-12 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition">
        <i className="fas fa-arrow-left text-xs"></i> Back to all products
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden shadow-xl bg-paper">
            <img src={activeImage} alt={product.title} className="w-full h-full object-cover" />
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition ${activeImage === img ? 'border-primary' : 'border-transparent hover:border-black/10'}`}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted">
            <span className="font-medium text-primary">{product.category}</span>
            <span className="w-1 h-1 rounded-full bg-muted"></span>
            <span>{product.sub_category}</span>
          </div>
          
          <h1 className="serif text-4xl lg:text-5xl mb-4" style={{ lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {product.title}
          </h1>
          
          <div className="mb-8">
            <span className="serif text-3xl text-primary">₦{product.price_ngn.toLocaleString()}</span>
          </div>

          <div className="premium-card p-6 bg-paper mb-8">
            <h2 className="text-sm font-semibold text-ink/80 uppercase tracking-wider mb-3">Description</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <i className="fas fa-circle-check"></i> {product.stock_status || 'In Stock'}
            </div>
            
            <button 
              onClick={addToCart} 
              className="btn-primary w-full justify-center !py-4 text-base"
            >
              <i className="fas fa-cart-plus mr-2"></i> Add to Cart & Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}