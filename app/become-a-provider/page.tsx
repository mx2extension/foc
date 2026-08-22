'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'Technology & IT', 'Design & Creatives', 'Business & Finance', 'Media & Entertainment',
  'Education & Training', 'Health & Wellness', 'Beauty & Fashion', 'Food & Catering',
  'Events & Planning', 'Home & Repair Services', 'Construction & Engineering', 'Logistics & Transport',
  'Agriculture & Environment', 'Legal & Admin Services'
];

export default function BecomeProvider() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [form, setForm] = useState({
    full_name: '', email: '', category: '', profession: '', bio: '', skills: '', 
    whatsapp: '', country: '', city: '', education_level: '', school: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setForm({ ...form, [e.target.name]: e.target.value })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data, error } = await supabase.from('providers').insert({
      full_name: form.full_name,
      email: form.email.toLowerCase(),
      category: form.category,
      profession: form.profession,
      bio: form.bio,
      skills: form.skills.split(',').map((s: string) => s.trim()),
      whatsapp: form.whatsapp,
      country: form.country,
      city: form.city,
      education_level: form.education_level,
      school: form.school,
      social_links: {},
      is_approved: true,
      verification_status: 'not_verified'
    }).select().single()

    if (!error && data) {
      localStorage.setItem('foc_provider', JSON.stringify(data))
      router.push('/dashboard/provider')
    } else {
      alert('Error submitting form. Please ensure you haven\'t already registered with this email.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-32">
      <div className="text-center mb-12">
        <h1 className="serif text-4xl md:text-5xl mb-3">Register as a <span className="gradient-text">Provider</span></h1>
        <p className="text-muted">Create your account to join the campus.</p>
      </div>

      <form onSubmit={handleSubmit} className="premium-card p-8 md:p-10 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name *</label>
            <input name="full_name" required onChange={handleChange} className="form-input" placeholder="Your full name" autoComplete="name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email *</label>
            <input name="email" type="email" required onChange={handleChange} className="form-input" placeholder="you@email.com" autoComplete="email" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Category *</label>
            <select name="category" required onChange={handleChange} className="form-input" defaultValue="">
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Specific Profession *</label>
            <input name="profession" required onChange={handleChange} className="form-input" placeholder="e.g. Brand Strategist" autoComplete="organization-title" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Short Bio * <span className="text-xs text-muted">(Max 2-3 sentences)</span></label>
          <textarea name="bio" required rows={3} onChange={handleChange} className="form-input" placeholder="Tell us about yourself, your work, and what makes you different..."></textarea>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Skills (comma separated) *</label>
          <input name="skills" required onChange={handleChange} className="form-input" placeholder="branding, strategy, copywriting, research" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">WhatsApp Number *</label>
            <input name="whatsapp" type="tel" required onChange={handleChange} className="form-input" placeholder="+234 800 000 0000" autoComplete="tel" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Country *</label>
            <input name="country" required onChange={handleChange} className="form-input" placeholder="Nigeria" autoComplete="country-name" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">City *</label>
            <input name="city" required onChange={handleChange} className="form-input" placeholder="Lagos" autoComplete="address-level2" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Highest Education Level</label>
            <input name="education_level" onChange={handleChange} className="form-input" placeholder="e.g. B.Sc, HND, SSCE" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">School Attended</label>
          <input name="school" onChange={handleChange} className="form-input" placeholder="e.g. University of Lagos" autoComplete="organization" />
        </div>

        <div className="bg-paper border border-black/5 rounded-xl p-4 text-sm text-muted">
          <i className="fas fa-lock text-primary mr-2"></i>
          Social links (LinkedIn, Instagram, TikTok, etc.) can be added from your dashboard after upgrading to <span className="font-bold text-accent">Pro</span>.
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4">
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}