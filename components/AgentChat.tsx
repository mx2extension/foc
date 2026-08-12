'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Provider {
  id: string
  full_name: string
  profession: string
  city: string
  country: string
  whatsapp: string
  verification_status: string
  skills: string[]
}

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'agent'; providers?: Provider[] }[]>([
    { text: "Hi! I'm the FindOneCampus Agent. Tell me what you need. (e.g., 'I need a graphic designer in Abuja')", sender: 'agent' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await res.json()

      if (data.providers && data.providers.length > 0) {
        setMessages(prev => [...prev, { 
          text: `I found ${data.count} provider(s) matching your request. Here are the top results:`, 
          sender: 'agent', 
          providers: data.providers 
        }])
      } else {
        setMessages(prev => [...prev, { 
          text: "I couldn't find a verified provider matching all of those requirements right now. Try searching for a different service or location.", 
          sender: 'agent' 
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the campus right now.", sender: 'agent' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button with Full Logo Fill & Gold Border */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center p-0 hover:scale-105 transition-transform border-[1.5px] border-amber-400 overflow-hidden"
        aria-label="Open FindOneCampus Agent"
      >
        <img 
          src="https://res.cloudinary.com/drnrbfltr/image/upload/v1786366443/84e84f1e-a42c-4792-8548-4d53fffb6708.png" 
          alt="FindOneCampus Bot" 
          className="w-full h-full object-cover" 
        />
      </button>

      {/* Reduced Size Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[calc(100vw-3rem)] sm:w-80 h-[420px] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-ink text-white p-3 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border border-amber-400">
              <img 
                src="https://res.cloudinary.com/drnrbfltr/image/upload/v1786366443/84e84f1e-a42c-4792-8548-4d53fffb6708.png" 
                alt="FindOneCampus Bot" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-none">FindOneCampus Agent</h3>
              <p className="text-[10px] text-white/70 mt-0.5">Discovery & Matching System</p>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-paper">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-black/5 text-ink rounded-bl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
                
                {/* Render Provider Cards if available */}
                {msg.providers && msg.providers.map((provider) => (
                  <div key={provider.id} className="w-full mt-2.5 bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h4 className="font-semibold text-ink text-xs">{provider.full_name}</h4>
                        {provider.verification_status === 'verified' && (
                          <i className="fas fa-check-circle text-blue-500 text-xs"></i>
                        )}
                      </div>
                      <p className="text-[11px] text-primary font-medium mb-1.5">{provider.profession}</p>
                      <p className="text-[10px] text-muted flex items-center gap-1 mb-2.5">
                        <i className="fas fa-location-dot"></i> {provider.city}, {provider.country}
                      </p>
                      
                      {provider.skills && provider.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {provider.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-paper border border-black/5 text-muted">{skill}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-1.5">
                        <Link href={`/providers/${provider.id}`} className="flex-1 text-[11px] text-center py-1.5 rounded-full border border-black/10 hover:bg-paper transition font-medium">
                          View Profile
                        </Link>
                        <a 
                          href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 text-[11px] text-center py-1.5 rounded-full bg-[#25D366] text-white hover:opacity-90 transition font-medium"
                        >
                          <i className="fab fa-whatsapp mr-1"></i> Contact
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start">
                <div className="px-3 py-2 rounded-xl rounded-bl-sm bg-white border border-black/5 shadow-sm">
                  <i className="fas fa-circle-notch fa-spin text-muted text-xs"></i>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-black/5 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you need..."
              className="flex-1 bg-paper border border-black/5 rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-primary"
            />
            <button type="submit" disabled={loading} className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50">
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}
    </>
  )
}