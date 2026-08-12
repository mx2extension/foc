'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageCourses() {
  const [courses, setCourses] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ 
    title: '', instructor: '', description: '', about: '', video_url: '', 
    duration: '', difficulty: 'Beginner', price: 0, lessons: 0 
  })

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
    setCourses(data || [])
  }

  const handleEdit = (course: any) => {
    setEditingId(course.id)
    setForm({
      title: course.title, instructor: course.instructor, description: course.description,
      about: course.about || '', video_url: course.video_url || '', duration: course.duration,
      difficulty: course.difficulty, price: course.price, lessons: course.lessons
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({ title: '', instructor: '', description: '', about: '', video_url: '', duration: '', difficulty: 'Beginner', price: 0, lessons: 0 })
  }

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const courseData = {
      ...form,
      price: Number(form.price),
      lessons: Number(form.lessons)
    }

    if (editingId) {
      await supabase.from('courses').update(courseData).eq('id', editingId)
    } else {
      await supabase.from('courses').insert(courseData)
    }
    
    resetForm()
    fetchCourses()
  }

  const copyShareLink = (courseId: string) => {
    const url = `${window.location.origin}/courses/${courseId}`
    navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!\n\n' + url)
  }

  const deleteCourse = async (id: string) => {
    await supabase.from('courses').delete().eq('id', id)
    fetchCourses()
  }

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Manage Courses</h1>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="premium-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-muted hover:text-primary">Cancel Edit</button>
            )}
          </div>
          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <input className="form-input" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <input className="form-input" placeholder="Instructor" required value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})} />
            <textarea className="form-input" rows={2} placeholder="Short Description (shown on card)" required value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
            <textarea className="form-input" rows={4} placeholder="About Course (Detailed info for Course Page)" value={form.about} onChange={e => setForm({...form, about: e.target.value})}></textarea>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Video Embed Link (YouTube/Vimeo)</label>
              <input className="form-input" placeholder="https://youtube.com/watch?v=..." value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input className="form-input" placeholder="Duration (e.g., 4 weeks)" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
              <select className="form-input" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <input type="number" className="form-input" placeholder="Price (NGN)" required value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              <input type="number" className="form-input" placeholder="Lessons" required value={form.lessons} onChange={e => setForm({...form, lessons: Number(e.target.value)})} />
            </div>

            <button type="submit" className="btn-primary w-full justify-center">
              {editingId ? 'Update Course' : 'Add Course'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">Existing Courses</h2>
          <div className="space-y-4">
            {courses.map((c: any) => (
              <div key={c.id} className="premium-card p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted">{c.instructor} • {c.price > 0 ? `₦${c.price.toLocaleString()}` : 'Free'}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => handleEdit(c)} className="flex-1 py-2 rounded-lg bg-paper border border-black/5 hover:bg-black/5 transition text-ink font-medium">
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button onClick={() => copyShareLink(c.id)} className="flex-1 py-2 rounded-lg bg-paper border border-black/5 hover:bg-black/5 transition text-ink font-medium">
                    <i className="fas fa-share-alt mr-1"></i> Share Link
                  </button>
                  <button onClick={() => deleteCourse(c.id)} className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium">
                    <i className="fas fa-trash mr-1"></i> Delete
                  </button>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="premium-card p-12 text-center text-muted">No courses added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}