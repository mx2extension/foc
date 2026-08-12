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
    { href: '/faq', label: 'FAQ', icon: 'fa-circle-question', bg: 'bg-cyan-600 text-white', external: false },
    { href: 'https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k', label: 'WhatsApp Channel', icon: 'fa-whatsapp', bg: 'bg-green-600 text-white', external: true, buzz: true },
    { href: '/about', label: 'About', icon: 'fa-circle-info', bg: 'bg-purple-600 text-white', external: false },
    { href: '/contact', label: 'Contact', icon: 'fa-envelope', bg: 'bg-zinc-900 text-white', external: false },
    { href: '/become-a-provider', label: 'Become a Provider', icon: 'fa-user-plus', bg: 'bg-indigo-600 text-white', external: false },
    { href: '/provider-login', label: 'Provider Login', icon: 'fa-right-to-bracket', bg: 'bg-rose-600 text-white', external: false },
  ]

  return (
    <>
      {/* Buzz animation style for the WhatsApp channel */}
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
      `}</style>

      {/* Grid container adjusted to accommodate 12 items (4 rows x 3 columns) */}
      <div className="hidden lg:grid absolute right-6 top-12 z-50 grid-cols-3 grid-rows-4 gap-2.5 pointer-events-auto">
        {navItems.map((item, index) => (
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
                className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 ${item.buzz ? 'animate-buzz' : ''}`}
              >
                <i className={`fab ${item.icon} text-base`}></i>
              </a>
            ) : (
              <Link
                href={item.href}
                className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95`}
              >
                <i className={`fas ${item.icon} text-base`}></i>
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  )
}