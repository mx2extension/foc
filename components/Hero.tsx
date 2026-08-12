'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Typing animation states
  const [count, setCount] = useState(0)
  const part1 = "The World Is"
  const part2 = "ne Big" // The 'O' is replaced by the globe icon
  const part3 = " Campus."
  const totalLength = part1.length + part2.length + part3.length

  useEffect(() => {
    // Typing effect logic (90ms per character)
    if (count < totalLength) {
      const timer = setTimeout(() => setCount(c => c + 1), 90)
      return () => clearTimeout(timer)
    }
  }, [count, totalLength])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string; opacity: number }> = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles = []
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.8 + 0.4,
          color: Math.random() < 0.25 ? '193, 18, 31' : Math.random() < 0.4 ? '212, 160, 23' : '26, 26, 26',
          opacity: Math.random() * 0.3 + 0.08
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.strokeStyle = `rgba(193, 18, 31, ${(1 - dist / 120) * 0.06})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      {/* Buzz and Glow animation styles */}
      <style jsx global>{`
        @keyframes buzz {
          0% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-14deg) scale(1.08); }
          30% { transform: rotate(14deg) scale(1.08); }
          45% { transform: rotate(-10deg) scale(1.05); }
          60% { transform: rotate(10deg) scale(1.05); }
          75% { transform: rotate(-5deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .animate-buzz {
          animation: buzz 1.8s ease-in-out infinite;
        }
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 5px 0 rgba(212, 160, 23, 0.4); }
          50% { box-shadow: 0 0 20px 5px rgba(212, 160, 23, 0.8); }
          100% { box-shadow: 0 0 5px 0 rgba(212, 160, 23, 0.4); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />
        
        {/* Interactive Floating Quick Nav Dock */}
        <div className="absolute top-[12%] right-[5%] hidden lg:grid grid-cols-3 gap-3 z-50 pointer-events-auto">
          {[
            { href: '/providers', icon: 'fa-user-tie', label: 'Providers', bg: 'bg-primary text-white shadow-primary/30', external: false },
            { href: '/books', icon: 'fa-book-open', label: 'Books', bg: 'bg-amber-600 text-white shadow-amber-600/30', external: false },
            { href: '/courses', icon: 'fa-graduation-cap', label: 'Courses', bg: 'bg-emerald-600 text-white shadow-emerald-600/30', external: false },
            { href: '/resources', icon: 'fa-toolbox', label: 'Resources', bg: 'bg-indigo-600 text-white shadow-indigo-600/30', external: false },
            { href: '/news', icon: 'fa-newspaper', label: 'News & Updates', bg: 'bg-teal-600 text-white shadow-teal-600/30', external: false },
            { href: '/faq', icon: 'fa-circle-question', label: 'FAQ', bg: 'bg-cyan-600 text-white shadow-cyan-600/30', external: false },
            { href: 'https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k', icon: 'fa-whatsapp', label: 'WhatsApp Channel', bg: 'bg-green-600 text-white shadow-green-600/30', external: true, buzz: true },
            { 
              href: 'https://x.com/findonecampus', 
              label: 'X (Twitter)', 
              bg: 'bg-neutral-900 text-white shadow-neutral-950/30', 
              external: true, 
              customSvg: (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              )
            },
            { href: '/about', icon: 'fa-info-circle', label: 'About', bg: 'bg-purple-600 text-white shadow-purple-600/30', external: false },
            { href: '/contact', icon: 'fa-envelope', label: 'Contact', bg: 'bg-zinc-900 text-white shadow-zinc-950/30', external: false },
            { href: '/become-a-provider', icon: 'fa-user-plus', label: 'Become a Provider', bg: 'bg-blue-600 text-white shadow-blue-600/30', external: false },
            { href: '/provider-login', icon: 'fa-right-to-bracket', label: 'Provider Login', bg: 'bg-rose-600 text-white shadow-rose-600/30', external: false },
          ].map((item, index) => (
            <div key={index} className="relative group flex items-center justify-center">
              {/* Sliding Tooltip Label on Hover */}
              <span className="absolute bottom-full mb-2 px-3 py-1 rounded-xl bg-ink text-white text-[11px] font-medium tracking-wide opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-50">
                {item.label}
              </span>
              
              {/* Enlarged Colorful Animated Icon Button */}
              {item.external ? (
                <a 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${item.bg} ${item.buzz ? 'animate-buzz' : ''}`}
                >
                  {item.customSvg ? item.customSvg : <i className={`fab ${item.icon}`}></i>}
                </a>
              ) : (
                <Link 
                  href={item.href} 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${item.bg}`}
                >
                  <i className={`fas ${item.icon}`}></i>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full z-20 pointer-events-none">
          <div className="reveal visible mb-8 flex items-center gap-3 pointer-events-auto">
            <span className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-primary font-medium">
              <span className="w-6 h-px bg-primary"></span>
              Welcome to the campus without walls
            </span>
          </div>

          {/* TYPING ANIMATION HEADLINE WITH GLOBE */}
          <h1 className="serif reveal visible pointer-events-auto" style={{ fontSize: 'clamp(48px, 10vw, 132px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            {count <= part1.length ? (
              part1.slice(0, count)
            ) : (
              <>
                {part1}<br />
                <span className="serif-italic gradient-text inline-flex items-center" style={{ paddingBottom: '0.1em' }}>
                  {/* Spinning Globe Icon replacing the 'O' */}
                  <i className="fas fa-earth-americas inline-block text-primary animate-spin mr-2" style={{ animationDuration: '8s', fontSize: '0.9em' }}></i>
                  {count <= part1.length + part2.length ? (
                    part2.slice(0, count - part1.length)
                  ) : (
                    part2
                  )}
                </span>
                {count > part1.length + part2.length ? (
                  part3.slice(0, count - part1.length - part2.length)
                ) : null}
              </>
            )}
            {/* Blinking Cursor */}
            <span className="inline-block w-[4px] h-[0.7em] bg-primary ml-2 align-middle animate-pulse"></span>
          </h1>

          <div className="mt-14 grid lg:grid-cols-12 gap-10 items-end pointer-events-auto">
            <div className="lg:col-span-7 reveal visible">
              <p className="text-xl md:text-2xl text-ink/70 leading-relaxed mb-6 font-light">
                Every day, people search.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-base md:text-lg text-muted leading-relaxed">
                <p>Some search for <span className="text-ink">knowledge</span>.</p>
                <p>Some search for <span className="text-ink">trusted professionals</span>.</p>
                <p>Some search for <span className="text-ink">clients</span>.</p>
                <p>Some search for <span className="text-ink">books</span>.</p>
                <p>Some search for <span className="text-ink">courses</span>.</p>
                <p>Some search for <span className="text-ink">better opportunities</span>.</p>
                <p>Some search for <span className="text-ink">answers</span>.</p>
                <p>Some search for <span className="text-ink">growth</span>.</p>
              </div>
              <p className="mt-8 text-lg text-ink/80 leading-relaxed max-w-2xl">
                FindOneCampus exists because we believe the world itself is one giant campus where everyone is learning, building, creating, hiring, serving, teaching and growing.
              </p>
            </div>

            <div className="lg:col-span-5 reveal visible flex flex-col gap-4 lg:items-end">
              <Link href="/providers" className="btn-primary">
                <span>Explore Providers</span>
                <i className="fas fa-arrow-right text-xs"></i>
              </Link>
              <Link href="/books" className="btn-secondary">
                <i className="fas fa-book text-xs"></i>
                <span>Browse Books</span>
              </Link>

              {/* NEW BUZZING SMM BUTTON */}
              <button 
                onClick={() => window.dispatchEvent(new Event('toggle-smm-panel'))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-accent to-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-glow-pulse"
              >
                <i className="fas fa-rocket animate-buzz"></i> 
                <span>Boost Social Media Followers</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}