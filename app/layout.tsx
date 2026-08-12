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

export const metadata = {
  title: 'FindOneCampus — The World Is One Big Campus',
  description: 'The world is one giant campus where everyone is learning, building, creating, hiring, serving, teaching and growing.',
  metadataBase: new URL('https://findoncampus.com'),
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'FindOneCampus — The World Is One Big Campus',
    description: 'The world is one giant campus where everyone is learning, building, creating, hiring, serving, teaching and growing.',
    url: 'https://findoncampus.com',
    siteName: 'FindOneCampus',
    images: [{ url: '/favicon.png', width: 1200, height: 630, alt: 'FindOneCampus' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindOneCampus — The World Is One Big Campus',
    description: 'The world is one giant campus where everyone is learning, building, creating, hiring, serving, teaching and growing.',
    images: ['/favicon.png'],
  },
}

declare global {
  interface Window { PaystackPop: any }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-sans">
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
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