import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://findoncampus.com' 

  // Static routes
  const staticRoutes = [
    '', '/providers', '/books', '/courses', '/resources', '/news', '/about', '/contact', '/faq', '/community', '/privacy', '/become-a-provider', '/news', '/terms', '/provider-login'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Provider routes
  const { data: providers } = await supabase.from('providers').select('id').eq('is_approved', true)
  const providerRoutes = providers?.map((p) => ({
    url: `${baseUrl}/providers/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  // Dynamic News routes
  const { data: news } = await supabase.from('news_updates').select('id')
  const newsRoutes = news?.map((n) => ({
    url: `${baseUrl}/news/${n.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  return [...staticRoutes, ...providerRoutes, ...newsRoutes]
}