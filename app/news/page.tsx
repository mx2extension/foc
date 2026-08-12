import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default async function NewsPage() {
  const { data: articles } = await supabase
    .from('news_updates')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium mb-6">
            <span className="w-6 h-px bg-primary"></span>
            The Campus Blog
            <span className="w-6 h-px bg-primary"></span>
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            News & <span className="serif-italic gradient-text">Updates.</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles?.map((article: any) => (
            <Link href={`/news/${article.id}`} key={article.id} className="premium-card overflow-hidden group">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={article.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop'} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted mb-3">
                  <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="w-1 h-1 rounded-full bg-muted"></span>
                  <span>{article.author}</span>
                </div>
                <h3 className="serif text-2xl mb-3 leading-tight group-hover:text-primary transition">{article.title}</h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-4">{article.excerpt}</p>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-2">
                  Read article <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </span>
              </div>
            </Link>
          ))}
          
          {articles?.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted">No news articles yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}