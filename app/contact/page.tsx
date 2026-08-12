'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const { error } = await supabase.from('contact_messages').insert({
      full_name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    })

    if (!error) {
      setSubmitted(true)
    } else {
      alert('Error sending message. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-32">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
        <span className="w-6 h-px bg-primary"></span>
        Get in touch
      </div>
      <h1 className="serif mb-6" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        Say <span className="serif-italic gradient-text">hello.</span>
      </h1>
      <p className="text-lg text-muted mb-12 max-w-xl">Questions, partnerships, feedback, or just a kind word — we'd love to hear from you.</p>

      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          {submitted ? (
            <div className="premium-card p-12 text-center">
              <i className="fas fa-check-circle text-4xl text-primary mb-4"></i>
              <h3 className="serif text-3xl mb-2">Message received.</h3>
              <p className="text-muted">We will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full name</label>
                  <input name="name" type="text" required className="form-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <input name="email" type="email" required className="form-input" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <input name="subject" type="text" required className="form-input" placeholder="What's this about?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <textarea name="message" required rows={6} className="form-input" placeholder="Tell us everything..."></textarea>
              </div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Sending...' : <><span>Send message</span><i className="fas fa-paper-plane text-xs"></i></>}
              </button>
            </form>
          )}
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-paper">
            <i className="fas fa-envelope text-primary mb-3"></i>
            <div className="font-semibold mb-1">Email us</div>
            <a href="mailto:info5onecampus@gmail.com" className="text-sm text-muted hover:text-primary transition">info5onecampus@gmail.com</a>
          </div>
          <div className="p-6 rounded-2xl bg-paper">
            <i className="fab fa-whatsapp text-green-600 mb-3"></i>
            <div className="font-semibold mb-1">WhatsApp Channel</div>
            <a href="https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-primary transition">Join the channel</a>
          </div>
          <div className="p-6 rounded-2xl bg-paper">
            <i className="fas fa-phone text-accent mb-3"></i>
            <div className="font-semibold mb-1">Call/WhatsApp</div>
            <a href="https://wa.me/2348149193063" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-primary transition">+234 814 919 3063</a>
          </div>
        </div>
      </div>
    </div>
  )
}