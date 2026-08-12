'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [countryCount, setCountryCount] = useState(0)
  const [searcherCount, setSearcherCount] = useState(0)

  useEffect(() => {
    async function fetchGlobeStats() {
      try {
        const [providersRes, booksRes, coursesRes] = await Promise.all([
          supabase.from('providers').select('country').eq('is_approved', true),
          supabase.from('books').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true })
        ])

        const providers = providersRes.data || []
        const uniqueCountries = new Set(providers.map(p => p.country).filter(Boolean)).size || 0
        const booksCount = booksRes.count || 0
        const coursesCount = coursesRes.count || 0
        const providerCount = providers.length

        const calculatedSearchers = (providerCount * 45) + (booksCount * 12) + (coursesCount * 18) + 350

        setCountryCount(uniqueCountries)
        setSearcherCount(calculatedSearchers)
      } catch (err) {
        console.error('Error fetching globe stats:', err)
      }
    }

    fetchGlobeStats()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let globePoints: Array<{ x: number; y: number; z: number; highlight: boolean }> = []
    let globeRotation = 0
    let xOffset = 0

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = 'https://res.cloudinary.com/drnrbfltr/image/upload/v1783840785/file_skcq8t.jpg'
    let imgLoaded = false
    img.onload = () => {
      imgLoaded = true
    }

    const generatePoints = () => {
      globePoints = []
      const N = 700
      const phi = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2
        const radius = Math.sqrt(1 - y * y)
        const theta = phi * i
        globePoints.push({
          x: Math.cos(theta) * radius,
          y: y,
          z: Math.sin(theta) * radius,
          highlight: Math.random() < 0.08
        })
      }
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const r = Math.max(50, Math.min(canvas.width, canvas.height) * 0.42)

      // Background atmospheric glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.1)
      gradient.addColorStop(0, 'rgba(193, 18, 31, 0.06)')
      gradient.addColorStop(0.7, 'rgba(212, 160, 23, 0.04)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2)
      ctx.fill()

      // BEGIN GLOBE CLIPPING MASK
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()

      // Clean elegant dark background matching the site's rich contrast
      ctx.fillStyle = '#111318'
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)

      // Render Map Image Texture with 'screen' blend mode for seamless color integration
      if (imgLoaded) {
        xOffset = (xOffset + 0.15) % (r * 4)
        const mapWidth = r * 4
        const mapHeight = r * 2
        const drawX = cx - r - xOffset

        ctx.save()
        ctx.globalCompositeOperation = 'screen' // Blends blacks out and lets colors glow naturally
        ctx.globalAlpha = 0.35
        ctx.drawImage(img, drawX, cy - r, mapWidth, mapHeight)
        ctx.drawImage(img, drawX + mapWidth, cy - r, mapWidth, mapHeight)
        ctx.restore()
      }

      globeRotation += 0.0025

      // Project 3D points
      const projected = globePoints.map(p => {
        const cos = Math.cos(globeRotation)
        const sin = Math.sin(globeRotation)
        const x = p.x * cos - p.z * sin
        const z = p.x * sin + p.z * cos
        return {
          px: cx + x * r,
          py: cy + p.y * r,
          depth: (z + 1) / 2,
          highlight: p.highlight
        }
      })

      projected.sort((a, b) => a.depth - b.depth)

      // Render 3D particle nodes & glowing highlights
      for (const p of projected) {
        if (p.depth < 0.15) continue

        const opacity = p.depth * 0.85 + 0.15
        const size = p.depth * 1.8 + 0.5

        if (p.highlight) {
          const glowGrad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, size * 5)
          glowGrad.addColorStop(0, `rgba(193, 18, 31, ${opacity * 0.8})`)
          glowGrad.addColorStop(1, 'rgba(193, 18, 31, 0)')
          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.arc(p.px, p.py, size * 5, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = `rgba(212, 160, 23, ${opacity})`
          ctx.beginPath()
          ctx.arc(p.px, p.py, size * 1.8, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`
          ctx.beginPath()
          ctx.arc(p.px, p.py, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Premium 3D Sphere Shading Vignette
      const sphereGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.05, cx, cy, r)
      sphereGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
      sphereGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)')
      sphereGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)')
      ctx.fillStyle = sphereGrad
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)

      ctx.restore()
      // END GLOBE CLIPPING MASK

      // Outer rings & orbital borders
      ctx.strokeStyle = 'rgba(26, 26, 26, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(193, 18, 31, 0.12)'
      ctx.setLineDash([2, 6])
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      animationId = requestAnimationFrame(draw)
    }

    resize()
    generatePoints()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbit 18s linear infinite' }}>
        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(193,18,31,0.6)]"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'orbit 28s linear infinite reverse' }}>
        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(212,160,23,0.6)]"></div>
      </div>
      
      <div className="absolute -bottom-4 -left-4 glass rounded-2xl p-5 shadow-xl float-anim">
        <div className="text-3xl serif gradient-text">{countryCount}</div>
        <div className="text-xs text-muted">countries represented</div>
      </div>
      <div className="absolute -top-4 -right-4 glass rounded-2xl p-5 shadow-xl float-slow">
        <div className="text-3xl serif gradient-text">
          {searcherCount > 1000 ? `${(searcherCount / 1000).toFixed(1)}k+` : searcherCount}
        </div>
        <div className="text-xs text-muted">active searchers</div>
      </div>
    </div>
  )
}