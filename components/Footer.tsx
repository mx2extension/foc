import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-paper pt-20 pb-10 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* TOP ROW: NEWSLETTER SECTION */}
        <div className="bg-white/60 border border-black/5 rounded-3xl p-8 lg:p-12 mb-16 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="section-label mb-3 inline-block">Stay connected</span>
              <h3 className="serif text-3xl md:text-4xl mb-2">Join the Newsletter</h3>
              <p className="text-muted leading-relaxed">
                Get weekly opportunities, curated resources, and campus updates straight to your inbox.
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* MAIN FOOTER COLUMNS (3 COLUMNS OF LINKS) */}
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <img src="https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png" alt="FindOneCampus" className="w-9 h-9 rounded-full" />
              <span className="serif text-2xl">FindOneCampus</span>
            </Link>
            <p className="serif-italic text-2xl text-ink/70 leading-snug mb-6 max-w-sm">
              The world is one big campus. Welcome to the campus without walls.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition"><i className="fab fa-whatsapp"></i></a>
              <a href="https://www.linkedin.com/company/findonecampus" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition"><i className="fab fa-linkedin-in"></i></a>
              <a href="mailto:info5onecampus@gmail.com" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition"><i className="fas fa-envelope"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition" title="X (Twitter)">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <h4 className="font-semibold mb-5 text-sm">Explore</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link href="/providers" className="hover:text-primary transition">Providers</Link></li>
              <li><Link href="/books" className="hover:text-primary transition">Books</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition">Courses</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition">Resources</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold mb-5 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="/about" className="hover:text-primary transition">About</Link></li>
              <li><Link href="/become-a-provider" className="hover:text-primary transition">Become a Provider</Link></li>
              <li><Link href="/provider-login" className="hover:text-primary transition">Provider Login</Link></li>
              <li><Link href="/news" className="hover:text-primary transition">News & Updates</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-semibold mb-5 text-sm">Legal & Help</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
              <li><Link href="/community" className="hover:text-primary transition">Community</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent mb-8"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} FindOneCampus. The world is one big campus.</p>
          <p className="flex items-center gap-2">
            <span>Crafted with care</span>
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            <span>Made for the curious</span>
          </p>
        </div>
      </div>
    </footer>
  )
}