'use client'
import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`border-2 border-primary-navy border-t-primary-cyan rounded-full ${sizes[size]}`}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary-white/70 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}