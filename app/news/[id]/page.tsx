import { supabase } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import ArticleContent from './ArticleContent'

// Generate dynamic metadata for WhatsApp, Twitter, Facebook link previews
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: article } = await supabase
    .from('news_updates')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://findoncampus.com/news/${article.id}`,
      images: [
        {
          url: article.image_url,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image_url],
    },
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { data: article } = await supabase
    .from('news_updates')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!article) return notFound()

  return <ArticleContent article={article} />
}