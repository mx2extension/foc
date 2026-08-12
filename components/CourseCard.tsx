'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateReference } from '@/lib/paystack'

export default function CourseCard({ course }: { course: any }) {
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    if (course.price === 0) {
      // Free course - redirect directly
      window.location.href = `/courses/${course.id}/learn`
      return
    }

    setLoading(true)
    const reference = generateReference('COURSE')
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('payments').insert({
      amount: course.price,
      status: 'pending',
      reference,
      item_type: 'course',
      item_id: course.id
    })

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email || 'guest@findonecampus.com',
      amount: course.price * 100,
      ref: reference,
      metadata: { item_type: 'course', item_id: course.id },
      callback: function(response: any) {
        window.location.href = `/api/paystack/verify?reference=${response.reference}`
      },
      onClose: function() {
        setLoading(false)
      }
    })
    handler.openIframe()
  }

  return (
    <div className="premium-card p-8">
      <div className="flex items-start justify-between mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
          course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>{course.difficulty}</span>
        <div className="text-right">
          <div className="text-xs text-muted">Price</div>
          <div className="serif text-3xl">{course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}</div>
        </div>
      </div>
      
      <h3 className="serif text-3xl mb-3 leading-tight">{course.title}</h3>
      <p className="text-muted leading-relaxed mb-6">{course.description}</p>
      
      <div className="grid grid-cols-3 gap-4 py-5 border-y border-black/5 mb-6">
        <div>
          <div className="text-xs text-muted mb-1">Instructor</div>
          <div className="text-sm font-medium">{course.instructor}</div>
        </div>
        <div>
          <div className="text-xs text-muted mb-1">Duration</div>
          <div className="text-sm font-medium">{course.duration}</div>
        </div>
        <div>
          <div className="text-xs text-muted mb-1">Lessons</div>
          <div className="text-sm font-medium">{course.lessons}</div>
        </div>
      </div>
      
      <button onClick={handleEnroll} disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Processing...' : 'Enroll Now'}
        {!loading && <i className="fas fa-arrow-right text-xs"></i>}
      </button>
    </div>
  )
}