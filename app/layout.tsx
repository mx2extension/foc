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

// Structured Data to tell Google this is the official brand website
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FindOneCampus",
  "alternateName": "FindOnCampus",
  "url": "https://findoncampus.com",
  "logo": "https://res.cloudinary.com/drnrbfltr/image/upload/v1782561824/5b840287-582b-4833-a671-b7701bc87206.png",
  "description": "FindOneCampus is the global digital marketplace where you can find trusted professionals, freelance service providers, online courses, and ebooks worldwide.",
  "sameAs": [
    "https://www.instagram.com/findonecampus",
    "https://www.linkedin.com/company/findonecampus",
    "https://x.com/findonecampus",
    "https://whatsapp.com/channel/0029Vb75uej0wajzyNM1hN2k"
  ]
}

export const metadata = {
  title: {
    default: 'FindOneCampus (FindOnCampus) — The World Is One Big Campus',
    template: '%s | FindOneCampus'
  },
  description: 'FindOneCampus (also known as FindOnCampus) is the global digital marketplace where you can find trusted professionals, freelance service providers, online courses, and ebooks worldwide.',
  metadataBase: new URL('https://findoncampus.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'x-default': '/',
    },
  },
  robots: {
    index: true,      
    follow: true,      
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }],
    shortcut: ['/favicon.png'],
    apple: [{ url: '/favicon.png', type: 'image/png', sizes: '180x180' }],
  },
  keywords: [
    'FindOneCampus',
    'FindOnCampus',
    'findonecampus.com',
    'findoncampus.com',
    'global professionals', 
    'freelance directory', 
    'digital marketplace', 
    'online courses', 
    'ebooks', 
    'shop online',
    'social media growth', 
    'hire professionals', 
    'find service providers', 
    'worldwide opportunities'
  ],
  openGraph: {
    title: 'FindOneCampus — The World Is One Big Campus',
    description: 'The world is one giant campus where everyone is learning, building, creating, hiring, serving, teaching and growing.',
    url: 'https://findoncampus.com',
    siteName: 'FindOneCampus',
    images: [{ url: '/foc_v3.png', width: 1200, height: 630, alt: 'FindOneCampus' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindOneCampus — The World Is One Big Campus',
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
        
        {/* Inject Structured Data for SEO to outrank social media profiles */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans">
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
        {/* Flutterwave Script */}
        <Script src="https://checkout.flutterwave.com/v3.js" strategy="beforeInteractive" />
        
        <ScrollReveal />
        <div className="lg:hidden">
          <Navbar />
        </div>
        <main className="lg:pt-0 pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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