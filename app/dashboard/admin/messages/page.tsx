'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      setMessages(data || [])
    }
    fetchMessages()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <h1 className="serif text-4xl mb-8">Contact Messages</h1>
      <div className="space-y-4">
        {messages.map((m: any) => (
          <div key={m.id} className="premium-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{m.subject}</h3>
                <p className="text-sm text-muted">{m.full_name} • {m.email}</p>
              </div>
              <span className="text-xs text-muted">{new Date(m.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm text-ink/80 leading-relaxed">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-muted text-center py-20">No messages yet.</p>}
      </div>
    </div>
  )
}