'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { generateReference } from '@/lib/paystack'

export default function ProviderDashboard() {
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [upgrading, setUpgrading] = useState(false)
  const [proBooks, setProBooks] = useState<any[]>([])
  const [activeBook, setActiveBook] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<{months: number, price: number}>({ months: 1, price: 3000 })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [origin, setOrigin] = useState('https://www.findoncampus.com')
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null)
  const [showCertModal, setShowCertModal] = useState(false)
  
  // Verification Form State for Unverified Providers
  const [bizDesc, setBizDesc] = useState('')
  const [bizAddress, setBizAddress] = useState('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const router = useRouter()

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }

    const storedProvider = localStorage.getItem('foc_provider')
    if (!storedProvider) { router.push('/provider-login'); return }
    
    let providerData: any
    try { providerData = JSON.parse(storedProvider) } catch (e) { localStorage.removeItem('foc_provider'); router.push('/provider-login'); return }

    const fetchProvider = async () => {
      const { data } = await supabase.from('providers').select('*').eq('id', providerData.id).single()
      if (data) {
        if (data.membership === 'pro' && data.membership_expires_at) {
          if (new Date(data.membership_expires_at) < new Date()) {
            await supabase.from('providers').update({ membership: 'free', membership_expires_at: null }).eq('id', data.id)
            data.membership = 'free'; data.membership_expires_at = null
            showToast('Your Pro Membership has expired.', 'info')
          }
        }
        setProvider(data)
        setForm({
          full_name: data.full_name, category: data.category || '', profession: data.profession, bio: data.bio,
          skills: data.skills.join(', '), whatsapp: data.whatsapp, country: data.country, city: data.city,
          education_level: data.education_level || '', school: data.school || '',
          long_description: data.long_description || '',
          linkedin: data.social_links?.linkedin || '', twitter: data.social_links?.twitter || '', 
          tiktok: data.social_links?.tiktok || '', instagram: data.social_links?.instagram || '', portfolio: data.social_links?.portfolio || '',
          internship_role: data.internship_role || '',
          internship_pitch: data.internship_pitch || ''
        })
        if (data.membership === 'pro') {
          const { data: booksData } = await supabase.from('pro_books').select('*').order('created_at', { ascending: false })
          setProBooks(booksData || [])
        }
      } else { localStorage.removeItem('foc_provider'); router.push('/provider-login') }
      setLoading(false)
    }
    fetchProvider()
  }, [router])

  // Render high-resolution certificate onto off-screen HTML5 Canvas (Verified Providers only)
  useEffect(() => {
    if (!provider || provider.verification_status !== 'verified' || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 1600
    const H = 1130
    canvas.width = W
    canvas.height = H

    const drawCertificate = (logoImg?: HTMLImageElement) => {
      const bgGrad = ctx.createLinearGradient(0, 0, W, H)
      bgGrad.addColorStop(0, '#FDFBF7')
      bgGrad.addColorStop(0.5, '#FAF6EE')
      bgGrad.addColorStop(1, '#F4EDE0')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.strokeStyle = 'rgba(180, 142, 62, 0.055)'
      ctx.lineWidth = 1.5
      for (let i = -H; i < W + H; i += 36) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + H, H)
        ctx.stroke()
      }
      ctx.restore()

      ctx.strokeStyle = '#14532D'
      ctx.lineWidth = 14
      ctx.strokeRect(36, 36, W - 72, H - 72)

      ctx.strokeStyle = '#C59B27'
      ctx.lineWidth = 3
      ctx.strokeRect(58, 58, W - 116, H - 116)

      ctx.fillStyle = '#B91C1C'
      ctx.fillRect(W / 2 - 90, 36, 180, 10)

      let topCursor = 112
      if (logoImg) {
        const logoH = 64
        const logoW = (logoImg.width / logoImg.height) * logoH
        ctx.drawImage(logoImg, W / 2 - logoW / 2, topCursor, logoW, logoH)
        topCursor += logoH + 22
      } else {
        ctx.fillStyle = '#14532D'
        ctx.font = 'bold 26px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText('FINDONECAMPUS', W / 2, topCursor + 24)
        topCursor += 52
      }

      ctx.textAlign = 'center'
      ctx.fillStyle = '#B91C1C'
      ctx.font = 'bold 17px system-ui, sans-serif'
      ctx.fillText('OFFICIAL VERIFIED PROVIDER RECOGNITION', W / 2, topCursor)

      topCursor += 64
      ctx.fillStyle = '#111827'
      ctx.font = 'bold 54px Georgia, serif'
      ctx.fillText('Certificate of Platform Listing', W / 2, topCursor)

      topCursor += 28
      ctx.strokeStyle = '#C59B27'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(W / 2 - 180, topCursor)
      ctx.lineTo(W / 2 + 180, topCursor)
      ctx.stroke()

      topCursor += 56
      ctx.fillStyle = '#4B5563'
      ctx.font = 'italic 23px Georgia, serif'
      ctx.fillText('This is to certify that', W / 2, topCursor)

      topCursor += 76
      const displayName = (form.full_name || provider.full_name || 'Service Provider').trim()
      ctx.fillStyle = '#14532D'
      ctx.font = displayName.length > 26 ? 'bold 52px Georgia, serif' : 'bold 64px Georgia, serif'
      ctx.fillText(displayName, W / 2, topCursor)

      const nameMetrics = ctx.measureText(displayName)
      const underlineW = Math.min(Math.max(nameMetrics.width + 60, 360), 1100)
      ctx.strokeStyle = 'rgba(197, 155, 39, 0.7)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(W / 2 - underlineW / 2, topCursor + 18)
      ctx.lineTo(W / 2 + underlineW / 2, topCursor + 18)
      ctx.stroke()

      topCursor += 66
      const displayProfession = (form.profession || provider.profession || 'Independent Specialist').trim()
      const displayCategory = (form.category || provider.category || '').trim()
      const displayCity = (form.city || provider.city || '').trim()
      const displayCountry = (form.country || provider.country || '').trim()
      const locationStr = [displayCity, displayCountry].filter(Boolean).join(', ')

      ctx.fillStyle = '#1F2937'
      ctx.font = 'bold 28px system-ui, sans-serif'
      ctx.fillText(
        displayCategory ? `${displayProfession}  •  ${displayCategory}` : displayProfession,
        W / 2,
        topCursor
      )

      topCursor += 42
      ctx.fillStyle = '#4B5563'
      ctx.font = '21px system-ui, sans-serif'
      ctx.fillText(
        locationStr
          ? `is a verified service provider on FindOneCampus operating from ${locationStr}.`
          : 'is a verified service provider on the FindOneCampus Global Marketplace.',
        W / 2,
        topCursor
      )

      const rawSkills = (form.skills || (provider.skills || []).join(', '))
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, 4)

      if (rawSkills.length > 0) {
        topCursor += 46
        ctx.font = '600 16px system-ui, sans-serif'
        const pillPadX = 20
        const pillH = 34
        const gap = 14
        const pillWidths = rawSkills.map((s: string) => ctx.measureText(s).width + pillPadX * 2)
        const totalRowW = pillWidths.reduce((a: number, b: number) => a + b, 0) + gap * (rawSkills.length - 1)
        let startX = W / 2 - totalRowW / 2

        rawSkills.forEach((skill: string, idx: number) => {
          const pw = pillWidths[idx]
          ctx.fillStyle = 'rgba(20, 83, 45, 0.08)'
          ctx.strokeStyle = 'rgba(20, 83, 45, 0.25)'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.roundRect(startX, topCursor - 23, pw, pillH, 17)
          ctx.fill()
          ctx.stroke()

          ctx.fillStyle = '#14532D'
          ctx.textAlign = 'center'
          ctx.fillText(skill, startX + pw / 2, topCursor - 1)
          startX += pw + gap
        })
      }

      const footerRowY = 875
      const joinedDate = provider.created_at
        ? new Date(provider.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      const shortId = String(provider.id || '').slice(0, 8).toUpperCase()

      ctx.textAlign = 'center'
      ctx.fillStyle = '#111827'
      ctx.font = 'bold 19px system-ui, sans-serif'
      ctx.fillText(joinedDate, 330, footerRowY - 12)
      ctx.strokeStyle = '#9CA3AF'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(190, footerRowY)
      ctx.lineTo(470, footerRowY)
      ctx.stroke()
      ctx.fillStyle = '#6B7280'
      ctx.font = '14px system-ui, sans-serif'
      ctx.fillText(`VERIFIED DATE  •  ID: FOC-${shortId}`, 330, footerRowY + 24)

      const sealX = W / 2
      const sealY = footerRowY - 8
      ctx.save()
      ctx.beginPath()
      ctx.arc(sealX, sealY, 56, 0, Math.PI * 2)
      const sealGrad = ctx.createRadialGradient(sealX - 15, sealY - 15, 8, sealX, sealY, 56)
      sealGrad.addColorStop(0, '#F3D06B')
      sealGrad.addColorStop(0.6, '#C59B27')
      sealGrad.addColorStop(1, '#8F6B10')
      ctx.fillStyle = sealGrad
      ctx.fill()

      ctx.strokeStyle = '#FFFBEB'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(sealX, sealY, 47, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.font = 'bold 13px system-ui, sans-serif'
      ctx.fillText('FINDONECAMPUS', sealX, sealY - 10)
      ctx.font = 'bold 16px Georgia, serif'
      ctx.fillText('VERIFIED', sealX, sealY + 10)
      ctx.font = '11px system-ui, sans-serif'
      ctx.fillText('PROVIDER', sealX, sealY + 26)
      ctx.restore()

      ctx.textAlign = 'center'
      ctx.fillStyle = '#14532D'
      ctx.font = 'italic bold 22px Georgia, serif'
      ctx.fillText('FindOneCampus Directory', 1270, footerRowY - 12)
      ctx.strokeStyle = '#9CA3AF'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(1110, footerRowY)
      ctx.lineTo(1430, footerRowY)
      ctx.stroke()
      ctx.fillStyle = '#6B7280'
      ctx.font = '14px system-ui, sans-serif'
      ctx.fillText(`findoncampus.com/providers/${shortId.toLowerCase()}...`, 1270, footerRowY + 24)

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(110, 955)
      ctx.lineTo(W - 110, 955)
      ctx.stroke()

      ctx.fillStyle = '#6B7280'
      ctx.textAlign = 'center'
      ctx.font = '13.5px system-ui, sans-serif'
      ctx.fillText(
        'NOTICE & DISCLAIMER: This certificate confirms that the named individual maintains a verified service provider profile on FindOneCampus for promotional and portfolio purposes only.',
        W / 2,
        984
      )
      ctx.fillText(
        'It does not constitute academic accreditation, government licensing, or a professional credential. FindOneCampus is a discovery marketplace and assumes no liability for independent client engagements.',
        W / 2,
        1006
      )

      try {
        setCertificatePreview(canvas.toDataURL('image/png'))
      } catch {}
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => drawCertificate(img)
    img.onerror = () => drawCertificate()
    img.src = 'https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png'
  }, [provider, form.full_name, form.profession, form.category, form.city, form.country, form.skills])

  const handleDownloadCertificate = () => {
    if (provider.verification_status !== 'verified') {
      showToast('Certificate download is available for Verified Providers.', 'info')
      return
    }
    if (!canvasRef.current) return
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      const cleanSlug = (form.full_name || provider?.full_name || 'provider')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
      link.download = `FindOneCampus-Verified-Certificate-${cleanSlug}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast('Verified certificate downloaded as PNG!', 'success')
    } catch {
      showToast('Could not export certificate. Please try again.', 'error')
    }
  }

  const handleSendVerificationWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    const verificationText = `Hello FindOneCampus Team,\n\nI would like to request verification for my provider profile so I can unlock my Verified Badge and Certificate.\n\n*My Details:*\n• Name: ${form.full_name || provider.full_name}\n• Profession: ${form.profession || provider.profession}\n• City/Country: ${form.city || provider.city}, ${form.country || provider.country}\n• WhatsApp: ${form.whatsapp || provider.whatsapp}\n• Business Description: ${bizDesc || 'Not provided'}\n• Business Address/Location: ${bizAddress || 'Not provided'}\n\nPlease let me know what is required to verify my business.`
    
    const whatsappUrl = `https://wa.me/2348149193063?text=${encodeURIComponent(verificationText)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('providers').update({
      full_name: form.full_name, category: form.category, profession: form.profession, bio: form.bio,
      skills: form.skills.split(',').map((s: string) => s.trim()), whatsapp: form.whatsapp, country: form.country, city: form.city,
      education_level: form.education_level, school: form.school, long_description: form.long_description,
      social_links: { linkedin: form.linkedin, twitter: form.twitter, tiktok: form.tiktok, instagram: form.instagram, portfolio: form.portfolio },
      internship_role: form.internship_role, internship_pitch: form.internship_pitch
    }).eq('id', provider.id)
    if (!error) showToast('Profile updated successfully!', 'success')
    else showToast('Error updating profile.', 'error')
  }

  const handleProUpgrade = async () => {
    const flwKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;
    if (!flwKey || !(window as any).FlutterwaveCheckout) {
      window.dispatchEvent(new CustomEvent('show-fallback-payment', { detail: { amount: selectedPlan.price.toLocaleString(), description: `Pro Membership (${selectedPlan.months} month(s))` }}))
      return;
    }
    setUpgrading(true)
    const reference = generateReference('PRO')
    await supabase.from('payments').insert({ amount: selectedPlan.price, status: 'pending', reference, item_type: 'membership', provider_id: provider.id })
    try {
      (window as any).FlutterwaveCheckout({
        public_key: flwKey,
        tx_ref: reference,
        amount: selectedPlan.price,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: { email: provider.email || 'guest@findonecampus.com' },
        customization: {
          title: "FindOneCampus",
          description: "Pro Membership Upgrade",
          logo: "https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png"
        },
        callback: function(data: any) {
          if (data.status === 'successful' || data.status === 'completed') {
            const verifyAndUpgrade = async () => {
              const expiryDate = new Date(); expiryDate.setMonth(expiryDate.getMonth() + selectedPlan.months)
              await supabase.from('providers').update({ membership: 'pro', membership_expires_at: expiryDate.toISOString() }).eq('id', provider.id)
              await supabase.from('payments').update({ status: 'success' }).eq('reference', reference)
              setProvider({ ...provider, membership: 'pro', membership_expires_at: expiryDate.toISOString() })
              const { data: booksData } = await supabase.from('pro_books').select('*').order('created_at', { ascending: false })
              setProBooks(booksData || [])
              setUpgrading(false)
              showToast(`Congratulations! You are now a Pro Member for ${selectedPlan.months} month(s).`, 'success')
            }; verifyAndUpgrade()
          } else { setUpgrading(false) }
        },
        onclose: function() { setUpgrading(false) }
      })
    } catch (error) { showToast('Something went wrong.', 'error'); setUpgrading(false) }
  }

  const handleSaveInternship = async (submitForReview = false) => {
    const updateData: any = {
      internship_role: form.internship_role,
      internship_pitch: form.internship_pitch,
      social_links: { ...provider.social_links, linkedin: form.linkedin }
    }

    if (submitForReview && !provider.internship_eligible && provider.internship_request_status !== 'pending') {
      updateData.internship_request_status = 'pending'
    }

    const { error } = await supabase.from('providers').update(updateData).eq('id', provider.id)
    
    if (!error) {
      if (submitForReview) {
        setProvider({ ...provider, internship_request_status: 'pending' })
        showToast('Details saved! Internship request submitted for admin review.', 'success')
      } else {
        showToast('Internship details saved!', 'success')
      }
    } else {
      showToast('Error saving internship details.', 'error')
    }
  }

  const handleLogout = () => { localStorage.removeItem('foc_provider'); router.push('/') }
  const handleSocialClick = (e: React.MouseEvent) => { if (provider.membership !== 'pro') { e.preventDefault(); showToast('Upgrade to Pro to add this social link.', 'info') } }

  const copyProfileLink = () => {
    const url = `${origin}/providers/${provider.id}`
    navigator.clipboard.writeText(url)
    showToast('Profile link copied to clipboard!', 'success')
  }

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you absolutely sure? This will permanently remove your profile from the public directory. This action cannot be undone.')) {
      const { error } = await supabase.from('providers').delete().eq('id', provider.id)
      
      if (error) {
        await supabase.from('providers').update({ 
          is_approved: false, 
          full_name: 'Deleted User', 
          bio: 'This profile has been deleted.', 
          skills: [], 
          whatsapp: '', 
          social_links: {},
          city: '',
          country: ''
        }).eq('id', provider.id)
      }
      
      localStorage.removeItem('foc_provider')
      router.push('/')
    }
  }

  if (loading) return <div className="py-32 text-center">Loading dashboard...</div>
  if (!provider) return <div className="py-32 text-center">No provider profile found.</div>

  const directReviewUrl = `${origin}/providers/${provider.id}/reviews#write-review`
  const reviewShareMessage = `Hi! Thank you for working with me (${provider.full_name} - ${provider.profession}). If you were satisfied with my service, please take 30 seconds to drop an honest review on my FindOneCampus profile—it really helps my work grow:\n\n${directReviewUrl}`

  const copyReviewInvite = () => {
    navigator.clipboard.writeText(reviewShareMessage)
    showToast('Formatted review message & link copied!', 'success')
  }

  const copyDirectReviewLink = () => {
    navigator.clipboard.writeText(directReviewUrl)
    showToast('Direct review link copied!', 'success')
  }

  const handleSocialShareWithCopy = (platformName: string) => {
    navigator.clipboard.writeText(reviewShareMessage)
    showToast(`Review message copied! Paste it into your ${platformName} post or DM.`, 'info')
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(reviewShareMessage)}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(directReviewUrl)}&summary=${encodeURIComponent(reviewShareMessage)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(reviewShareMessage)}`

  const isVerified = provider.verification_status === 'verified'

  return (
    <div className="max-w-4xl mx-auto py-32 px-6">
      <canvas ref={canvasRef} className="hidden" />

      {showCertModal && certificatePreview && isVerified && (
        <div
          className="fixed inset-0 bg-black/80 z-[200] flex flex-col items-center justify-center p-4 md:p-8"
          onClick={() => setShowCertModal(false)}
        >
          <div
            className="max-w-4xl w-full flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-white serif text-xl md:text-2xl">Verified Provider Certificate</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="btn-primary !py-2 !px-4 text-xs"
                >
                  <i className="fas fa-download mr-1.5"></i> Download PNG
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="text-white w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white">
              <img
                src={certificatePreview}
                alt="FindOneCampus Verified Provider Certificate"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      )}

      {activeBook && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex flex-col p-4 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white serif text-2xl">{activeBook.title}</h3>
            <button onClick={() => setActiveBook(null)} className="text-white w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><i className="fas fa-times text-xl"></i></button>
          </div>
          <div className="flex-1 bg-white rounded-2xl overflow-hidden"><iframe src={activeBook.file_url} className="w-full h-full" title={activeBook.title}></iframe></div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[slideUp_0.3s_ease]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-primary' : 'bg-ink'}`}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-lg`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="serif text-4xl">{provider.full_name}</h1>
          {isVerified && <i className="fas fa-check-circle text-blue-500 text-2xl" title="Verified Provider"></i>}
        </div>
        <div className="flex gap-2">
          <button onClick={copyProfileLink} className="btn-secondary !py-2 !px-4 text-sm"><i className="fas fa-link mr-2"></i> Copy Profile Link</button>
          <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 text-sm">Logout</button>
        </div>
      </div>
      
      <div className="premium-card p-6 mb-8 bg-paper">
        <div className="flex items-start gap-3">
          <i className="fas fa-headset text-primary text-xl mt-1"></i>
          <div>
            <h3 className="font-semibold text-ink mb-1">Need Assistance with a Client?</h3>
            <p className="text-sm text-muted">If you face any issues, complaints, or need mediation with a client, FindOneCampus is here to stand in the middle to avoid issues. WhatsApp us: <a href="https://wa.me/2349017380098" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">09017380098</a>.</p>
          </div>
        </div>
      </div>

      {/* VERIFIED PROVIDER CERTIFICATE SECTION (LOCKED FOR UNVERIFIED WITH WHATSAPP REQUEST FORM) */}
      <div className={`premium-card p-6 md:p-8 mb-8 border-l-4 ${isVerified ? 'border-l-green-700' : 'border-l-amber-500'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isVerified ? 'bg-green-700/10 text-green-700' : 'bg-amber-500/10 text-amber-600'}`}>
                <i className={`fas ${isVerified ? 'fa-award' : 'fa-lock'} text-lg`}></i>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {isVerified ? 'Verified Provider Certificate' : 'Certificate Locked (Business Verification Required)'}
                </h2>
                <p className="text-xs text-muted">
                  {isVerified 
                    ? 'Download your official FindOneCampus verified certificate graphic with your blue tick status.' 
                    : 'Get your business verified to earn your blue verification tick and unlock your official downloadable certificate.'}
                </p>
              </div>
            </div>

            {isVerified ? (
              <p className="text-xs text-muted leading-relaxed mt-3 mb-4">
                Personalized with your verified status, profession, location, and skills with standard directory disclaimer.
              </p>
            ) : (
              <div className="mt-3 mb-4 p-5 rounded-xl bg-paper border border-black/10 text-xs space-y-4 text-muted">
                <div className="flex items-start gap-2 text-ink">
                  <i className="fas fa-shield-alt text-primary text-base mt-0.5"></i>
                  <div>
                    <p className="font-semibold mb-0.5">How Verification Works (Free & Trust-Based):</p>
                    <p className="text-muted leading-relaxed">Verification is separate from Pro membership and is 100% free of charge. We verify your business identity to build client trust and award you a blue tick badge.</p>
                  </div>
                </div>

                <form onSubmit={handleSendVerificationWhatsApp} className="space-y-3 pt-2 border-t border-black/5">
                  <p className="font-semibold text-ink">Submit your details to start verification via WhatsApp (+2348149193063):</p>
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-ink">Brief Business / Service Description</label>
                    <input
                      type="text"
                      required
                      value={bizDesc}
                      onChange={(e) => setBizDesc(e.target.value)}
                      placeholder="e.g. Graphic design agency and student branding services"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/10 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-ink">Business Address / Campus / Location</label>
                    <input
                      type="text"
                      required
                      value={bizAddress}
                      onChange={(e) => setBizAddress(e.target.value)}
                      placeholder="e.g. Bauchi State University / Main Campus"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/10 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold transition shadow-sm"
                  >
                    <i className="fab fa-whatsapp text-sm"></i> Request Verification via WhatsApp
                  </button>
                </form>
              </div>
            )}

            {isVerified && (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="btn-primary !py-2.5 !px-5 text-xs"
                >
                  <i className="fas fa-download mr-1.5"></i> Download Certificate (PNG)
                </button>

                {certificatePreview && (
                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    className="btn-secondary !py-2.5 !px-4 text-xs"
                  >
                    <i className="fas fa-expand mr-1.5"></i> Preview Full Size
                  </button>
                )}
              </div>
            )}
          </div>

          {isVerified && certificatePreview ? (
            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className="w-full md:w-64 shrink-0 rounded-xl overflow-hidden border border-black/10 shadow-md hover:shadow-lg transition group relative"
              title="Click to enlarge certificate"
            >
              <img
                src={certificatePreview}
                alt="Certificate Preview"
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-full bg-white/95 text-ink text-[11px] font-semibold shadow">
                  <i className="fas fa-search-plus mr-1"></i> Enlarge
                </span>
              </div>
            </button>
          ) : (
            <div className="w-full md:w-64 shrink-0 h-48 rounded-xl bg-paper border border-dashed border-black/20 flex flex-col items-center justify-center text-center p-4">
              <i className="fas fa-certificate text-3xl text-muted/40 mb-2"></i>
              <span className="text-[11px] font-medium text-muted">Certificate & Blue Tick unlock once business verification is complete.</span>
            </div>
          )}
        </div>
      </div>

      {/* SHARE & REQUEST CLIENT REVIEWS SECTION */}
      <div className="premium-card p-6 md:p-8 mb-8 border-l-4 border-l-amber-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-star text-lg"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">Get Client Reviews</h2>
              <p className="text-xs text-muted">
                Share this pre-formatted message with past clients across WhatsApp, LinkedIn, Instagram, TikTok, and X.
              </p>
            </div>
          </div>

          <a
            href={`/providers/${provider.id}/reviews#write-review`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5 shrink-0"
          >
            Open Review Page <i className="fas fa-external-link-alt text-[10px]"></i>
          </a>
        </div>

        <div className="p-4 rounded-xl bg-paper border border-black/10 text-xs text-ink/90 whitespace-pre-line leading-relaxed mb-4">
          {reviewShareMessage}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold transition shadow-sm"
          >
            <i className="fab fa-whatsapp text-sm"></i> WhatsApp
          </a>

          <a
            href={linkedinShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#0A66C2] hover:bg-[#0958a8] text-white text-xs font-medium transition"
          >
            <i className="fab fa-linkedin-in text-sm"></i> LinkedIn
          </a>

          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-black hover:bg-black/85 text-white text-xs font-medium transition"
          >
            <i className="fab fa-x-twitter text-sm"></i> X (Twitter)
          </a>

          <button
            type="button"
            onClick={() => handleSocialShareWithCopy('Instagram')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white text-xs font-medium transition"
          >
            <i className="fab fa-instagram text-sm"></i> Instagram
          </button>

          <button
            type="button"
            onClick={() => handleSocialShareWithCopy('TikTok')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-black hover:bg-black/85 text-white text-xs font-medium transition"
          >
            <i className="fab fa-tiktok text-sm"></i> TikTok
          </button>

          <button
            type="button"
            onClick={copyReviewInvite}
            className="btn-primary !py-2.5 !px-4 text-xs"
          >
            <i className="fas fa-copy mr-1.5"></i> Copy Full Message
          </button>

          <button
            type="button"
            onClick={copyDirectReviewLink}
            className="btn-secondary !py-2.5 !px-4 text-xs"
          >
            <i className="fas fa-link mr-1.5"></i> Copy Link Only
          </button>
        </div>
      </div>

      <div className="premium-card p-8 mb-8 bg-paper">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Status</h2>
            <div className="flex flex-wrap gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${provider.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{provider.is_approved ? 'Approved' : 'Pending Approval'}</span>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${provider.verification_status === 'verified' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>Verification: {provider.verification_status.replace(/_/g, ' ')}</span>
            </div>
          </div>
          <div className="md:border-l md:border-black/10 md:pl-8">
            <h2 className="text-xl font-semibold mb-4">Membership Plan</h2>
            {provider.membership === 'pro' ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-accent text-white uppercase">Pro Member</span>
                  <i className="fas fa-crown text-accent"></i>
                </div>
                {provider.membership_expires_at && <p className="text-xs text-muted mt-2"><i className="far fa-clock mr-1"></i> Expires on: {new Date(provider.membership_expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
              </div>
            ) : (
              <div>
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-800 mb-4 inline-block">Free Member</span>
                <p className="text-sm text-muted mb-4">Upgrade to Pro to unlock social links, rank higher, add a detailed bio, and access the Pro Library.</p>
                
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setSelectedPlan({ months: 1, price: 3000 })} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${selectedPlan.months === 1 ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted'}`}>1 Month<br/>₦3,000</button>
                  <button onClick={() => setSelectedPlan({ months: 3, price: 8000 })} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${selectedPlan.months === 3 ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted'}`}>3 Months<br/>₦8,000</button>
                  <button onClick={() => setSelectedPlan({ months: 12, price: 30000 })} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${selectedPlan.months === 12 ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted'}`}>1 Year<br/>₦30,000</button>
                </div>

                <button onClick={handleProUpgrade} disabled={upgrading} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-accent to-[#b38710] shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50">
                  {upgrading ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-crown"></i> Upgrade to Pro ({selectedPlan.price.toLocaleString()} NGN)</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="premium-card p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
            <input value={form.full_name || ''} onChange={e => setForm({...form, full_name: e.target.value})} className="form-input" name="name" id="name" autoComplete="name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} className="form-input">
              <option value="" disabled>Select category</option>
              <option>Technology & IT</option>
              <option>Design & Creatives</option>
              <option>Business & Finance</option>
              <option>Media & Entertainment</option>
              <option>Education & Training</option>
              <option>Health & Wellness</option>
              <option>Beauty & Fashion</option>
              <option>Food & Catering</option>
              <option>Events & Planning</option>
              <option>Home & Repair Services</option>
              <option>Logistics & Transport</option>
              <option>Agriculture & Environment</option>
              <option>Legal & Admin Services</option>
              <option>Construction & Real Estate</option>
              <option>Construction & Engineering</option>
              <option>Real Estate</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Specific Profession</label>
            <input value={form.profession || ''} onChange={e => setForm({...form, profession: e.target.value})} className="form-input" name="organization-title" id="organization-title" autoComplete="organization-title" />
          </div>
        </div>

        <div><label className="text-sm font-medium mb-2 block">Short Bio</label><textarea rows={3} value={form.bio || ''} onChange={e => setForm({...form, bio: e.target.value})} className="form-input"></textarea></div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Detailed Experience / Longer Bio</label>
            {provider.membership !== 'pro' && <span className="text-[10px] px-2 py-1 bg-accent/15 text-accent rounded-full font-bold uppercase">Pro Only</span>}
          </div>
          <textarea rows={5} value={form.long_description || ''} onChange={e => setForm({...form, long_description: e.target.value})} className="form-input disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Describe your past projects, years of experience, and achievements in detail..." disabled={provider.membership !== 'pro'} onClick={handleSocialClick}></textarea>
        </div>

        <div><label className="text-sm font-medium mb-2 block">Skills (comma separated)</label><input value={form.skills || ''} onChange={e => setForm({...form, skills: e.target.value})} className="form-input" /></div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Highest Education Level</label>
            <input value={form.education_level || ''} onChange={e => setForm({...form, education_level: e.target.value})} className="form-input" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">School Attended</label>
            <input value={form.school || ''} onChange={e => setForm({...form, school: e.target.value})} className="form-input" name="organization" id="organization" autoComplete="organization" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="text-sm font-medium mb-2 block">WhatsApp</label>
            <input value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} className="form-input" name="tel" id="tel" autoComplete="tel" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Country</label>
            <input value={form.country || ''} onChange={e => setForm({...form, country: e.target.value})} className="form-input" name="country-name" id="country-name" autoComplete="country-name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">City</label>
            <input value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} className="form-input" name="address-level2" id="address-level2" autoComplete="address-level2" />
          </div>
        </div>

        {/* OTHER SOCIAL LINKS (Pro Only) */}
        <div className="pt-4 border-t border-black/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink/80">Other Social Links</h3>
            {provider.membership !== 'pro' && <span className="text-[10px] px-2 py-1 bg-accent/15 text-accent rounded-full font-bold uppercase">Pro Only</span>}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Twitter / X</label>
              <input 
                value={form.twitter || ''} 
                onChange={e => setForm({...form, twitter: e.target.value})} 
                className="form-input disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder="Twitter / X URL" 
                disabled={provider.membership !== 'pro'} 
                onClick={handleSocialClick} 
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Instagram</label>
              <input 
                value={form.instagram || ''} 
                onChange={e => setForm({...form, instagram: e.target.value})} 
                className="form-input disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder="Instagram URL" 
                disabled={provider.membership !== 'pro'} 
                onClick={handleSocialClick} 
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">TikTok</label>
              <input 
                value={form.tiktok || ''} 
                onChange={e => setForm({...form, tiktok: e.target.value})} 
                className="form-input disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder="TikTok URL" 
                disabled={provider.membership !== 'pro'} 
                onClick={handleSocialClick} 
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Portfolio Website</label>
              <input 
                value={form.portfolio || ''} 
                onChange={e => setForm({...form, portfolio: e.target.value})} 
                className="form-input disabled:opacity-50 disabled:cursor-not-allowed" 
                placeholder="Portfolio Website URL" 
                disabled={provider.membership !== 'pro'} 
                onClick={handleSocialClick} 
              />
            </div>
          </div>
        </div>

        {/* INTERNSHIP BADGE & PITCH SECTION */}
        <div className="pt-4 border-t border-green-100">
          <div className="flex items-start gap-3 mb-6">
            <i className="fas fa-shield-halved text-green-600 text-xl mt-1"></i>
            <div className="flex-1">
              <h3 className="font-semibold text-ink mb-1">Secured Internship Badge</h3>
              <p className="text-sm text-muted">Get the "Internship Ready" badge. Fill in the details below so employers know exactly what role you want and why you are a great fit.</p>
            </div>
          </div>

          <div className="space-y-5 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Desired Internship Role / Position</label>
              <input 
                value={form.internship_role || ''} 
                onChange={e => setForm({...form, internship_role: e.target.value})} 
                className="form-input" 
                placeholder="e.g. Junior Backend Developer, Social Media Intern"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Why are you a good fit? (Your Pitch)</label>
              <textarea 
                rows={4} 
                value={form.internship_pitch || ''} 
                onChange={e => setForm({...form, internship_pitch: e.target.value})} 
                className="form-input" 
                placeholder="Briefly describe your experience, what you hope to learn, and why an employer should choose you for this internship..."
              ></textarea>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">LinkedIn Profile URL <span className="text-green-600 font-medium">(Free)</span></label>
              <input 
                value={form.linkedin || ''} 
                onChange={e => setForm({...form, linkedin: e.target.value})} 
                className="form-input" 
                placeholder="https://linkedin.com/in/your-profile" 
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-black/5">
            <div>
              {provider.internship_eligible ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">
                  <i className="fas fa-check-circle"></i> Badge Active
                </span>
              ) : provider.internship_request_status === 'pending' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase">
                  <i className="fas fa-spinner fa-spin"></i> Request Pending Admin Review
                </span>
              ) : provider.internship_request_status === 'rejected' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
                  <i className="fas fa-times-circle"></i> Request Rejected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase">
                  <i className="fas fa-circle-dot"></i> Not Requested
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => handleSaveInternship(false)} 
                className="btn-secondary !py-2.5 !px-5 text-sm"
              >
                Save Details
              </button>

              {!provider.internship_eligible && provider.internship_request_status !== 'pending' && (
                <button 
                  type="button"
                  onClick={() => handleSaveInternship(true)} 
                  className="btn-primary !py-2.5 !px-5 text-sm"
                >
                  Submit for Badge
                </button>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center !py-4">Save All Changes</button>

        <div className="pt-6 mt-6 border-t border-red-100">
          <h3 className="text-sm font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-xs text-muted mb-4">Permanently delete your provider profile from FindOneCampus. This action cannot be undone.</p>
          <button type="button" onClick={handleDeleteProfile} className="px-4 py-2 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg font-medium transition">
            <i className="fas fa-trash-alt mr-2"></i> Delete My Profile
          </button>
        </div>
      </form>

      <style>{`@keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </div>
  )
}