'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageProBooks() {
  const [books, setBooks] = useState<any[]>([])
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    image_url: '', 
    bg: 'linear-gradient(135deg, #1A1A1A, #C1121F)' 
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    const { data } = await supabase.from('pro_books').select('*').order('created_at', { ascending: false })
    setBooks(data || [])
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a PDF file to upload.')
      return
    }
    setUploading(true)

    // 1. Upload PDF file to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('pro-books')
      .upload(fileName, file)

    if (uploadError) {
      alert('Error uploading file. Make sure the "pro-books" bucket exists in Supabase Storage.')
      setUploading(false)
      return
    }

    // 2. Get the Public URL
    const { data: urlData } = supabase.storage.from('pro-books').getPublicUrl(fileName)

    // 3. Save book record to Database
    await supabase.from('pro_books').insert({
      title: form.title,
      description: form.description,
      file_url: urlData.publicUrl,
      cover_config: {
        image_url: form.image_url || null,
        bg: form.bg
      }
    })

    // Reset form
    setForm({ 
      title: '', 
      description: '', 
      image_url: '', 
      bg: 'linear-gradient(135deg, #1A1A1A, #C1121F)' 
    })
    setFile(null)
    setUploading(false)
    fetchBooks()
  }

  const deleteBook = async (id: string) => {
    await supabase.from('pro_books').delete().eq('id', id)
    fetchBooks()
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage Pro Books</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="premium-card p-8">
          <h2 className="text-xl font-semibold mb-6">Upload New Book</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <input 
              className="form-input" 
              placeholder="Book Title" 
              required 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
            />
            <textarea 
              className="form-input" 
              rows={3} 
              placeholder="Short Description" 
              required
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})}
            ></textarea>
            
            <div>
              <label className="text-sm font-medium mb-2 block">PDF File</label>
              <input 
                type="file" 
                accept="application/pdf" 
                required 
                onChange={e => setFile(e.target.files?.[0] || null)} 
                className="form-input !p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </div>

            <div className="pt-4 border-t border-black/5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-ink/80">Book Cover Image (Optional)</h3>
                <input 
                  className="form-input" 
                  placeholder="Paste Cloudinary Image URL (overrides color below)" 
                  value={form.image_url} 
                  onChange={e => setForm({...form, image_url: e.target.value})} 
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-ink/80">Cover Color (Used if no image)</h3>
                <select 
                  className="form-input" 
                  value={form.bg} 
                  onChange={e => setForm({...form, bg: e.target.value})}
                >
                  <option value="linear-gradient(135deg, #1A1A1A, #C1121F)">Charcoal & Red (Default)</option>
                  <option value="linear-gradient(135deg, #C1121F, #6b0a12)">Deep Red</option>
                  <option value="linear-gradient(135deg, #D4A017, #8a6a0e)">Harvest Gold</option>
                  <option value="linear-gradient(135deg, #1A1A1A, #4a4a4a)">Dark Charcoal</option>
                  <option value="linear-gradient(135deg, #2d2d2d, #D4A017)">Charcoal & Gold</option>
                  <option value="linear-gradient(135deg, #C1121F, #D4A017)">Red & Gold</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={uploading} className="btn-primary w-full justify-center disabled:opacity-50">
              {uploading ? 'Uploading...' : 'Add to Pro Library'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">Existing Pro Books</h2>
          <div className="space-y-4">
            {books.map((b: any) => (
              <div key={b.id} className="premium-card p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Show Image if available, else show Gradient */}
                  {b.cover_config?.image_url ? (
                    <img src={b.cover_config.image_url} alt={b.title} className="w-10 h-12 rounded shadow-sm object-cover" />
                  ) : (
                    <div className="w-10 h-12 rounded shadow-sm flex items-center justify-center text-white" style={{ background: b.cover_config?.bg || 'linear-gradient(135deg, #1A1A1A, #C1121F)' }}>
                      <i className="fas fa-book-bookmark text-sm"></i>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{b.title}</p>
                    <a href={b.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View PDF</a>
                  </div>
                </div>
                <button onClick={() => deleteBook(b.id)} className="text-red-500 text-xs hover:underline">Delete</button>
              </div>
            ))}
            {books.length === 0 && (
              <div className="premium-card p-12 text-center text-muted">No pro books uploaded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}