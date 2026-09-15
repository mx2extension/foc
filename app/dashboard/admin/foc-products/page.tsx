'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

const CATEGORIES: Record<string, string[]> = {
  'Electronics': ['Smartphones', 'Laptops', 'Accessories', 'Audio'],
  'Fashion': ['Male', 'Female', 'Unisex', 'Accessories'],
  'Home & Garden': ['Furniture', 'Decor', 'Kitchen'],
  'Health & Beauty': ['Skincare', 'Haircare', 'Fitness'],
  'Sports & Outdoors': ['Gear', 'Apparel', 'Equipment'],
  'Other': ['General']
};

export default function ManageFocProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', price_ngn: 0, category: 'Electronics', sub_category: 'Smartphones' })
  const [imageUrls, setImageUrls] = useState('') // Comma-separated URLs
  const [images, setImages] = useState<File[]>([])
  
  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('foc_products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files) as File[]
    if (files.length > 4) { alert('Max 4 images.'); return }
    setImages(files)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let finalImageUrls: string[] = []

    // 1. Add URLs from text input
    if (imageUrls.trim() !== '') {
      finalImageUrls = imageUrls.split(',').map(u => u.trim()).filter(u => u !== '')
    }

    // 2. Upload files if any
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileName = `${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage.from('foc-products').upload(fileName, file)
        if (uploadError) { alert('Error uploading image: ' + uploadError.message); setLoading(false); return }
        const { data: urlData } = supabase.storage.from('foc-products').getPublicUrl(fileName)
        finalImageUrls.push(urlData.publicUrl)
      }
    }

    if (finalImageUrls.length < 1) { alert('Please provide at least 1 image (URL or upload).'); setLoading(false); return }

    // Save product to database
    await supabase.from('foc_products').insert({
      ...form,
      price_ngn: Number(form.price_ngn),
      images: finalImageUrls
    })
    
    setForm({ title: '', description: '', price_ngn: 0, category: 'Electronics', sub_category: 'Smartphones' })
    setImageUrls('')
    setImages([])
    fetchProducts()
    setLoading(false)
  }

  const deleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      await supabase.from('foc_products').delete().eq('id', id)
      fetchProducts()
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Our Products</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="premium-card p-8">
          <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <input required type="text" placeholder="Product Title" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <textarea required rows={3} placeholder="Product Description" className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
            
            <div className="grid grid-cols-2 gap-4">
              <select required className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value, sub_category: CATEGORIES[e.target.value][0]})}>
                {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select required className="form-input" value={form.sub_category} onChange={e => setForm({...form, sub_category: e.target.value})}>
                {CATEGORIES[form.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>

            <input required type="number" placeholder="Price (NGN)" className="form-input" value={form.price_ngn} onChange={e => setForm({...form, price_ngn: Number(e.target.value)})} />
            
            <div>
              <label className="text-sm font-medium block mb-2">Image URLs (Comma-separated)</label>
              <input type="text" placeholder="https://img1.com, https://img2.com" className="form-input" value={imageUrls} onChange={e => setImageUrls(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Or Upload Files (Max 4)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="form-input !p-2" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Saving...' : 'Add Product'}
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">Existing Products</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {products.map((p: any) => (
              <div key={p.id} className="premium-card p-4 flex items-center gap-4">
                <img src={p.images?.[0]} alt={p.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-muted">{p.category} • {p.sub_category}</p>
                  <p className="text-xs text-primary">₦{p.price_ngn.toLocaleString()}</p>
                </div>
                <button onClick={() => deleteProduct(p.id)} className="text-red-500 text-xs hover:underline">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}