'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'
import Link from 'next/link'

export default function CoursesPage() {
  const [reader, setReader] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([]) // Fixed never[] error
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all')

  useEffect(() => {
    const storedReader = localStorage.getItem('foc_reader')
    if (storedReader) {
      try { const p = JSON.parse(storedReader); if (p && p.email) setReader(p); else { localStorage.removeItem('foc_reader'); setLoading(false) } } catch (e) { localStorage.removeItem('foc_reader'); setLoading(false) }
    } else { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!reader) return
    const fetchData = async () => {
      setLoading(true)
      const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      setCourses(coursesData || [])
      const { data: enrollments } = await supabase.from('course_enrollments').select('course_id').eq('reader_email', reader.email.toLowerCase())
      setEnrolledCourseIds(enrollments?.map((e: any) => e.course_id) || [])
      setLoading(false)
    }
    fetchData()
  }, [reader])

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 4000) }
  const handleLogout = () => { localStorage.removeItem('foc_reader'); setReader(null); setEnrolledCourseIds([]); setCourses([]); setActiveTab('all') }

  const handleBuyCourse = async (course: any) => {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    if (!paystackKey || !(window as any).PaystackPop) {
      window.dispatchEvent(new CustomEvent('show-fallback-payment', { detail: { amount: course.price.toLocaleString(), description: `${course.title} (Course)` }}))
      return
    }
    const reference = generateReference('COURSE')
    const buyerEmail = reader?.email.toLowerCase()
    await supabase.from('payments').insert({ amount: course.price, status: 'pending', reference, item_type: 'course', item_id: course.id, email: buyerEmail })
    try {
      const handler = (window as any).PaystackPop.setup({
        key: paystackKey, email: buyerEmail, amount: course.price * 100, ref: reference,
        metadata: { item_type: 'course', item_id: course.id },
        callback: function(response: any) {
          const vp = async () => {
            await supabase.from('payments').update({ status: 'success' }).eq('reference', reference)
            await supabase.from('course_enrollments').insert({ reader_email: buyerEmail, course_id: course.id, reference: reference })
            setEnrolledCourseIds(prev => [...prev, course.id])
            showToast('Enrollment successful! You can now start the course.')
          }; vp()
        },
        onClose: function() {}
      })
      handler.openIframe()
    } catch (error) { showToast('Error initiating payment.') }
  }

  if (!reader) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
          <span className="w-6 h-px bg-primary"></span>The Campus<span className="w-6 h-px bg-primary"></span>
        </div>
        <h1 className="serif text-4xl md:text-5xl mb-4">Learning <span className="gradient-text">Portal</span></h1>
        <p className="text-muted mb-12">Please log in to browse, enroll, and start learning.</p>
        <Link href="/login?redirect=/courses" className="btn-primary !py-4 !px-8">Login / Register</Link>
      </div>
    )
  }

  const displayedCourses = activeTab === 'mine' ? courses.filter((c: any) => enrolledCourseIds.includes(c.id) || c.price === 0) : courses

  return (
    <div className="relative overflow-hidden">
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[slideUp_0.3s_ease]">
          <div className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white text-sm font-medium bg-green-600"><i className="fas fa-check-circle text-lg"></i><span>{toast}</span></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="section-label mb-6">Learn from doers</div>
            <h1 className="serif" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>Your <span className="serif-italic gradient-text">Courses.</span></h1>
            <p className="text-muted mt-4 text-sm">Welcome back, <span className="font-medium text-ink">{reader.name}</span></p>
          </div>
          <button onClick={handleLogout} className="btn-secondary !py-2.5 !px-5 text-sm">Log Out</button>
        </div>
        <div className="flex gap-2 mb-10 border-b border-black/5 pb-4">
          <button onClick={() => setActiveTab('all')} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${activeTab === 'all' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>All Courses</button>
          <button onClick={() => setActiveTab('mine')} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${activeTab === 'mine' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>My Courses ({enrolledCourseIds.length})</button>
        </div>
        {loading ? (
          <div className="text-center py-20 text-muted">Loading courses...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourses.map((course: any) => {
              const isEnrolled = enrolledCourseIds.includes(course.id)
              const isFree = course.price === 0
              return (
                <div key={course.id} className="premium-card p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{course.difficulty}</span>
                    <div className="text-right"><div className="text-xs text-muted">Price</div><div className="serif text-2xl">{course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}</div></div>
                  </div>
                  <h3 className="serif text-3xl mb-3 leading-tight">{course.title}</h3>
                  <p className="text-muted leading-relaxed mb-6 flex-1">{course.description}</p>
                  <div className="grid grid-cols-3 gap-4 py-5 border-y border-black/5 mb-6 text-center">
                    <div><div className="text-xs text-muted mb-1">Instructor</div><div className="text-sm font-medium truncate">{course.instructor}</div></div>
                    <div><div className="text-xs text-muted mb-1">Duration</div><div className="text-sm font-medium">{course.duration}</div></div>
                    <div><div className="text-xs text-muted mb-1">Lessons</div><div className="text-sm font-medium">{course.lessons}</div></div>
                  </div>
                  <div className="mt-auto space-y-2">
                    {isEnrolled || isFree ? (
                      <Link href={`/courses/${course.id}`} className="btn-primary w-full justify-center !py-3 text-sm"><i className="fas fa-play"></i> Start Course</Link>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleBuyCourse(course)} className="flex-1 btn-primary justify-center !py-3 text-sm"><i className="fas fa-cart-shopping text-xs"></i> Enroll</button>
                        <Link href={`/courses/${course.id}`} className="flex-1 btn-secondary justify-center !py-3 text-sm !bg-paper"><i className="fas fa-info-circle text-xs"></i> About</Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            {displayedCourses.length === 0 && (<div className="col-span-full text-center py-20 text-muted">No courses available.</div>)}
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </div>
  )
}