'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageShopAds() {
  const [ads, setAds] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', image_url: '', target_url: '', placement: 'shop_top' })

  useEffect(() => { fetchAds() }, [])

  const fetchAds = async () => {
    const { data } = await supabase.from('shop_ads').select('*').order('created_at', { ascending: false })
    setAds(data || [])
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('shop_ads').insert(form)
    setForm({ title: '', image_url: '', target_url: '', placement: 'shop_top' })
    fetchAds()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('shop_ads').update({ is_active: !current }).eq('id', id)
    fetchAds()
  }

  const deleteAd = async (id: string) => {
    if (window.confirm('Delete this ad?')) {
      await supabase.from('shop_ads').delete().eq('id', id)
      fetchAds()
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Shop Advertisements</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="premium-card p-8">
          <h2 className="text-xl font-semibold mb-6">Add New Advert</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <input required type="text" placeholder="Advert Title (Internal Name)" className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <input required type="url" placeholder="Banner Image URL (e.g., 1200x300px)" className="form-input" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
            <input required type="url" placeholder="Target URL (Where clicking goes)" className="form-input" value={form.target_url} onChange={e => setForm({...form, target_url: e.target.value})} />
            <select required className="form-input" value={form.placement} onChange={e => setForm({...form, placement: e.target.value})}>
              <option value="shop_top">Top of Shop Page</option>
              <option value="cart_top">Top of Cart/Checkout Page</option>
            </select>
            <button type="submit" className="btn-primary w-full justify-center">Add Advert</button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">Active Adverts</h2>
          <div className="space-y-4">
            {ads.map((ad: any) => (
              <div key={ad.id} className="premium-card p-4 flex items-center gap-4">
                <img src={ad.image_url} alt={ad.title} className="w-32 h-16 rounded-lg object-cover shadow-sm" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{ad.title}</p>
                  <p className="text-xs text-muted">Placement: {ad.placement.replace('_', ' ')}</p>
                  <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Visit Link</a>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button onClick={() => toggleActive(ad.id, ad.is_active)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${ad.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {ad.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => deleteAd(ad.id)} className="text-red-500 text-xs hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}