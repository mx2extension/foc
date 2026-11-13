'use client'
import { useState, useRef } from 'react'
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

const MAX_BIO_LENGTH = 140;

export default function BecomeProvider() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const [form, setForm] = useState({
    full_name: '', email: '', category: '', profession: '', bio: '', skills: '', 
    country_code: '+234', whatsapp_local: '', country: 'Nigeria', city: '', education_level: '', school: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Clear field-specific error as soon as the user types/selects
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
    if (formError) setFormError('')

    if (name === 'country_code') {
      const matchedCountry = CODE_TO_COUNTRY_MAP[value] || '';
      setForm(prev => ({
        ...prev,
        country_code: value,
        country: matchedCountry
      }));
      if (matchedCountry && errors.country) {
        setErrors(prev => {
          const updated = { ...prev }
          delete updated.country
          return updated
        })
      }
    } else if (name === 'bio') {
      if (value.length <= MAX_BIO_LENGTH) {
        setForm(prev => ({ ...prev, [name]: value }))
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.full_name.trim()) {
      newErrors.full_name = "You haven't entered your full name yet."
    }

    if (!form.email.trim()) {
      newErrors.email = "Please provide your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. name@email.com)."
    }

    if (!form.category.trim()) {
      newErrors.category = "Please select a category that fits your service."
    }

    if (!form.profession.trim()) {
      newErrors.profession = "Please enter your specific profession."
    }

    if (!form.bio.trim()) {
      newErrors.bio = "Don't forget to write a short bio about what you do."
    } else if (form.bio.trim().length > MAX_BIO_LENGTH) {
      newErrors.bio = `Short bio cannot exceed ${MAX_BIO_LENGTH} characters.`
    }

    const cleanLocal = form.whatsapp_local.trim().replace(/[\s\-\+]/g, '')
    if (!cleanLocal) {
      newErrors.whatsapp_local = "Please enter your WhatsApp phone number."
    } else if (!/^\d{7,15}$/.test(cleanLocal)) {
      newErrors.whatsapp_local = "Please enter a valid phone number (digits only)."
    }

    if (!form.country.trim()) {
      newErrors.country = "Please enter your country."
    }

    if (!form.city.trim()) {
      newErrors.city = "Please enter your city so clients know where you're based."
    }

    setErrors(newErrors)

    // Scroll to and focus the first invalid field
    const firstErrorKey = Object.keys(newErrors)[0]
    if (firstErrorKey && formRef.current) {
      const firstInvalidEl = formRef.current.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement | null
      if (firstInvalidEl) {
        firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        firstInvalidEl.focus({ preventScroll: true })
      }
      return false
    }

    return true
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!validateForm()) return

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

    setLoading(true)

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('providers')
        .select('email, whatsapp')
        .or(`email.eq.${trimmedForm.email},whatsapp.eq.${trimmedForm.whatsapp}`)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingUser) {
        if (existingUser.email === trimmedForm.email) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered. Try logging in instead.' }))
        }
        if (existingUser.whatsapp === trimmedForm.whatsapp) {
          setErrors(prev => ({ ...prev, whatsapp_local: 'This WhatsApp number is already registered.' }))
        }
        setFormError('An account with these details already exists.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from('providers').insert({
        full_name: trimmedForm.full_name,
        email: trimmedForm.email,
        category: trimmedForm.category,
        profession: trimmedForm.profession,
        bio: trimmedForm.bio,
        skills: trimmedForm.skills ? trimmedForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
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
        setLoading(false)
        setSuccess(true)

        setTimeout(() => {
          router.push('/dashboard/provider')
        }, 2000)
      }
    } catch (err: any) {
      console.error(err)
      setFormError(err.message || 'Something went wrong while creating your account. Please try again.')
      setLoading(false)
    }
  }

  // Helper to apply red border styling when a field has an error
  const getInputClass = (fieldName: string, extraClasses = '') => {
    const errorStyle = errors[fieldName]
      ? '!border-red-500 focus:!ring-red-500/20 bg-red-50/30'
      : ''
    return `form-input ${errorStyle} ${extraClasses}`.trim()
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <div className="premium-card p-10 space-y-6 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl animate-bounce">
            ✓
          </div>
          <h2 className="serif text-3xl font-bold">Registration Successful!</h2>
          <p className="text-muted text-sm">Your provider account has been created successfully. Taking you to your dashboard...</p>
          <button 
            onClick={() => router.push('/dashboard/provider')} 
            className="btn-primary w-full justify-center !py-3 mt-4"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-32">
      <div className="text-center mb-12">
        <h1 className="serif text-4xl md:text-5xl mb-3">Register as a <span className="gradient-text">Provider</span></h1>
        <p className="text-muted">Create your account to join the campus.</p>
      </div>

      {/* noValidate disables ugly default browser tooltips so our custom inline messages always run */}
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="premium-card p-8 md:p-10 space-y-6">
        
        {formError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
            <span className="font-bold">!</span>
            <span>{formError}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name *</label>
            <input 
              name="full_name" 
              value={form.full_name} 
              onChange={handleChange} 
              className={getInputClass('full_name')} 
              placeholder="Your full name" 
              autoComplete="name" 
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1.5">{errors.full_name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email *</label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange} 
              className={getInputClass('email')} 
              placeholder="you@email.com" 
              autoComplete="email" 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Category *</label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className={getInputClass('category')}
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Specific Profession *</label>
            <input 
              name="profession" 
              value={form.profession} 
              onChange={handleChange} 
              className={getInputClass('profession')} 
              placeholder="e.g. Brand Strategist" 
              autoComplete="organization-title" 
            />
            {errors.profession && <p className="text-red-500 text-xs mt-1.5">{errors.profession}</p>}
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
            rows={3} 
            maxLength={MAX_BIO_LENGTH}
            value={form.bio} 
            onChange={handleChange} 
            className={getInputClass('bio')} 
            placeholder="Tell us about yourself, your work, and what makes you different..."
          ></textarea>
          {errors.bio && <p className="text-red-500 text-xs mt-1.5">{errors.bio}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Skills (comma separated)</label>
          <input name="skills" value={form.skills} onChange={handleChange} className="form-input" placeholder="branding, strategy, copywriting, research" />
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
            <div>
              <input 
                name="whatsapp_local" 
                type="tel" 
                value={form.whatsapp_local} 
                onChange={handleChange} 
                className={getInputClass('whatsapp_local', 'w-full')} 
                placeholder="e.g. 8012345678 (with or without 0)" 
                autoComplete="tel-national" 
              />
              {errors.whatsapp_local && <p className="text-red-500 text-xs mt-1.5">{errors.whatsapp_local}</p>}
            </div>
            <p className="text-[11px] text-muted">Leading zero is handled automatically.</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Country *</label>
            <input 
              name="country" 
              value={form.country} 
              onChange={handleChange} 
              className={getInputClass('country')} 
              placeholder="Nigeria" 
              autoComplete="country-name" 
            />
            {errors.country && <p className="text-red-500 text-xs mt-1.5">{errors.country}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">City *</label>
            <input 
              name="city" 
              value={form.city} 
              onChange={handleChange} 
              className={getInputClass('city')} 
              placeholder="Bauchi" 
              autoComplete="address-level2" 
            />
            {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>}
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