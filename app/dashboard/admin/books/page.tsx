'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageBooks() {
  const [books, setBooks] = useState([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPaid, setIsPaid] = useState(true)
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ 
    title: '', 
    author: '', 
    description: '', 
    about: '', 
    price: 0, 
    image_url: '', 
    bg: 'linear-gradient(135deg, #1A1A1A, #C1121F)' 
  })

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false })
    setBooks(data || [])
  }

  const handleEdit = (book: any) => {
    setEditingId(book.id)
    setIsPaid(book.price > 0)
    setBookFile(null) // Don't require re-uploading PDF on edit unless they want to change it
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      about: book.about || '',
      price: book.price,
      image_url: book.cover_config?.image_url || '',
      bg: book.cover_config?.bg || 'linear-gradient(135deg, #1A1A1A, #C1121F)'
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setIsPaid(true)
    setBookFile(null)
    setForm({ 
      title: '', author: '', description: '', about: '', price: 0, 
      image_url: '', bg: 'linear-gradient(135deg, #1A1A1A, #C1121F)' 
    })
  }

  const handleAddOrUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Require PDF only if creating a new book
    if (!editingId && !bookFile) {
      alert('Please select a PDF file to upload.')
      return
    }

    setUploading(true)
    const finalPrice = isPaid ? Number(form.price) : 0
    let downloadUrl = form.download_url // Keep existing URL if editing

    // If a new file is selected, upload it
    if (bookFile) {
      const fileName = `${Date.now()}_${bookFile.name}`
      const { error: uploadError } = await supabase.storage.from('books').upload(fileName, bookFile)
      if (uploadError) {
        alert('Error uploading file.')
        setUploading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('books').getPublicUrl(fileName)
      downloadUrl = urlData.publicUrl
    }

    const bookData = {
      title: form.title,
      author: form.author,
      description: form.description,
      about: form.about,
      price: finalPrice,
      download_url: downloadUrl,
      cover_config: {
        image_url: form.image_url || null,
        bg: form.bg,
        label: 'FOC PRESS',
        sub: 'New Release'
      }
    }

    if (editingId) {
      // Update existing book
      await supabase.from('books').update(bookData).eq('id', editingId)
    } else {
      // Insert new book
      await supabase.from('books').insert(bookData)
    }
    
    resetForm()
    setUploading(false)
    fetchBooks()
  }

  const deleteBook = async (id: string) => {
    await supabase.from('books').delete().eq('id', id)
    fetchBooks()
  }

  const copyShareLink = (bookId: string) => {
    const url = `${window.location.origin}/books/${bookId}`
    navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!\n\n' + url)
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage Books</h1>
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Add/Edit Book Form */}
        <div className="premium-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Book' : 'Add New Book'}</h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-muted hover:text-primary">Cancel Edit</button>
            )}
          </div>
          <form onSubmit={handleAddOrUpdateBook} className="space-y-4">
            <input className="form-input" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <input className="form-input" placeholder="Author" required value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
            <textarea className="form-input" rows={2} placeholder="Short Description (shown on card)" required value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
            <textarea className="form-input" rows={4} placeholder="About Book (Detailed info for the Book Page)" value={form.about} onChange={e => setForm({...form, about: e.target.value})}></textarea>
            
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => setIsPaid(false)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${!isPaid ? 'bg-green-500 text-white' : 'bg-paper border border-black/5 text-muted'}`}>Free</button>
              <button type="button" onClick={() => setIsPaid(true)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${isPaid ? 'bg-primary text-white' : 'bg-paper border border-black/5 text-muted'}`}>Paid</button>
            </div>

            {isPaid && (
              <input type="number" className="form-input" placeholder="Price (NGN)" required value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Book PDF File {editingId && '(Leave empty to keep current)'}</label>
              <input type="file" accept="application/pdf" onChange={e => setBookFile(e.target.files?.[0] || null)} className="form-input !p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
            </div>
            
            <div className="pt-4 border-t border-black/5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-ink/80">Book Cover Image (Optional)</h3>
                <input className="form-input" placeholder="Paste Cloudinary Image URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-ink/80">Cover Color (Used if no image)</h3>
                <select className="form-input" value={form.bg} onChange={e => setForm({...form, bg: e.target.value})}>
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
              {uploading ? 'Saving...' : (editingId ? 'Update Book' : 'Add Book')}
            </button>
          </form>
        </div>

        {/* Book List */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Existing Books</h2>
          <div className="space-y-4">
            {books.map((b: any) => (
              <div key={b.id} className="premium-card p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {b.cover_config?.image_url ? (
                      <img src={b.cover_config.image_url} alt={b.title} className="w-8 h-10 rounded shadow-sm object-cover" />
                    ) : (
                      <div className="w-8 h-10 rounded shadow-sm" style={{ background: b.cover_config?.bg || 'linear-gradient(135deg, #1A1A1A, #C1121F)' }}></div>
                    )}
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-muted">
                        {b.author} • 
                        <span className={`ml-1 font-semibold ${b.price > 0 ? 'text-primary' : 'text-green-600'}`}>
                          {b.price > 0 ? `₦${b.price.toLocaleString()}` : 'Free'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => handleEdit(b)} className="flex-1 py-2 rounded-lg bg-paper border border-black/5 hover:bg-black/5 transition text-ink font-medium">
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button onClick={() => copyShareLink(b.id)} className="flex-1 py-2 rounded-lg bg-paper border border-black/5 hover:bg-black/5 transition text-ink font-medium">
                    <i className="fas fa-share-alt mr-1"></i> Share Link
                  </button>
                  <button onClick={() => deleteBook(b.id)} className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium">
                    <i className="fas fa-trash mr-1"></i> Delete
                  </button>
                </div>
              </div>
            ))}
            {books.length === 0 && (
              <div className="premium-card p-12 text-center text-muted">No books added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}