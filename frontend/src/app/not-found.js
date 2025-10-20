'use client'
import { motion } from 'framer-motion'
import { Home, Search, Compass } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated 404 */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl font-cormorant font-bold gradient-text mb-4"
            >
              404
            </motion.div>
            
            <h1 className="text-3xl font-cormorant font-bold text-primary-white mb-4">
              Wisdom Not Found
            </h1>
            
            <p className="text-primary-white/70 mb-8 text-lg">
              The cultural knowledge you're looking for seems to have wandered off into the digital savannah.
            </p>

            <div className="space-y-4">
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center space-x-3 gold-gradient text-primary-navy py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Return Home</span>
              </motion.a>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.a
                  href="/explore"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 border border-primary-cyan text-primary-cyan py-3 rounded-lg hover:bg-primary-cyan/10 transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore</span>
                </motion.a>
                
                <motion.a
                  href="/submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 border border-primary-gold text-primary-gold py-3 rounded-lg hover:bg-primary-gold/10 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Contribute</span>
                </motion.a>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-primary-white/30 text-sm"
            >
              <p>Lost in the digital realm of ancestral wisdom...</p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}