'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import * as countryCodes from 'country-codes-list'

const CATEGORIES = [
  'Technology & IT', 'Design & Creatives', 'Business & Finance', 'Media & Entertainment',
  'Education & Training', 'Health & Wellness', 'Beauty & Fashion', 'Food & Catering',
  'Events & Planning', 'Home & Repair Services', 'Construction & Engineering', 'Real Estate',
  'Logistics & Transport', 'Agriculture & Environment', 'Legal & Admin Services'
];

const ALL_COUNTRY_CODES = countryCodes.customList('countryCallingCode', '{countryNameEn} (+{countryCallingCode})')
const uniqueCodesMap = new Map();
Object.entries(ALL_COUNTRY_CODES).forEach(([iso, label]) => {
  const match = label.match(/\(\+(\d+)\)/);
  if (match) {
    const dialCode = `+${match[1]}`;
    if (!uniqueCodesMap.has(dialCode)) {
      uniqueCodesMap.set(dialCode, { code: dialCode, name: label.split(' (')[0] });
    }
  }
});
const GLOBAL_CODES = Array.from(uniqueCodesMap.values()).sort((a, b) => a.name.localeCompare(b.name));

const CODE_TO_COUNTRY_MAP: Record<string, string> = {};
GLOBAL_CODES.forEach(c => {
  CODE_TO_COUNTRY_MAP[c.code] = c.name;
});

const MAX_BIO_LENGTH = 140; // Strict tweet-length short bio

export default function BecomeProvider() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [form, setForm] = useState({
    full_name: '', email: '', category: '', profession: '', bio: '', skills: '', 
    country_code: '+234', whatsapp_local: '', country: 'Nigeria', city: '', education_level: '', school: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'country_code') {
      const matchedCountry = CODE_TO_COUNTRY_MAP[value] || '';
      setForm(prev => ({
        ...prev,
        country_code: value,
        country: matchedCountry
      }));
    } else if (name === 'bio') {
      if (value.length <= MAX_BIO_LENGTH) {
        setForm(prev => ({ ...prev, [name]: value }))
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let localNumber = form.whatsapp_local.trim().replace(/[\s\-\+]/g, '')
    if (localNumber.startsWith('0')) {
      localNumber = localNumber.slice(1)
    }

    const cleanCountryCode = form.country_code.replace('+', '')
    const fullWhatsApp = cleanCountryCode + localNumber

    const trimmedForm = {
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      category: form.category.trim(),
      profession: form.profession.trim(),
      bio: form.bio.trim(),
      skills: form.skills.trim(),
      whatsapp: fullWhatsApp,
      country: form.country.trim(),
      city: form.city.trim(),
    }

    if (!trimmedForm.full_name || !trimmedForm.email || !trimmedForm.category || !trimmedForm.profession || !trimmedForm.bio || !trimmedForm.skills || !localNumber || !trimmedForm.country || !trimmedForm.city) {
      alert('Please fill out all required fields properly.')
      return
    }

    if (trimmedForm.bio.length > MAX_BIO_LENGTH) {
      alert(`Short bio cannot exceed ${MAX_BIO_LENGTH} characters.`)
      return
    }

    setLoading(true)

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('providers')
        .select('email, whatsapp')
        .or(`email.eq.${trimmedForm.email},whatsapp.eq.${trimmedForm.whatsapp}`)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingUser) {
        alert('An account with this email or WhatsApp number already exists. Please log in or use different details.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from('providers').insert({
        full_name: trimmedForm.full_name,
        email: trimmedForm.email,
        category: trimmedForm.category,
        profession: trimmedForm.profession,
        bio: trimmedForm.bio,
        skills: trimmedForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        whatsapp: trimmedForm.whatsapp,
        country: trimmedForm.country,
        city: trimmedForm.city,
        education_level: form.education_level.trim(),
        school: form.school.trim(),
        social_links: {},
        is_approved: true,
        verification_status: 'not_verified'
      }).select().single()

      if (error) throw error

      if (data) {
        localStorage.setItem('foc_provider', JSON.stringify(data))
        router.push('/dashboard/provider')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Error submitting form. Please try again.')
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
            <input name="full_name" required value={form.full_name} onChange={handleChange} className="form-input" placeholder="Your full name" autoComplete="name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="you@email.com" autoComplete="email" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Category *</label>
            <select name="category" required value={form.category} onChange={handleChange} className="form-input">
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Specific Profession *</label>
            <input name="profession" required value={form.profession} onChange={handleChange} className="form-input" placeholder="e.g. Brand Strategist" autoComplete="organization-title" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Short Bio * <span className="text-xs text-muted">(Max 140 characters)</span></label>
            <span className={`text-xs ${form.bio.length >= MAX_BIO_LENGTH ? 'text-red-500 font-bold' : 'text-muted'}`}>
              {form.bio.length}/{MAX_BIO_LENGTH}
            </span>
          </div>
          <textarea 
            name="bio" 
            required 
            rows={3} 
            maxLength={MAX_BIO_LENGTH}
            value={form.bio} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="Tell us about yourself, your work, and what makes you different..."
          ></textarea>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Skills (comma separated) *</label>
          <input name="skills" required value={form.skills} onChange={handleChange} className="form-input" placeholder="branding, strategy, copywriting, research" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="text-sm font-medium block">WhatsApp Number *</label>
            <select 
              name="country_code" 
              value={form.country_code} 
              onChange={handleChange} 
              className="form-input w-full text-sm"
            >
              {GLOBAL_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
              ))}
            </select>
            <input 
              name="whatsapp_local" 
              type="tel" 
              required 
              value={form.whatsapp_local} 
              onChange={handleChange} 
              className="form-input w-full" 
              placeholder="e.g. 8012345678 (with or without 0)" 
              autoComplete="tel-national" 
            />
            <p className="text-[11px] text-muted">Leading zero is handled automatically.</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Country *</label>
            <input name="country" required value={form.country} onChange={handleChange} className="form-input" placeholder="Nigeria" autoComplete="country-name" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">City *</label>
            <input name="city" required value={form.city} onChange={handleChange} className="form-input" placeholder="Bauchi" autoComplete="address-level2" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Highest Education Level</label>
            <input name="education_level" value={form.education_level} onChange={handleChange} className="form-input" placeholder="e.g. B.Sc, HND, SSCE" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">School Attended</label>
          <input name="school" value={form.school} onChange={handleChange} className="form-input" placeholder="e.g. Abubakar Tafawa Balewa University" autoComplete="organization" />
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