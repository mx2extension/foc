'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ShopAd({ placement }: { placement: string }) {
  const [ad, setAd] = useState<any>(null)

  useEffect(() => {
    const fetchAd = async () => {
      const { data } = await supabase
        .from('shop_ads')
        .select('*')
        .eq('is_active', true)
        .eq('placement', placement)
      
      if (data && data.length > 0) {
        // Pick a random ad if there are multiple
        const randomAd = data[Math.floor(Math.random() * data.length)]
        setAd(randomAd)
      }
    }
    fetchAd()
  }, [placement])

  if (!ad) return null

  return (
    <div className="mb-12">
      <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden shadow-lg group">
        <div className="relative aspect-[4/1] w-full bg-paper overflow-hidden">
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute top-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
            Sponsored
          </div>
        </div>
      </a>
    </div>
  )
}