'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img 
            src="https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png" 
            alt="FindOneCampus" 
            className="w-9 h-9 rounded-full object-cover" 
          />
          <span className="serif text-xl sm:text-2xl tracking-tight">FindOneCampus</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-ink/80">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <Link href="/providers" className="hover:text-primary transition">Providers</Link>
          <Link href="/books" className="hover:text-primary transition">Books</Link>
          <Link href="/courses" className="hover:text-primary transition">Courses</Link>
          <Link href="/resources" className="hover:text-primary transition">Resources</Link>
          <Link href="/about" className="hover:text-primary transition">About</Link>
          <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        </div>

        {/* Hamburger Menu Trigger Only */}
        <div className="flex items-center">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            aria-label="Toggle Menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-black/10 bg-white shadow-sm hover:bg-gray-50 transition"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown (Includes the buttons here for mobile users) */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-black/5 px-6 py-6 flex flex-col gap-4 text-lg serif shadow-xl">
          <Link href="/" onClick={() => setMobileOpen(false)} className="hover:text-primary">Home</Link>
          <Link href="/providers" onClick={() => setMobileOpen(false)} className="hover:text-primary">Providers</Link>
          <Link href="/books" onClick={() => setMobileOpen(false)} className="hover:text-primary">Books</Link>
          <Link href="/courses" onClick={() => setMobileOpen(false)} className="hover:text-primary">Courses</Link>
          <Link href="/resources" onClick={() => setMobileOpen(false)} className="hover:text-primary">Resources</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="hover:text-primary">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="hover:text-primary">Contact</Link>
          
          <hr className="border-black/5 my-2" />
          
          <Link href="/become-a-provider" onClick={() => setMobileOpen(false)} className="text-primary text-base font-sans font-medium">
            Become a Provider →
          </Link>
          <Link href="/provider-login" onClick={() => setMobileOpen(false)} className="text-primary text-base font-sans font-medium">
            Provider Login →
          </Link>
        </div>
      )}
    </nav>
  )
}