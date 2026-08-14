'use client'
import { useState, useEffect } from 'react'
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
  const [selectedPlan, setSelectedPlan] = useState<{months: number, price: number}>({ months: 1, price: 7000 })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const router = useRouter()

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
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
          tiktok: data.social_links?.tiktok || '', instagram: data.social_links?.instagram || '', portfolio: data.social_links?.portfolio || ''
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('providers').update({
      full_name: form.full_name, category: form.category, profession: form.profession, bio: form.bio,
      skills: form.skills.split(',').map((s: string) => s.trim()), whatsapp: form.whatsapp, country: form.country, city: form.city,
      education_level: form.education_level, school: form.school, long_description: form.long_description,
      social_links: { linkedin: form.linkedin, twitter: form.twitter, tiktok: form.tiktok, instagram: form.instagram, portfolio: form.portfolio }
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

  const handleLogout = () => { localStorage.removeItem('foc_provider'); router.push('/') }
  const handleSocialClick = (e: React.MouseEvent) => { if (provider.membership !== 'pro') { e.preventDefault(); showToast('Upgrade to Pro to add social links.', 'info') } }
  const copyProfileLink = () => {
    const url = `${window.location.origin}/providers/${provider.id}`
    navigator.clipboard.writeText(url)
    showToast('Profile link copied to clipboard!', 'success')
  }

  if (loading) return <div className="py-32 text-center">Loading dashboard...</div>
  if (!provider) return <div className="py-32 text-center">No provider profile found.</div>

  return (
    <div className="max-w-4xl mx-auto py-32 px-6">
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
        <h1 className="serif text-4xl">Provider Dashboard</h1>
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
            <p className="text-sm text-muted">If you face any issues, complaints, or need mediation with a client, FindOneCampus is here to stand in the middle to avoid issues. WhatsApp us: +234 814 919 3063.</p>
          </div>
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
                  <button onClick={() => setSelectedPlan({ months: 1, price: 7000 })} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${selectedPlan.months === 1 ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted'}`}>1 Month<br/>₦7,000</button>
                  <button onClick={() => setSelectedPlan({ months: 3, price: 18000 })} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${selectedPlan.months === 3 ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted'}`}>3 Months<br/>₦18,000</button>
                  <button onClick={() => setSelectedPlan({ months: 12, price: 60000 })} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${selectedPlan.months === 12 ? 'bg-ink text-white' : 'bg-white border border-black/5 text-muted'}`}>1 Year<br/>₦60,000</button>
                </div>
                <button onClick={handleProUpgrade} disabled={upgrading} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-accent to-[#b38710] shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50">
                  {upgrading ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-crown"></i> Upgrade to Pro</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {provider.membership === 'pro' && (
        <div className="premium-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-6"><i className="fas fa-book-open text-accent text-xl"></i><h2 className="text-xl font-semibold">Pro Member Library</h2></div>
          <div className="space-y-4">
            {proBooks.length === 0 ? <p className="text-muted text-sm">No books in the library yet.</p> : proBooks.map((book: any) => (
              <div key={book.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-paper rounded-xl border border-black/5 gap-4">
                <div className="flex items-center gap-4">
                  {book.cover_config?.image_url ? <img src={book.cover_config.image_url} alt={book.title} className="w-12 h-16 rounded-md object-cover shadow-md" /> : <div className="w-12 h-16 rounded-md shadow-md flex items-center justify-center text-white" style={{ background: book.cover_config?.bg || 'linear-gradient(135deg, #1A1A1A, #C1121F)' }}><i className="fas fa-book-bookmark text-lg"></i></div>}
                  <div><h4 className="font-semibold text-lg">{book.title}</h4><p className="text-sm text-muted">{book.description}</p></div>
                </div>
                <button onClick={() => setActiveBook(book)} className="btn-primary !py-2.5 !px-5 text-sm whitespace-nowrap"><i className="fas fa-eye"></i> Read Book</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleUpdate} className="premium-card p-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-5">
          <div><label className="text-sm font-medium mb-2 block">Full Name</label><input value={form.full_name || ''} onChange={e => setForm({...form, full_name: e.target.value})} className="form-input" /></div>
          <div><label className="text-sm font-medium mb-2 block">Category</label><select value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} className="form-input"><option value="" disabled>Select category</option><option>Technology & IT</option><option>Design & Creatives</option><option>Business & Finance</option><option>Media & Entertainment</option><option>Education & Training</option><option>Health & Wellness</option><option>Beauty & Fashion</option><option>Food & Catering</option><option>Events & Planning</option><option>Home & Repair Services</option><option>Logistics & Transport</option><option>Agriculture & Environment</option><option>Legal & Admin Services</option></select></div>
          <div><label className="text-sm font-medium mb-2 block">Specific Profession</label><input value={form.profession || ''} onChange={e => setForm({...form, profession: e.target.value})} className="form-input" /></div>
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
          <div><label className="text-sm font-medium mb-2 block">Highest Education Level</label><input value={form.education_level || ''} onChange={e => setForm({...form, education_level: e.target.value})} className="form-input" /></div>
          <div><label className="text-sm font-medium mb-2 block">School Attended</label><input value={form.school || ''} onChange={e => setForm({...form, school: e.target.value})} className="form-input" /></div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div><label className="text-sm font-medium mb-2 block">WhatsApp</label><input value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} className="form-input" /></div>
          <div><label className="text-sm font-medium mb-2 block">Country</label><input value={form.country || ''} onChange={e => setForm({...form, country: e.target.value})} className="form-input" /></div>
          <div><label className="text-sm font-medium mb-2 block">City</label><input value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} className="form-input" /></div>
        </div>

        <div className="pt-4 border-t border-black/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink/80">Social Links</h3>
            {provider.membership !== 'pro' && <span className="text-[10px] px-2 py-1 bg-accent/15 text-accent rounded-full font-bold uppercase">Pro Only</span>}
          </div>
          <div className="space-y-4">
            <input value={form.linkedin || ''} onChange={e => setForm({...form, linkedin: e.target.value})} className="form-input disabled:opacity-50 disabled:cursor-not-allowed" placeholder="LinkedIn URL" disabled={provider.membership !== 'pro'} onClick={handleSocialClick} />
            <input value={form.twitter || ''} onChange={e => setForm({...form, twitter: e.target.value})} className="form-input disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Twitter / X URL" disabled={provider.membership !== 'pro'} onClick={handleSocialClick} />
            <input value={form.instagram || ''} onChange={e => setForm({...form, instagram: e.target.value})} className="form-input disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Instagram URL" disabled={provider.membership !== 'pro'} onClick={handleSocialClick} />
            <input value={form.tiktok || ''} onChange={e => setForm({...form, tiktok: e.target.value})} className="form-input disabled:opacity-50 disabled:cursor-not-allowed" placeholder="TikTok URL" disabled={provider.membership !== 'pro'} onClick={handleSocialClick} />
            <input value={form.portfolio || ''} onChange={e => setForm({...form, portfolio: e.target.value})} className="form-input disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Portfolio Website URL" disabled={provider.membership !== 'pro'} onClick={handleSocialClick} />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center !py-4">Save Changes</button>
      </form>

      <style>{`@keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </div>
  )
}