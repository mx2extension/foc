'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageDownloads() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase.from('books').select('id, title, download_url')
      setBooks(data || [])
    }
    fetchBooks()
  }, [])

  const updateUrl = async (id: string, url: string) => {
    await supabase.from('books').update({ download_url: url }).eq('id', id)
    alert('Download URL updated.')
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage Downloads</h1>
      <p className="text-muted mb-12">Update the secure PDF download links for purchased books.</p>
      
      <div className="space-y-4">
        {books.map((b: any) => (
          <div key={b.id} className="premium-card p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-1/4">
              <h3 className="font-medium">{b.title}</h3>
            </div>
            <div className="flex-1 flex gap-2">
              <input 
                defaultValue={b.download_url} 
                className="form-input flex-1" 
                placeholder="https://supabase-storage-url.com/book.pdf"
                onChange={(e) => b.download_url = e.target.value}
              />
              <button 
                onClick={() => updateUrl(b.id, b.download_url)}
                className="btn-secondary !py-2.5 !px-5 text-sm whitespace-nowrap"
              >
                Update Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}