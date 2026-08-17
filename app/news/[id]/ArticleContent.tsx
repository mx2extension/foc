'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ArticleContent({ article }: { article: any }) {
  const [toast, setToast] = useState<string | null>(null)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out "${article.title}" on FindOneCampus!`

  return (
    <div className="py-32 relative">
      <div className="orb" style={{ width: '500px', height: '500px', background: 'rgba(193,18,31,0.05)', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      <article className="relative max-w-3xl mx-auto px-6 lg:px-10 z-10">
        <Link href="/news" className="mb-12 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition">
          <i className="fas fa-arrow-left text-xs"></i> Back to all news
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted uppercase tracking-wider mb-6">
          <span className="text-primary font-medium">News</span>
          <span className="w-1 h-1 rounded-full bg-muted"></span>
          <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <h1 className="serif mb-6" style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>{article.title}</h1>
        <p className="text-xl text-muted leading-relaxed mb-10 font-light">{article.excerpt}</p>
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-black/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">{article.author.charAt(0)}</div>
          <div><div className="font-semibold">{article.author}</div><div className="text-sm text-muted">FindOneCampus Editorial</div></div>
        </div>
        {article.image_url && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Render HTML Content Safely */}
        <div 
          className="prose prose-lg max-w-none text-lg text-ink/80 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />

        {/* Share Buttons */}
        <div className="border-t border-black/5 pt-8 mt-12">
          <h3 className="text-sm font-semibold text-ink/80 mb-4">Share this article</h3>
          <div className="flex items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-twitter"></i></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition"><i className="fab fa-whatsapp"></i></a>
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); setToast('Link copied!'); setTimeout(() => setToast(null), 3000) }} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-ink hover:text-white transition"><i className="fas fa-link"></i></button>
          </div>
        </div>
      </article>
      
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-[slideUp_0.3s_ease]">
          <div className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white text-sm font-medium bg-green-600"><i className="fas fa-check-circle text-lg"></i><span>{toast}</span></div>
        </div>
      )}
      <style>{`@keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>
    </div>
  )
}