'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageNews() {
  const [articles, setArticles] = useState([])
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', image_url: '', author: 'FindOneCampus' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchArticles() }, [])

  const fetchArticles = async () => {
    const { data } = await supabase.from('news_updates').select('*').order('created_at', { ascending: false })
    setArticles(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (editingId) {
      // Update existing article
      await supabase
        .from('news_updates')
        .update(form)
        .eq('id', editingId)
    } else {
      // Insert new article
      await supabase
        .from('news_updates')
        .insert(form)
    }

    resetForm()
    fetchArticles()
    setLoading(false)
  }

  const handleEditClick = (article: any) => {
    setEditingId(article.id)
    setForm({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image_url: article.image_url || '',
      author: article.author || 'FindOneCampus'
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({ title: '', excerpt: '', content: '', image_url: '', author: 'FindOneCampus' })
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage News</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* Form Section */}
        <div className="premium-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit News Article' : 'Add News Article'}
            </h2>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="text-xs text-muted hover:text-primary underline"
              >
                Cancel Edit
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="form-input" 
              placeholder="Title" 
              required 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
            />
            <input 
              className="form-input" 
              placeholder="Author" 
              required 
              value={form.author} 
              onChange={e => setForm({...form, author: e.target.value})} 
            />
            <input 
              className="form-input" 
              placeholder="Image URL (Optional)" 
              value={form.image_url} 
              onChange={e => setForm({...form, image_url: e.target.value})} 
            />
            <textarea 
              className="form-input" 
              rows={2} 
              placeholder="Short Excerpt" 
              required 
              value={form.excerpt} 
              onChange={e => setForm({...form, excerpt: e.target.value})}
            ></textarea>
            <textarea 
              className="form-input" 
              rows={6} 
              placeholder="Full Article Content (Separate paragraphs with double enter)" 
              required 
              value={form.content} 
              onChange={e => setForm({...form, content: e.target.value})}
            ></textarea>
            
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="btn-secondary px-6"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Articles List */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Existing Articles</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {articles.length === 0 ? (
              <p className="text-sm text-muted italic">No articles published yet.</p>
            ) : (
              articles.map((a: any) => (
                <div key={a.id} className="premium-card p-4 flex justify-between items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted">{new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => handleEditClick(a)} 
                      className="text-primary text-xs hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={async () => { 
                        if (confirm('Are you sure you want to delete this article?')) {
                          await supabase.from('news_updates').delete().eq('id', a.id)
                          if (editingId === a.id) resetForm()
                          fetchArticles() 
                        }
                      }} 
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}