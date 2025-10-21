import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Web3Provider from '@/components/Web3Provider'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})

export const metadata = {
  title: {
    default: 'AfriVerse - Preserving Wisdom Through AGI',
    template: '%s | AfriVerse'
  },
  description: 'Where Ancestral Knowledge Meets Artificial Intelligence - A decentralized platform for preserving African indigenous wisdom using AGI and blockchain technology.',
  keywords: ['AGI', 'African knowledge', 'cultural preservation', 'blockchain', 'AI', 'indigenous wisdom'],
  authors: [{ name: 'AfriVerse Team' }],
  creator: 'AfriVerse',
  publisher: 'AfriVerse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://afriverse.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AfriVerse - Preserving Wisdom Through AGI',
    description: 'Where Ancestral Knowledge Meets Artificial Intelligence',
    url: 'https://afriverse.org',
    siteName: 'AfriVerse',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AfriVerse - Preserving African Indigenous Wisdom',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfriVerse - Preserving Wisdom Through AGI',
    description: 'Where Ancestral Knowledge Meets Artificial Intelligence',
    creator: '@afriverse',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-poppins bg-primary-navy text-primary-white min-h-screen">
        <ErrorBoundary>
          <Web3Provider>
            {children}
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  )
}