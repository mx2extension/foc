'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageResources() {
  const [resources, setResources] = useState<any[]>([])
  const [isPaid, setIsPaid] = useState(false)
  const [form, setForm] = useState({ 
    type: 'book', 
    title: '', 
    author: '', 
    description: '', 
    url: '', 
    price: 0, 
    image_url: '' 
  })

  useEffect(() => { fetchResources() }, [])

  const fetchResources = async () => {
    const { data } = await supabase.from('resources').select('*')
    setResources(data || [])
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalPrice = isPaid ? Number(form.price) : 0
    
    await supabase.from('resources').insert({
      type: form.type,
      title: form.title,
      author: form.author,
      description: form.description,
      url: form.url,
      price: finalPrice,
      image_url: form.image_url || null // Save Cloudinary link if provided
    })
    
    setForm({ type: 'book', title: '', author: '', description: '', url: '', price: 0, image_url: '' })
    setIsPaid(false)
    fetchResources()
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage Resources</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="premium-card p-8">
          <h2 className="text-xl font-semibold mb-6">Add New Resource</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="book">Book</option>
              <option value="podcast">Podcast</option>
              <option value="movie">Movie</option>
              <option value="tool">Tool</option>
              <option value="article">Article</option>
              <option value="recommendation">Recommendation</option>
            </select>
            <input className="form-input" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <input className="form-input" placeholder="Author / Creator" required value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
            <textarea className="form-input" rows={3} placeholder="Description" required value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
            <input className="form-input" placeholder="URL (Link to resource)" required value={form.url} onChange={e => setForm({...form, url: e.target.value})} />
            
            <div className="pt-2">
              <h3 className="text-sm font-semibold mb-3 text-ink/80">Thumbnail Image (Optional)</h3>
              <input 
                className="form-input" 
                placeholder="Paste Cloudinary Image URL" 
                value={form.image_url} 
                onChange={e => setForm({...form, image_url: e.target.value})} 
              />
            </div>

            {/* Free / Paid Toggle */}
            <div className="flex gap-4 pt-2">
              <button 
                type="button" 
                onClick={() => setIsPaid(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${!isPaid ? 'bg-green-500 text-white' : 'bg-paper border border-black/5 text-muted'}`}
              >
                Free
              </button>
              <button 
                type="button" 
                onClick={() => setIsPaid(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${isPaid ? 'bg-primary text-white' : 'bg-paper border border-black/5 text-muted'}`}
              >
                Paid
              </button>
            </div>

            {/* Price Input (only shows if Paid is selected) */}
            {isPaid && (
              <input 
                type="number" 
                className="form-input" 
                placeholder="Price (NGN)" 
                required 
                value={form.price} 
                onChange={e => setForm({...form, price: Number(e.target.value)})} 
              />
            )}

            <button type="submit" className="btn-primary w-full justify-center">Add Resource</button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">Existing Resources</h2>
          <div className="space-y-4">
            {resources.map((r: any) => (
              <div key={r.id} className="premium-card p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Show Image if available, else show Gradient */}
                  {r.image_url ? (
                    <img src={r.image_url} alt={r.title} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-paper border border-black/5 flex items-center justify-center text-muted">
                      <i className="fas fa-link text-xs"></i>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted capitalize">
                      {r.type} • 
                      <span className={`ml-1 font-semibold ${r.price > 0 ? 'text-primary' : 'text-green-600'}`}>
                        {r.price > 0 ? `₦${r.price.toLocaleString()}` : 'Free'}
                      </span>
                    </p>
                  </div>
                </div>
                <button onClick={async () => { await supabase.from('resources').delete().eq('id', r.id); fetchResources() }} className="text-red-500 text-xs hover:underline">Delete</button>
              </div>
            ))}
            {resources.length === 0 && (
              <div className="premium-card p-12 text-center text-muted">No resources added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}