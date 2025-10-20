'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-navy/30 border border-red-400/20 rounded-2xl p-8 text-center"
          >
            <div className="text-red-400 mb-6">
              <AlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            
            <h1 className="text-2xl font-cormorant font-bold text-primary-white mb-4">
              Unexpected Wisdom Interruption
            </h1>
            
            <p className="text-primary-white/70 mb-2">
              Our AGI systems encountered an unexpected error while processing cultural knowledge.
            </p>
            
            <p className="text-primary-white/50 text-sm mb-6">
              Don't worry - our digital elders are already working to restore harmony.
            </p>

            <div className="space-y-4">
              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center space-x-3 gold-gradient text-primary-navy py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </motion.button>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 border border-primary-cyan text-primary-cyan py-2 rounded-lg hover:bg-primary-cyan/10 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Go Home</span>
                </motion.a>
                
                <motion.a
                  href="mailto:support@afriverse.org"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 border border-primary-white/20 text-primary-white py-2 rounded-lg hover:bg-primary-white/10 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Get Help</span>
                </motion.a>
              </div>
            </div>

            {/* Technical details for development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-primary-white/50 text-sm cursor-pointer">
                  Technical Details (Development)
                </summary>
                <pre className="text-xs text-primary-white/50 mt-2 p-2 bg-primary-navy/50 rounded overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}