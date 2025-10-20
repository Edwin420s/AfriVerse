import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

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
  title: 'AfriVerse - Preserving Wisdom Through AGI',
  description: 'Where Ancestral Knowledge Meets Artificial Intelligence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-poppins bg-primary-navy text-primary-white`}>
        {children}
      </body>
    </html>
  )
}