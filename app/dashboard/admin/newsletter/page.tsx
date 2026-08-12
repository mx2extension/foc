'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ManageNewsletter() {
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    const fetchSubscribers = async () => {
      const { data } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })
      setSubscribers(data || [])
    }
    fetchSubscribers()
  }, [])

  const copyEmails = () => {
    const emailList = subscribers.map((s: any) => s.email).join(', ')
    navigator.clipboard.writeText(emailList)
    alert('All emails copied to clipboard!')
  }

  return (
    <div className="max-w-4xl mx-auto py-32 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="serif text-4xl">Newsletter Subscribers</h1>
        {subscribers.length > 0 && (
          <button onClick={copyEmails} className="btn-secondary !py-2.5 !px-5 text-sm">
            <i className="fas fa-copy mr-2"></i> Copy All Emails
          </button>
        )}
      </div>

      <div className="premium-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper border-b border-black/5">
            <tr>
              <th className="p-4 text-left font-medium text-muted">Email Address</th>
              <th className="p-4 text-left font-medium text-muted">Date Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub: any) => (
              <tr key={sub.id} className="border-b border-black/5 hover:bg-paper transition">
                <td className="p-4 font-medium">{sub.email}</td>
                <td className="p-4 text-muted text-xs">
                  {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={2} className="p-12 text-center text-muted">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}