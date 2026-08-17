import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  const rowOneItems = (
    <div className="flex items-center justify-around w-full gap-24 opacity-[0.05] text-white select-none">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3m0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4Z"/></svg>
        <span className="text-xs uppercase tracking-widest font-mono">Student Group</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"/></svg>
        <span className="text-xs uppercase tracking-widest font-mono">Networking</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        <span className="text-xs uppercase tracking-widest font-mono">Workshops</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6M10 16.5v-4.38L5.5 10v4.25L10 16.5m4.5-2.25V10L10 12.12v4.38l4.5-2.25z"/></svg>
        <span className="text-xs uppercase tracking-widest font-mono">Campus Tour</span>
      </div>
    </div>
  )

  const rowTwoItems = (
    <div className="flex items-center justify-around w-full gap-28 opacity-[0.04] text-white select-none">
      <div className="flex items-center gap-2">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        <span className="text-xs uppercase tracking-widest font-mono">Innovators</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zm-9 8a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"/></svg>
        <span className="text-xs uppercase tracking-widest font-mono">Global Meetup</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <span className="text-xs uppercase tracking-widest font-mono">Community</span>
      </div>
    </div>
  )

  return (
    <footer className="relative bg-[#0F1115] text-[#EDEDED] pt-24 pb-12 border-t border-white/10 overflow-hidden">
      
      {/* AMBIENT GLOWS */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* SINGLE DETAILED AFRICA MAP SILHOUETTE WITH LAT/LONG GRIDS & RED DOTS */}
      <div className="absolute inset-0 opacity-[0.16] pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <svg className="w-[450px] h-[450px] object-cover scale-150 transform translate-y-6" viewBox="0 0 400 450" fill="none" xmlns="http://www.w3.org/2000/svg">
          
          {/* Latitude & Longitude Grid Lines */}
          <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3">
            <line x1="0" y1="112" x2="400" y2="112" />
            <line x1="0" y1="225" x2="400" y2="225" />
            <line x1="0" y1="337" x2="400" y2="337" />
            <line x1="100" y1="0" x2="100" y2="450" />
            <line x1="200" y1="0" x2="200" y2="450" />
            <line x1="300" y1="0" x2="300" y2="450" />
          </g>

          {/* Accurate Detailed Africa Continent Path */}
          <path 
            d="M180,40 C200,38 230,45 250,60 C265,72 270,90 265,110 C275,120 290,125 305,135 C320,145 330,165 325,185 C320,205 300,225 295,245 C290,265 305,285 300,310 C295,335 280,365 260,390 C240,415 210,430 190,410 C175,395 170,370 165,340 C160,310 150,290 140,270 C130,250 120,240 125,215 C130,190 145,170 140,145 C135,120 125,100 135,80 C145,60 160,42 180,40 Z" 
            fill="currentColor" 
            fillOpacity="0.9" 
          />
          
          {/* Pulsing Red Location Pins across key regions in Africa */}
          {/* North Africa */}
          <g transform="translate(200, 80)">
            <circle cx="0" cy="0" r="10" fill="#C1121F" className="animate-ping opacity-75" />
            <circle cx="0" cy="0" r="4.5" fill="#C1121F" />
          </g>
          {/* West Africa / Nigeria Hub */}
          <g transform="translate(160, 185)">
            <circle cx="0" cy="0" r="14" fill="#C1121F" className="animate-ping opacity-75" style={{ animationDelay: '0.3s' }} />
            <circle cx="0" cy="0" r="5.5" fill="#C1121F" />
          </g>
          {/* East Africa */}
          <g transform="translate(270, 220)">
            <circle cx="0" cy="0" r="10" fill="#C1121F" className="animate-ping opacity-75" style={{ animationDelay: '0.7s' }} />
            <circle cx="0" cy="0" r="4.5" fill="#C1121F" />
          </g>
          {/* Central Africa */}
          <g transform="translate(205, 250)">
            <circle cx="0" cy="0" r="10" fill="#C1121F" className="animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
            <circle cx="0" cy="0" r="4.5" fill="#C1121F" />
          </g>
          {/* Southern Africa */}
          <g transform="translate(210, 360)">
            <circle cx="0" cy="0" r="11" fill="#C1121F" className="animate-ping opacity-75" style={{ animationDelay: '0.9s' }} />
            <circle cx="0" cy="0" r="4.5" fill="#C1121F" />
          </g>
        </svg>
      </div>

      {/* FULL-FOOTER BACKGROUND CROWD/HUMAN ACTIVITY LAYER */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-6 overflow-hidden z-0">
        <div className="animate-footer-row-1 whitespace-nowrap">
          {rowOneItems}
          {rowOneItems}
        </div>
        <div className="animate-footer-row-2 whitespace-nowrap">
          {rowTwoItems}
          {rowTwoItems}
        </div>
        <div className="animate-footer-row-3 whitespace-nowrap">
          {rowOneItems}
          {rowOneItems}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* TOP ROW: NEWSLETTER SECTION */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 mb-16 shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="section-label mb-3 inline-block text-accent">Stay connected</span>
              <h3 className="serif text-3xl md:text-4xl mb-2 text-white">Join the Newsletter</h3>
              <p className="text-gray-400 leading-relaxed">
                Get weekly opportunities, curated resources, and campus updates straight to your inbox.
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* MAIN FOOTER COLUMNS */}
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png" alt="FindOneCampus" className="w-9 h-9 rounded-full border border-white/20" />
              <span className="serif text-2xl text-white">FindOneCampus</span>
            </Link>
            <p className="serif-italic text-2xl text-gray-300 leading-snug mb-6 max-w-sm">
              The world is one big campus. Welcome to the campus without walls.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition"><i className="fab fa-whatsapp"></i></a>
              <a href="https://www.linkedin.com/company/findonecampus" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition"><i className="fab fa-linkedin-in"></i></a>
              <a href="mailto:info5onecampus@gmail.com" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition"><i className="fas fa-envelope"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition" title="X (Twitter)">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <h4 className="font-semibold mb-5 text-sm text-white tracking-wider">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/providers" className="hover:text-white transition">Providers</Link></li>
              <li><Link href="/books" className="hover:text-white transition">Books</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">Courses</Link></li>
              <li><Link href="/resources" className="hover:text-white transition">Resources</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold mb-5 text-sm text-white tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/become-a-provider" className="hover:text-white transition">Become a Provider</Link></li>
              <li><Link href="/provider-login" className="hover:text-white transition">Provider Login</Link></li>
              <li><Link href="/news" className="hover:text-white transition">News & Updates</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-semibold mb-5 text-sm text-white tracking-wider">Legal & Help</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/community" className="hover:text-white transition">Community</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/10 mb-8"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} FindOneCampus. The world is one big campus.</p>
          <p className="flex items-center gap-2">
            <span>Crafted with care</span>
            <span className="w-1 h-1 rounded-full bg-accent"></span>
            <span>Made for the curious</span>
          </p>
        </div>
      </div>
    </footer>
  )
}