
'use client'

import { useState, useEffect, useRef } from 'react'
import {
  UserRound,
  BriefcaseBusiness,
  Wrench,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Building2,
  Sparkles,
  ChevronRight,
  LoaderCircle,
  BadgeCheck,
  Globe2,
  Phone
} from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import * as countryCodes from 'country-codes-list'

const CATEGORIES = [
  'Technology & IT', 'Design & Creatives', 'Business & Finance',
  'Media & Entertainment', 'Education & Training', 'Health & Wellness',
  'Beauty & Fashion', 'Food & Catering', 'Events & Planning',
  'Home & Repair Services', 'Construction & Engineering',
  'Real Estate', 'Logistics & Transport',
  'Agriculture & Environment', 'Legal & Admin Services'
]

const ALL_COUNTRY_CODES = countryCodes.customList(
  'countryCallingCode',
  '{countryNameEn} (+{countryCallingCode})'
)

const uniqueCodesMap = new Map<string, { code: string; name: string }>()

Object.entries(ALL_COUNTRY_CODES).forEach(([iso, label]) => {
  const match = label.match(/\(\+(\d+)\)/)

  if (match) {
    const dialCode = `+${match[1]}`

    if (!uniqueCodesMap.has(dialCode)) {
      uniqueCodesMap.set(dialCode, {
        code: dialCode,
        name: label.split(' (')[0]
      })
    }
  }
})

const GLOBAL_CODES = Array.from(uniqueCodesMap.values())
  .sort((a, b) => a.name.localeCompare(b.name))

const CODE_TO_COUNTRY_MAP: Record<string, string> = {}

GLOBAL_CODES.forEach(c => {
  CODE_TO_COUNTRY_MAP[c.code] = c.name
})

const MAX_BIO_LENGTH = 140

type ProviderType = 'professional' | 'business' | 'skilled'

const STEPS = [
  { title: 'Account type', icon: UserRound },
  { title: 'Personal details', icon: UserRound },
  { title: 'Your services', icon: BriefcaseBusiness },
  { title: 'Your profile', icon: Sparkles },
  { title: 'Contact & location', icon: MapPin },
  { title: 'Background', icon: GraduationCap },
  { title: 'Terms & Privacy', icon: ShieldCheck }
]

const PROVIDER_TYPES = [
  {
    id: 'professional' as ProviderType,
    icon: UserRound,
    title: 'Independent Professional',
    description: 'I offer professional services independently, based on my expertise or qualifications.'
  },
  {
    id: 'business' as ProviderType,
    icon: Building2,
    title: 'Business or Organisation',
    description: 'I represent a business, company, agency or organisation.'
  },
  {
    id: 'skilled' as ProviderType,
    icon: Wrench,
    title: 'Skilled Service Provider',
    description: 'I offer practical skills, trades, crafts or specialised services.'
  }
]

export default function BecomeProvider() {
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [providerType, setProviderType] = useState<ProviderType | ''>('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

  const stepHeadingRef = useRef<HTMLDivElement>(null)
  const previousStepRef = useRef(step)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    category: '',
    profession: '',
    bio: '',
    skills: '',
    country_code: '+234',
    whatsapp_local: '',
    country: 'Nigeria',
    city: '',
    education_level: '',
    school: ''
  })

  const isBusiness = providerType === 'business'

  // Scroll to the new step, not the top of the entire webpage.
  useEffect(() => {
    if (previousStepRef.current !== step) {
      stepHeadingRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start'
      })

      previousStepRef.current = step
    }
  }, [step])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'bio' && value.length > MAX_BIO_LENGTH) return

    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'country_code'
        ? { country: CODE_TO_COUNTRY_MAP[value] || '' }
        : {})
    }))

    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }

    setFormError('')
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (step === 0 && !providerType) {
      newErrors.providerType = 'Please select a registration type.'
    }

    if (step === 1) {
      if (!form.full_name.trim()) {
        newErrors.full_name = 'Please enter your full name.'
      }

      if (!form.email.trim()) {
        newErrors.email = 'Please enter your email address.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        newErrors.email = 'Please enter a valid email address.'
      }
    }

    if (step === 2) {
      if (!form.category) {
        newErrors.category = 'Please select a service category.'
      }

      if (!form.profession.trim()) {
        newErrors.profession = isBusiness
          ? 'Please enter your business name.'
          : providerType === 'skilled'
            ? 'Please enter your trade or service.'
            : 'Please enter your professional title.'
      }
    }

    if (step === 3) {
      if (!form.bio.trim()) {
        newErrors.bio = 'Please provide a short description.'
      }

      if (providerType === 'skilled' && !form.skills.trim()) {
        newErrors.skills = 'Please enter at least one skill.'
      }
    }

    if (step === 4) {
      const cleanLocal = form.whatsapp_local.trim().replace(/[\s\-+]/g, '')

      if (!cleanLocal) {
        newErrors.whatsapp_local = 'Please enter your WhatsApp number.'
      } else if (!/^\d{7,15}$/.test(cleanLocal)) {
        newErrors.whatsapp_local = 'Please enter a valid phone number.'
      }

      if (!form.country.trim()) {
        newErrors.country = 'Please enter your country.'
      }

      if (!form.city.trim()) {
        newErrors.city = 'Please enter your city.'
      }
    }

    if (step === 6 && !consentAccepted) {
      newErrors.consentAccepted = 'You must accept the Terms of Service and Privacy Policy to complete registration.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    setFormError('')

    if (!validateStep()) return

    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1)
    }
  }

  const previousStep = () => {
    setErrors({})
    setFormError('')
    setStep(prev => Math.max(0, prev - 1))
  }

  const getInputClass = (name: string) =>
    `form-input w-full transition-all duration-200 ${
      errors[name]
        ? '!border-red-500 focus:!ring-red-500/20 bg-red-50/30'
        : ''
    }`

  const FieldError = ({ name }: { name: string }) => (
    errors[name] ? (
      <p className="text-red-500 text-xs mt-2 animate-error">
        {errors[name]}
      </p>
    ) : null
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent registration until both documents have been accepted.
    // The button remains clickable so the user receives clear feedback.
    if (!consentAccepted) {
      setErrors(prev => ({
        ...prev,
        consentAccepted: 'You must accept the Terms of Service and Privacy Policy to complete registration.'
      }))
      setFormError('Please read and accept the Terms of Service and Privacy Policy before completing registration.')
      return
    }

    if (!validateStep()) return

    setLoading(true)
    setFormError('')

    let localNumber = form.whatsapp_local.trim().replace(/[\s\-+]/g, '')

    if (localNumber.startsWith('0')) {
      localNumber = localNumber.slice(1)
    }

    const fullWhatsApp =
      form.country_code.replace('+', '') + localNumber

    const trimmedForm = {
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      category: form.category.trim(),
      profession: form.profession.trim(),
      bio: form.bio.trim(),
      skills: form.skills.trim(),
      whatsapp: fullWhatsApp,
      country: form.country.trim(),
      city: form.city.trim()
    }

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('providers')
        .select('email, whatsapp')
        .or(`email.eq.${trimmedForm.email},whatsapp.eq.${trimmedForm.whatsapp}`)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingUser) {
        if (existingUser.email === trimmedForm.email) {
          setErrors(prev => ({
            ...prev,
            email: 'This email is already registered. Try logging in instead.'
          }))
        }

        if (existingUser.whatsapp === trimmedForm.whatsapp) {
          setErrors(prev => ({
            ...prev,
            whatsapp_local: 'This WhatsApp number is already registered.'
          }))
        }

        setFormError('An account with these details already exists.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('providers')
        .insert({
          full_name: trimmedForm.full_name,
          email: trimmedForm.email,
          category: trimmedForm.category,
          profession: trimmedForm.profession,
          bio: trimmedForm.bio,

          skills: trimmedForm.skills
            ? trimmedForm.skills.split(',').map(s => s.trim()).filter(Boolean)
            : [],

          whatsapp: trimmedForm.whatsapp,
          country: trimmedForm.country,
          city: trimmedForm.city,
          education_level: form.education_level.trim(),
          school: form.school.trim(),
          social_links: {},
          is_approved: true,
          verification_status: 'not_verified'
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        localStorage.setItem('foc_provider', JSON.stringify(data))
        setSuccess(true)
      }

    } catch (err: any) {
      console.error(err)

      setFormError(
        err.message ||
        'Something went wrong while creating your account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const verificationEmail = () => {
    const subject = `Business Verification Request - ${form.profession}`

    const body = `
Hello FindOneCampus Verification Team,

I have successfully registered my business on FindOneCampus and would like to request business verification.

BUSINESS INFORMATION

Business Name: ${form.profession}
Business Category: ${form.category}
Business Description: ${form.bio}

OWNER INFORMATION

Full Name: ${form.full_name}
Email: ${form.email}
WhatsApp: +${form.country_code.replace('+', '')} ${form.whatsapp_local}
Location: ${form.city}, ${form.country}

I would like my business to be reviewed for the FindOneCampus verified business badge.

Please let me know the necessary verification requirements and supporting documents.

Thank you.
    `.trim()

    return `mailto:findonecampus@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-10 py-24 md:py-32">
        <div className="premium-card p-7 md:p-12 text-center space-y-7 animate-success">

          <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={42} strokeWidth={1.7} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              WELCOME TO FINDONECAMPUS
            </p>

            <h1 className="serif text-3xl md:text-4xl font-bold mb-3">
              Registration Successful!
            </h1>

            <p className="text-muted text-sm leading-relaxed">
              Your provider account has been created successfully.
              You're now one step closer to connecting with people who need your services.
            </p>
          </div>

          <div className="bg-paper border border-black/5 rounded-xl p-5 text-left space-y-3">

            <div className="flex items-center gap-3">
              <Building2 className="text-primary" size={22} />

              <div>
                <p className="font-bold">{form.profession}</p>
                <p className="text-xs text-muted">{form.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <MapPin size={14} />
              {form.city}, {form.country}
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-amber-50 text-amber-700">
                <ShieldCheck size={15} />
                Not yet verified
              </span>
            </div>

          </div>

          {isBusiness && (
            <div className="border border-black/10 rounded-xl p-5 md:p-6 text-left space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BadgeCheck size={23} />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Verify Your Business
                  </h3>
                  <p className="text-xs text-muted">
                    Build trust with a verified business badge.
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                Request a business verification review. Our team
                will review your information and supporting documents
                before awarding your verification badge.
              </p>

              <a
                href={verificationEmail()}
                className="btn-primary w-full justify-center !py-4 flex items-center gap-2"
              >
                <Mail size={18} />
                Request Business Verification
              </a>

              <p className="text-xs text-muted text-center">
                Verification is subject to review and approval.
              </p>

            </div>
          )}

          <button
            onClick={() => router.push('/dashboard/provider')}
            className="btn-primary w-full justify-center !py-4 flex items-center gap-2"
          >
            Go to Your Dashboard
            <ArrowRight size={18} />
          </button>

        </div>

        <AnimationStyles />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-10 py-24 md:py-32">

      {/* PAGE HEADER */}
      <div className="text-center mb-10">

        <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">
          <Sparkles size={15} />
          JOIN FINDONECAMPUS
        </div>

        <h1 className="serif text-3xl md:text-5xl mb-3">
          Become a <span className="gradient-text">Provider</span>
        </h1>

        <p className="text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Get discovered. Connect with opportunities.
          Let's create your provider profile.
        </p>

      </div>

      {/* PROGRESS */}
      <div className="mb-8">

        <div className="flex justify-between items-center mb-3">

          <span className="text-xs font-bold text-muted tracking-wider">
            STEP {step + 1} OF {STEPS.length}
          </span>

          <span className="text-xs font-semibold text-primary">
            {STEPS[step].title}
          </span>

        </div>

        <div className="flex gap-2">
          {STEPS.map((item, index) => (
            <div
              key={item.title}
              className="h-1.5 flex-1 bg-black/5 rounded-full overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  index <= step ? 'w-full bg-primary' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="premium-card p-6 md:p-10 overflow-hidden"
      >

        {formError && (
          <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-error">
            {formError}
          </div>
        )}

        {/* ACTIVE STEP */}
        <div
          key={step}
          ref={stepHeadingRef}
          className="step-enter scroll-mt-24"
        >

          {/* STEP 0: ACCOUNT TYPE */}
          {step === 0 && (
            <div className="space-y-7">

              <StepHeading
                eyebrow="LET'S GET STARTED"
                title="How would you like to register?"
                description="Choose the option that best describes how you offer your services."
              />

              <div className="space-y-3">

                {PROVIDER_TYPES.map(type => {
                  const Icon = type.icon
                  const selected = providerType === type.id

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setProviderType(type.id)
                        setErrors({})
                      }}
                      aria-pressed={selected}
                      className={`provider-option w-full text-left p-5 rounded-xl border-2 flex items-start gap-4 ${
                        selected
                          ? 'border-primary bg-primary/5 selected-option'
                          : 'border-black/10 hover:border-primary/40'
                      }`}
                    >

                      <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                        selected
                          ? 'bg-primary text-white'
                          : 'bg-paper text-primary'
                      }`}>
                        <Icon size={23} strokeWidth={1.8} />
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center justify-between gap-2">

                          <h3 className="font-bold text-sm md:text-base">
                            {type.title}
                          </h3>

                          <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-primary' : 'border-black/20'
                          }`}>
                            {selected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>

                        </div>

                        <p className="text-xs md:text-sm text-muted mt-2 leading-relaxed">
                          {type.description}
                        </p>

                      </div>

                    </button>
                  )
                })}

              </div>

              <FieldError name="providerType" />

            </div>
          )}

          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <div className="space-y-6">

              <StepHeading
                eyebrow="PERSONAL INFORMATION"
                title="Let's get to know you."
                description="First, tell us a little about yourself."
              />

              <InputField label="Full Name *" error={errors.full_name}>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className={getInputClass('full_name')}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  autoFocus
                />
              </InputField>

              <InputField label="Email Address *" error={errors.email}>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={getInputClass('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </InputField>

            </div>
          )}

          {/* STEP 2: SERVICES */}
          {step === 2 && (
            <div className="space-y-6">

              <StepHeading
                eyebrow="YOUR SERVICES"
                title="What do you offer?"
                description="Help people understand the services they can find through your profile."
              />

              <InputField label="Service Category *" error={errors.category}>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={getInputClass('category')}
                >
                  <option value="">Select a category</option>

                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </InputField>

              <InputField
                label={
                  isBusiness
                    ? 'Business or Organisation Name *'
                    : providerType === 'skilled'
                      ? 'Your Trade or Service *'
                      : 'Professional Title *'
                }
                error={errors.profession}
              >
                <input
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                  className={getInputClass('profession')}
                  placeholder={
                    isBusiness
                      ? 'e.g. Bright Future Technologies'
                      : providerType === 'skilled'
                        ? 'e.g. Electrician, Tailor, Carpenter'
                        : 'e.g. Brand Strategist, Software Developer'
                  }
                />
              </InputField>

              <div className="flex items-start gap-2 text-xs text-muted bg-paper rounded-xl p-4">
                <BriefcaseBusiness size={16} className="text-primary shrink-0 mt-0.5" />
                <p>
                  {isBusiness
                    ? 'Enter the name customers recognise your business by.'
                    : 'Use a clear title that describes the service you provide.'}
                </p>
              </div>

            </div>
          )}

          {/* STEP 3: PROFILE */}
          {step === 3 && (
            <div className="space-y-6">

              <StepHeading
                eyebrow="YOUR PROFILE"
                title="Tell people what makes you different."
                description="Create a short introduction that helps potential clients understand what you do."
              />

              <InputField
                label={isBusiness ? 'Business Description *' : 'Short Bio *'}
                error={errors.bio}
              >
                <div className="relative">

                  <textarea
                    name="bio"
                    rows={4}
                    maxLength={MAX_BIO_LENGTH}
                    value={form.bio}
                    onChange={handleChange}
                    className={`${getInputClass('bio')} resize-none`}
                    placeholder={
                      isBusiness
                        ? 'Describe your business, what you offer and who you serve...'
                        : 'Tell us about your experience, work and services...'
                    }
                  />

                  <div className={`text-right text-xs mt-2 ${
                    form.bio.length >= MAX_BIO_LENGTH
                      ? 'text-red-500 font-semibold'
                      : 'text-muted'
                  }`}>
                    {form.bio.length}/{MAX_BIO_LENGTH} characters
                  </div>

                </div>
              </InputField>

              <InputField
                label={`Skills ${providerType === 'skilled' ? '*' : '(Optional)'}`}
                error={errors.skills}
              >
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className={getInputClass('skills')}
                  placeholder="e.g. Repairs, installation, maintenance"
                />
              </InputField>

              <p className="text-xs text-muted -mt-3">
                Separate multiple skills with commas.
              </p>

              {providerType === 'skilled' && (
                <div className="flex items-start gap-2 text-xs bg-blue-50 text-blue-800 rounded-xl p-4">
                  <Wrench size={16} className="shrink-0" />
                  Adding your skills helps people understand exactly what you can do.
                </div>
              )}

            </div>
          )}

          {/* STEP 4: CONTACT AND LOCATION */}
          {step === 4 && (
            <div className="space-y-6">

              <StepHeading
                eyebrow="CONTACT & LOCATION"
                title="Where can people reach you?"
                description="Add your contact information and location so potential clients can find you."
              />

              <InputField
                label="WhatsApp Number *"
                error={errors.whatsapp_local}
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr] gap-3">

                  <select
                    name="country_code"
                    value={form.country_code}
                    onChange={handleChange}
                    className="form-input w-full text-sm"
                  >
                    {GLOBAL_CODES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>

                  <input
                    name="whatsapp_local"
                    type="tel"
                    value={form.whatsapp_local}
                    onChange={handleChange}
                    className={getInputClass('whatsapp_local')}
                    placeholder="8012345678"
                    autoComplete="tel-national"
                  />

                </div>
              </InputField>

              <p className="text-xs text-muted leading-relaxed -mt-3">
                Your WhatsApp number will be displayed on your public FindOneCampus provider profile so interested people can contact you directly. Please use a number you are comfortable sharing publicly.
              </p>

              <InputField label="Country *" error={errors.country}>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={getInputClass('country')}
                  placeholder="Nigeria"
                  autoComplete="country-name"
                />
              </InputField>

              <InputField label="City *" error={errors.city}>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={getInputClass('city')}
                  placeholder="e.g. Bauchi"
                  autoComplete="address-level2"
                />
              </InputField>

              <div className="flex items-center gap-2 text-xs text-muted bg-paper rounded-xl p-4">
                <Globe2 size={17} className="text-primary shrink-0" />
                Your location helps customers discover providers in their area.
              </div>

            </div>
          )}

          {/* STEP 5: EDUCATION AND REVIEW */}
          {step === 5 && (
            <div className="space-y-6">

              <StepHeading
                eyebrow="BACKGROUND"
                title="A little more about your background."
                description="Add your educational background if you wish. These details are optional."
              />

              <InputField label="Highest Education Level">
                <input
                  name="education_level"
                  value={form.education_level}
                  onChange={handleChange}
                  className="form-input w-full"
                  placeholder="e.g. B.Sc, HND, SSCE"
                />
              </InputField>

              <InputField label="School Attended">
                <input
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  className="form-input w-full"
                  placeholder="e.g. Abubakar Tafawa Balewa University"
                />
              </InputField>

              <div className="border border-black/10 rounded-xl p-5 space-y-4">

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={19} className="text-primary" />
                  <h3 className="font-bold text-sm">Review your details</h3>
                </div>

                <ReviewItem label="Full name" value={form.full_name} />
                <ReviewItem label="Email" value={form.email} />
                <ReviewItem
                  label="Registration type"
                  value={PROVIDER_TYPES.find(t => t.id === providerType)?.title || ''}
                />
                <ReviewItem
                  label={isBusiness ? 'Business name' : 'Profession'}
                  value={form.profession}
                />
                <ReviewItem label="Category" value={form.category} />
                <ReviewItem label="Location" value={`${form.city}, ${form.country}`} />

              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck size={20} className="text-blue-700 shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Your provider profile will be created with an unverified status.
                  Business verification is a separate review process.
                </p>
              </div>

            </div>
          )}

          {/* STEP 6: TERMS OF SERVICE AND PRIVACY POLICY CONSENT */}
          {step === 6 && (
            <div className="space-y-6">
              <StepHeading
                eyebrow="ONE LAST STEP"
                title="Review and complete your registration."
                description="Please read the FindOneCampus Terms of Service and Privacy Policy before submitting your provider registration."
              />

              <div className="rounded-xl border border-black/10 bg-paper p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={22} className="text-primary shrink-0" />
                  <h3 className="font-bold">Terms of Service</h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Review the terms and conditions that govern your use of FindOneCampus. The document will open in a new tab so you can return to this page afterwards.
                </p>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Read Terms of Service
                  <ArrowRight size={15} />
                </a>
              </div>

              <div className="rounded-xl border border-black/10 bg-paper p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={22} className="text-primary shrink-0" />
                  <h3 className="font-bold">Privacy Policy</h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Learn how FindOneCampus collects, uses and protects your personal information. This document will also open in a new tab.
                </p>
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Read Privacy Policy
                  <ArrowRight size={15} />
                </a>
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => {
                    setConsentAccepted(e.target.checked)
                    if (e.target.checked) {
                      setErrors(prev => {
                        const updated = { ...prev }
                        delete updated.consentAccepted
                        return updated
                      })
                      setFormError('')
                    }
                  }}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-primary rounded-sm"
                  aria-label="I have read and agree to the Terms of Service and Privacy Policy"
                />
                <span className="text-sm leading-relaxed text-gray-700">
                  I confirm that I have read and agree to the{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-4"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-4"
                  >
                    Privacy Policy
                  </a>.
                </span>
              </label>

              {errors.consentAccepted && (
                <p className="text-red-500 text-xs animate-error">
                  {errors.consentAccepted}
                </p>
              )}
            </div>
          )}

        </div>

        {/* NAVIGATION */}
        <div className="flex items-center gap-3 mt-9 pt-6 border-t border-black/5">

          {step > 0 && (
            <button
              type="button"
              onClick={previousStep}
              disabled={loading}
              className="step-button px-5 py-3.5 rounded-xl border border-black/10 font-semibold text-sm flex items-center gap-2 hover:bg-black/5 transition"
            >
              <ArrowLeft size={17} />
              Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary flex-1 justify-center !py-4 flex items-center gap-2 step-button"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              aria-disabled={loading || !consentAccepted}
              title={!consentAccepted ? 'Please accept the Terms of Service and Privacy Policy first.' : undefined}
              className={`btn-primary flex-1 justify-center !py-4 flex items-center gap-2 step-button ${
                !consentAccepted
                  ? '!bg-gray-300 !text-gray-600 !border-gray-300 opacity-70 cursor-not-allowed'
                  : ''
              }`}
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Complete Registration
                  <CheckCircle2 size={19} />
                </>
              )}
            </button>
          )}

        </div>

        <p className="text-center text-xs text-muted mt-5">
          Your information will be used to create your FindOneCampus provider profile.
        </p>

      </form>

      <AnimationStyles />

    </div>
  )
}

// REUSABLE COMPONENTS

function StepHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-bold tracking-[0.17em] uppercase text-primary mb-3">
        {eyebrow}
      </p>

      <h2 className="serif text-2xl md:text-3xl font-bold mb-3 leading-tight">
        {title}
      </h2>

      <p className="text-sm text-muted leading-relaxed max-w-lg">
        {description}
      </p>
    </div>
  )
}

function InputField({
  label,
  error,
  children
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-xs mt-2 animate-error">
          {error}
        </p>
      )}
    </div>
  )
}

function ReviewItem({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-black/5 pb-3 last:border-0 last:pb-0">
      <span className="text-muted">{label}</span>
      <span className="font-semibold sm:text-right break-words">{value}</span>
    </div>
  )
}

function AnimationStyles() {
  return (
    <style jsx global>{`
      .step-enter {
        animation: stepEnter 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        transform-origin: center;
      }

      .provider-option {
        transition:
          border-color 0.25s ease,
          background-color 0.25s ease,
          transform 0.25s ease,
          box-shadow 0.25s ease;
      }

      .provider-option:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.045);
      }

      .provider-option:active {
        transform: scale(0.99);
      }

      .selected-option {
        box-shadow: 0 0 0 3px rgba(0,137,123,0.08);
      }

      .step-button {
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          opacity 0.2s ease;
      }

      .step-button:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .step-button:active:not(:disabled) {
        transform: scale(0.985);
      }

      .animate-error {
        animation: errorEnter 0.25s ease both;
      }

      .animate-success {
        animation: successEnter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes stepEnter {
        from {
          opacity: 0;
          transform: translate3d(16px, 5px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }

      @keyframes errorEnter {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes successEnter {
        from {
          opacity: 0;
          transform: translateY(14px) scale(0.99);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .step-enter,
        .animate-error,
        .animate-success {
          animation: none !important;
        }

        .provider-option,
        .step-button {
          transition: none !important;
        }

        html {
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  )
}
