'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PageHeroNav() {
  const pathname = usePathname()

  // Do not display on the home page
  if (pathname === '/') {
    return null
  }

  const navItems = [
    { href: '/', label: 'Home', icon: 'fa-house', bg: 'bg-slate-800 text-white', external: false },
    { href: '/providers', label: 'Providers', icon: 'fa-user', bg: 'bg-red-600 text-white', external: false },
    { href: '/books', label: 'Books', icon: 'fa-book', bg: 'bg-amber-600 text-white', external: false },
    { href: '/courses', label: 'Courses', icon: 'fa-graduation-cap', bg: 'bg-emerald-600 text-white', external: false },
    { href: '/resources', label: 'Resources', icon: 'fa-briefcase', bg: 'bg-blue-600 text-white', external: false },
    { href: '/news', label: 'News & Updates', icon: 'fa-newspaper', bg: 'bg-teal-600 text-white', external: false },
    // Combined buzz and glow into a single animation class
    { href: '/social-growth', label: 'Social Growth', icon: 'fa-rocket', bg: 'bg-gradient-to-r from-[#D4A017] to-[#C1121F] text-white', external: false, buzzGlow: true },
    { href: 'https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k', label: 'WhatsApp Channel', icon: 'fa-whatsapp', bg: 'bg-green-600 text-white', external: true, buzz: true },
    { href: '/about', label: 'About', icon: 'fa-circle-info', bg: 'bg-purple-600 text-white', external: false },
    { href: '/contact', label: 'Contact', icon: 'fa-envelope', bg: 'bg-zinc-900 text-white', external: false },
    { href: '/become-a-provider', label: 'Become a Provider', icon: 'fa-user-plus', bg: 'bg-indigo-600 text-white', external: false },
    { href: '/provider-login', label: 'Provider Login', icon: 'fa-right-to-bracket', bg: 'bg-rose-600 text-white', external: false },
  ]

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
        
        /* Combined animation to prevent property conflicts */
        @keyframes buzz-glow {
          0% { transform: rotate(0deg) scale(1); box-shadow: 0 0 5px 0 rgba(212, 160, 23, 0.4); }
          15% { transform: rotate(-14deg) scale(1.08); box-shadow: 0 0 12px 2px rgba(193, 18, 31, 0.5); }
          30% { transform: rotate(14deg) scale(1.08); box-shadow: 0 0 15px 3px rgba(193, 18, 31, 0.6); }
          45% { transform: rotate(-10deg) scale(1.05); box-shadow: 0 0 12px 2px rgba(193, 18, 31, 0.5); }
          60% { transform: rotate(10deg) scale(1.05); box-shadow: 0 0 15px 3px rgba(193, 18, 31, 0.6); }
          75% { transform: rotate(-5deg) scale(1.02); box-shadow: 0 0 8px 1px rgba(212, 160, 23, 0.4); }
          100% { transform: rotate(0deg) scale(1); box-shadow: 0 0 5px 0 rgba(212, 160, 23, 0.4); }
        }
        .animate-buzz-glow {
          animation: buzz-glow 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Grid container adjusted to accommodate 12 items (4 rows x 3 columns) */}
      <div className="hidden lg:grid absolute right-6 top-12 z-50 grid-cols-3 grid-rows-4 gap-2.5 pointer-events-auto">
        {navItems.map((item: any, index) => {
          // Determine the correct animation class
          const animationClass = item.buzzGlow ? 'animate-buzz-glow' : item.buzz ? 'animate-buzz' : '';

          return (
            <div key={index} className="relative group flex items-center justify-end">
              {/* Tooltip Label on Hover */}
              <span className="absolute right-14 px-3 py-1 bg-black/80 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                {item.label}
              </span>
              
              {/* Navigation Icon Button */}
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shadow-md ${animationClass ? '' : 'transition-transform hover:scale-105 active:scale-95'} ${animationClass}`}
                >
                  <i className={`fab ${item.icon} text-base`}></i>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shadow-md ${animationClass ? '' : 'transition-transform hover:scale-105 active:scale-95'} ${animationClass}`}
                >
                  <i className={`fas ${item.icon} text-base`}></i>
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}