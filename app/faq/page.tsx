'use client'
import { useState } from 'react'

const faqs = [
  { q: 'What exactly is FindOneCampus?', a: 'FindOneCampus is a platform built on the belief that the world is one giant campus. We connect people searching for knowledge, professionals, books, courses, opportunities, and growth with the people and resources that offer them.' },
  { q: 'How do I find a professional?', a: 'Browse the Providers section, use the search bar, or filter by category, skills, country, or location. Each provider has a profile with a WhatsApp button to contact them directly.' },
  { q: 'How do I buy a book or course?', a: 'Visit the Bookstore or Courses page, choose your item, and click "Buy Now" or "Enroll". You\'ll be taken through a secure Paystack checkout. After payment, you\'ll receive instant access or a download link.' },
  { q: 'How do I become a provider?', a: 'Click "Become a Provider" and fill out the registration form. Your application will be reviewed. Once approved, your profile goes live and you\'re discoverable by thousands of searchers.' },
  { q: 'What is the difference between Pro and Verified?', a: 'Pro Membership is a paid subscription that gives you premium features like homepage featuring and a gold badge. Verification is a status earned through a manual background review by our team, granting a blue checkmark to prove your identity and legitimacy. Payment for verification is for the review process, not the badge itself.' },
  { q: 'Where do you post jobs and opportunities?', a: 'We don\'t post them on the website. Instead, we share them daily in our WhatsApp Community. Join the community to receive jobs, scholarships, fellowships, grants, and internships straight to your phone.' },
  { q: 'Is FindOneCampus free?', a: 'Browsing providers, resources, and the community is free. Books and courses have individual prices. Becoming a provider is free, though Pro and Verification features are paid.' },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        Questions & answers
      </div>
      <h1 className="serif mb-12" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        Frequently <span className="serif-italic gradient-text">asked.</span>
      </h1>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="premium-card overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)} 
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <span className="font-semibold text-lg pr-4">{faq.q}</span>
              <div className="w-8 h-8 rounded-full bg-paper flex items-center justify-center flex-shrink-0">
                <i className={`fas fa-plus text-sm transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}></i>
              </div>
            </button>
            <div 
              className="px-6 overflow-hidden transition-all duration-500 ease-in-out"
              style={{ maxHeight: openIndex === i ? '200px' : '0px', opacity: openIndex === i ? 1 : 0 }}
            >
              <p className="text-muted leading-relaxed pb-6">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}