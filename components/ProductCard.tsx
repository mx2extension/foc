'use client'
import { useState } from 'react'

interface Product {
  product_id: string
  product_title: string
  product_main_image_url: string
  target_sale_price: string
  target_sale_price_currency: string
  product_rating?: string
  evaluate_rate?: string
  product_detail_url?: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)

  const handleBuyNow = async () => {
    setLoading(true)
    try {
      // Call our local Next.js API to generate the affiliate link securely
      const res = await fetch(`/api/aliexpress?action=get_link&url=${encodeURIComponent(product.product_detail_url || `https://www.aliexpress.com/item/${product.product_id}.html`)}`)
      const data = await res.json()
      
      const trackedLink = data?.aliexpress_affiliate_link_generate_response?.resp_result?.result?.promotion_links?.promotion_link?.[0]?.promotion_link || product.product_detail_url
      
      if (trackedLink) {
        window.open(trackedLink, '_blank')
      } else {
        alert('Could not generate affiliate link at this time.')
      }
    } catch (error) {
      console.error('Link generation error:', error)
      window.open(product.product_detail_url || `https://www.aliexpress.com/item/${product.product_id}.html`, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="premium-card overflow-hidden flex flex-col h-full">
      <div className="aspect-square w-full bg-paper overflow-hidden">
        <img 
          src={product.product_main_image_url} 
          alt={product.product_title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-sm text-ink leading-tight mb-2 line-clamp-2 flex-grow">
          {product.product_title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3 text-xs text-muted">
          {product.product_rating && (
            <span className="flex items-center gap-1 text-accent">
              <i className="fas fa-star"></i> {product.product_rating}
            </span>
          )}
          {product.evaluate_rate && (
            <span>({product.evaluate_rate})</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="serif text-xl text-primary">{product.target_sale_price_currency} {product.target_sale_price}</span>
          </div>
        </div>

        <button 
          onClick={handleBuyNow} 
          disabled={loading}
          className="btn-primary w-full justify-center !py-2.5 text-xs disabled:opacity-50"
        >
          {loading ? <><i className="fas fa-spinner fa-spin mr-1"></i> Redirecting...</> : <><i className="fas fa-cart-shopping mr-1"></i> Buy on AliExpress</>}
        </button>
      </div>
    </div>
  )
}