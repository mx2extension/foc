'use client'
import { useState } from 'react'

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 mt-12 pt-8 border-t border-black/5">
      <span className="text-sm font-medium text-muted">Share this article:</span>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-paper border border-black/5 flex items-center justify-center hover:bg-ink hover:text-white transition">
        <i className="fab fa-twitter text-sm"></i>
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-paper border border-black/5 flex items-center justify-center hover:bg-ink hover:text-white transition">
        <i className="fab fa-facebook-f text-sm"></i>
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-paper border border-black/5 flex items-center justify-center hover:bg-ink hover:text-white transition">
        <i className="fab fa-linkedin-in text-sm"></i>
      </a>
      <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-paper border border-black/5 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition">
        <i className="fab fa-whatsapp text-sm"></i>
      </a>
      <button onClick={handleCopy} className="w-9 h-9 rounded-full bg-paper border border-black/5 flex items-center justify-center hover:bg-ink hover:text-white transition">
        <i className={`fas ${copied ? 'fa-check' : 'fa-link'} text-sm`}></i>
      </button>
    </div>
  )
}