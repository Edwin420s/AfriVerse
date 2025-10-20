'use client'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SubmitWizard from '@/components/SubmitWizard'

export default function SubmitPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">
              Share <span className="gradient-text">Wisdom</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-2xl mx-auto">
              Contribute to the preservation of indigenous knowledge. Your voice helps build a culturally-rich AGI future.
            </p>
          </motion.div>

          <SubmitWizard />
        </div>
      </main>

      <Footer />
    </div>
  )
}