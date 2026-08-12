import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import ShareButtons from '@/components/ShareButtons'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { data: article } = await supabase
    .from('news_updates')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!article) return notFound()

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

        <h1 className="serif mb-6" style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          {article.title}
        </h1>
        
        <p className="text-xl text-muted leading-relaxed mb-10 font-light">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-black/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
            {article.author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{article.author}</div>
            <div className="text-sm text-muted">FindOneCampus Editorial</div>
          </div>
        </div>

        {article.image_url && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-lg text-ink/80 leading-relaxed space-y-6">
          {article.content.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <ShareButtons title={article.title} />
      </article>
    </div>
  )
}