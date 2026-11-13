import { Inter, Instrument_Serif } from 'next/font/google'
// @ts-ignore: allow global CSS import in layout
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import PageHeroNav from '@/components/PageHeroNav'
import SocialGrowthPanel from '@/components/SocialGrowthPanel'
import AgentChat from '@/components/AgentChat' 
import FallbackPaymentModal from '@/components/FallbackPaymentModal'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false
})

// Enhanced Combined Organization & WebSite Schema with FindOnCampus as primary
const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://findoncampus.com/#organization",
      "name": "FindOnCampus",
      "alternateName": "FindOneCampus",
      "url": "https://findoncampus.com",
      "logo": "https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-5824-4833-a671-b7701bc87206.png",
      "description": "FindOnCampus is the global digital marketplace where you can find trusted professionals, freelance service providers, online courses, and ebooks worldwide.",
      "sameAs": [
        "https://www.instagram.com/findoncampus",
        "https://www.linkedin.com/company/findoncampus",
        "https://x.com/findoncampus",
        "https://www.whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://findoncampus.com/#website",
      "url": "https://findoncampus.com",
      "name": "FindOnCampus",
      "publisher": {
        "@id": "https://findoncampus.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://findoncampus.com/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}

export const metadata = {
  title: {
    default: 'FindOnCampus (FindOneCampus) — The World Is One Big Campus',
    template: '%s | FindOnCampus'
  },
  description: 'FindOnCampus (also known as FindOneCampus) is the global digital marketplace where you can find trusted professionals, freelance service providers, online courses, and ebooks worldwide.',
  metadataBase: new URL('https://findoncampus.com'),
  alternates: {
    canonical: '/',
    languages: { 'en': '/', 'x-default': '/' },
  },
  robots: {
    index: true,        
    follow: true,        
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }],
    shortcut: ['/favicon.png'],
    apple: [{ url: '/favicon.png', type: 'image/png', sizes: '180x180' }],
  },
  keywords: [
    'FindOnCampus', 'FindOneCampus', 'findoncampus.com', 'findonecampus.com',
    'global professionals', 'freelance directory', 'digital marketplace', 
    'online courses', 'ebooks', 'shop online', 'social media growth', 
    'hire professionals', 'find service providers', 'worldwide opportunities'
  ],
  openGraph: {
    title: 'FindOnCampus — The World Is One Big Campus',
    description: 'The world is one giant campus where everyone is learning, building, creating, hiring, serving, teaching and growing.',
    url: 'https://findoncampus.com',
    siteName: 'FindOnCampus',
    images: [{ url: '/foc_v3.png', width: 1200, height: 630, alt: 'FindOnCampus' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindOnCampus — The World Is One Big Campus',
    description: 'The world is one giant campus where everyone is learning, building, creating, hiring, serving, teaching and growing.',
    images: ['/foc_v3.png'],
  },
}

declare global {
  interface Window { PaystackPop: any; FlutterwaveCheckout: any }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        {/* Inject Combined Schema for SEO & AI Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
        />

        <style>{`
          @keyframes foc-marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes foc-shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .foc-marquee-track {
            display: flex;
            width: max-content;
            animation: foc-marquee 28s linear infinite;
          }
          .foc-marquee-wrapper:hover .foc-marquee-track {
            animation-play-state: paused;
          }
          .foc-premium-bar {
            background: linear-gradient(110deg, #091e16 0%, #103c2a 35%, #1a2639 70%, #091e16 100%);
            box-shadow: 0 4px 20px -2px rgba(9, 30, 22, 0.28);
          }
          .foc-shimmer-sweep {
            animation: foc-shimmer 4.5s ease-in-out infinite;
          }
        `}</style>
      </head>
      <body className="font-sans">
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
        <Script src="https://checkout.flutterwave.com/v3.js" strategy="beforeInteractive" />
        
        <ScrollReveal />
        <div className="lg:hidden">
          <Navbar />
        </div>

        {/* Tightened mobile top offset (pt-[72px]) so the page elements stay high up */}
        <main className="pt-[72px] lg:pt-0">
          {/* Interactive Rich-Gradient WhatsApp Channel Banner */}
          <div className="foc-marquee-wrapper foc-premium-bar text-white overflow-hidden py-2 text-[11px] font-medium border-b border-emerald-400/30 relative z-30">
            {/* Subtle glossy shimmer sweep */}
            <div className="foc-shimmer-sweep pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

            <div className="foc-marquee-track items-center relative z-10">
              {[0, 1].map((idx) => (
                <a
                  key={idx}
                  href="https://www.whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open FindOnCampus Official WhatsApp Channel"
                  className="flex items-center gap-4 px-3 group cursor-pointer"
                >
                  {/* Pulsing Live WhatsApp Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#4ade80] font-bold border border-[#25D366]/40 shadow-inner">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                    </span>
                    <i className="fab fa-whatsapp text-[#25D366] text-xs"></i>
                    Official Channel
                  </span>

                  {/* Distinct Color-Coded Pill Tags */}
                  <span className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-200 border border-amber-400/25 font-semibold">
                    Jobs &amp; Internships
                  </span>

                  <span className="px-2 py-0.5 rounded bg-sky-400/15 text-sky-200 border border-sky-400/25 font-semibold">
                    Tech World Updates
                  </span>

                  <span className="px-2 py-0.5 rounded bg-rose-400/15 text-rose-200 border border-rose-400/25 font-semibold">
                    Master&apos;s &amp; PhD Scholarships
                  </span>

                  <span className="px-2 py-0.5 rounded bg-purple-400/15 text-purple-200 border border-purple-400/25 font-semibold">
                    Global Fellowships
                  </span>

                  {/* High-Contrast Action Button */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-[#04180e] text-[10px] font-extrabold uppercase tracking-wider shadow-md group-hover:from-amber-300 group-hover:to-amber-400 transition-all">
                    Tap to Join <i className="fas fa-external-link-alt text-[9px]"></i>
                  </span>

                  <span className="text-white/20 mx-1">✦</span>
                </a>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 lg:pt-2">
            <PageHeroNav />
          </div>
          {children}
        </main>
        <Footer />
        <SocialGrowthPanel />
        <AgentChat />
        <FallbackPaymentModal />
      </body>
    </html>
  )
}