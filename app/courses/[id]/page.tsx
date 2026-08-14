'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function AboutCoursePage() {
  const params = useParams()
  const courseId = params?.id as string
  
  const [course, setCourse] = useState<any>(null)
  const [reader, setReader] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => { const r = localStorage.getItem('foc_reader'); if (r) try { setReader(JSON.parse(r)) } catch (e) {} }, [])
  useEffect(() => { if (!courseId) return; const f = async () => { const { data } = await supabase.from('courses').select('*').eq('id', courseId).single(); setCourse(data); setLoading(false) }; f() }, [courseId])
  useEffect(() => { if (!reader || !course) return; const c = async () => { const { data } = await supabase.from('course_enrollments').select('id').eq('reader_email', reader.email.toLowerCase()).eq('course_id', course.id); if (data && data.length > 0) setIsEnrolled(true) }; c() }, [reader, course])

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 4000) }

  const handleBuy = async () => {
    if (!reader) { showToast('Please log in first.'); window.location.href = `/login?redirect=/courses/${course.id}`; return }
    const flwKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY
    if (!flwKey || !(window as any).FlutterwaveCheckout) {
      window.dispatchEvent(new CustomEvent('show-fallback-payment', { detail: { amount: course.price.toLocaleString(), description: `${course.title} (Course)` }}))
      return
    }
    setPaying(true)
    const reference = generateReference('COURSE')
    const buyerEmail = reader.email.toLowerCase()
    await supabase.from('payments').insert({ amount: course.price, status: 'pending', reference, item_type: 'course', item_id: course.id, email: buyerEmail })
    try {
      (window as any).FlutterwaveCheckout({
        public_key: flwKey,
        tx_ref: reference,
        amount: course.price,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: { email: buyerEmail },
        callback: function(data: any) {
          if (data.status === 'successful' || data.status === 'completed') {
            const vp = async () => {
              await supabase.from('payments').update({ status: 'success' }).eq('reference', reference)
              await supabase.from('course_enrollments').insert({ reader_email: buyerEmail, course_id: course.id, reference: reference })
              setIsEnrolled(true); showToast('Enrollment successful!')
            }; vp()
          }
        },
        onclose: function() { setPaying(false) }
      })
    } catch (error) { showToast('Error initiating payment.'); setPaying(false) }
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&showinfo=0`
    return url
  }

  if (loading) return <div className="py-32 text-center text-muted">Loading course...</div>
  if (!course) return <div className="py-32 text-center text-muted">Course not found.</div>

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out "${course.title}" by ${course.instructor} on FindOneCampus!`

  return (
    <div className="relative overflow-hidden py-32 px-6 lg:px-10">
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[slideUp_0.3s_ease]">
          <div className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white text-sm font-medium bg-green-600"><i className="fas fa-check-circle text-lg"></i><span>{toast}</span></div>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <Link href="/courses" className="mb-12 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition"><i className="fas fa-arrow-left text-xs"></i> Back to Courses</Link>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="premium-card p-8 sticky top-32">
              <div className="section-label mb-4">Course Details</div>
              <h1 className="serif text-3xl mb-3" style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>{course.title}</h1>
              <p className="text-primary font-medium mb-6">by {course.instructor}</p>
              <div className="space-y-3 text-sm border-y border-black/5 py-6 mb-6">
                <div className="flex justify-between"><span className="text-muted">Difficulty:</span> <span className="font-medium">{course.difficulty}</span></div>
                <div className="flex justify-between"><span className="text-muted">Duration:</span> <span className="font-medium">{course.duration}</span></div>
                <div className="flex justify-between"><span className="text-muted">Lessons:</span> <span className="font-medium">{course.lessons}</span></div>
              </div>
              <div className="flex items-center gap-4 mb-8">
                {course.price === 0 ? (<span className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-bold text-sm">Free</span>) : (<span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">₦{course.price.toLocaleString()}</span>)}
              </div>
              {isEnrolled || course.price === 0 ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm font-medium text-center"><i className="fas fa-check-circle mr-2"></i> You are enrolled</div>
              ) : (
                <button onClick={handleBuy} disabled={paying} className="btn-primary w-full justify-center !py-4 text-sm disabled:opacity-50">{paying ? 'Processing...' : <><i className="fas fa-cart-shopping"></i> Enroll Now</>}</button>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            {(isEnrolled || course.price === 0) && course.video_url ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-10 bg-ink"><iframe className="w-full h-full" src={getEmbedUrl(course.video_url)} title={course.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
            ) : (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-10 bg-neutral-800 flex flex-col items-center justify-center text-white p-8 text-center"><i className="fas fa-lock text-4xl mb-4 text-primary"></i><h3 className="serif text-2xl mb-2">Premium Content</h3><p className="text-white/70 text-sm max-w-md">Enroll in this course to unlock the video lessons and full curriculum.</p></div>
            )}
            <p className="text-lg text-muted leading-relaxed mb-8 font-light">{course.description}</p>
            {course.about && (<div className="premium-card p-8 mb-10"><h2 className="serif text-2xl mb-4">About this Course</h2><div className="prose prose-lg max-w-none text-ink/80 leading-relaxed space-y-4">{course.about.split('\n').map((p: string, i: number) => <p key={i}>{p}</p>)}</div></div>)}
            <div className="border-t border-black/5 pt-8">
              <h3 className="text-sm font-semibold text-ink/80 mb-4">Share this course</h3>
              <div className="flex items-center gap-3">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-twitter"></i></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition"><i className="fab fa-whatsapp"></i></a>
                <button onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('Link copied!') }} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fas fa-link"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </div>
  )
}