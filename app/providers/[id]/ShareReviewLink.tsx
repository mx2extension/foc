'use client'

import { useState } from 'react'

export default function ShareReviewLink({ providerName, providerId }: { providerName: string; providerId: string }) {
  const [copied, setCopied] = useState(false)

  const reviewUrl = `https://www.findoncampus.com/providers/${providerId}/reviews#write-review`
  const shareText = encodeURIComponent(`Hello! I hope you were satisfied with my services on FindOneCampus. Please take a moment to drop a review and rating for me here: ${reviewUrl}`)
  const whatsappShareLink = `https://wa.me/?text=${shareText}`

  function handleCopy() {
    navigator.clipboard.writeText(reviewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="premium-card p-5 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
        <i className="fas fa-bullhorn text-primary"></i> Get More Reviews
      </h4>
      <p className="text-[11px] text-muted leading-relaxed">
        Share your direct review link with clients via WhatsApp or social media to build your reputation on FindOneCampus.
      </p>

      <div className="space-y-2 pt-1">
        <button
          onClick={handleCopy}
          className="w-full py-2 px-3 rounded-xl bg-paper border border-black/10 text-xs font-medium text-ink hover:border-primary transition flex items-center justify-center gap-2"
        >
          <i className={copied ? "fas fa-check text-green-600" : "far fa-copy text-muted"}></i>
          {copied ? 'Review Link Copied!' : 'Copy Review Link'}
        </button>

        <a
          href={whatsappShareLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition flex items-center justify-center gap-2"
        >
          <i className="fab fa-whatsapp text-sm"></i> Share via WhatsApp
        </a>
      </div>
    </div>
  )
}