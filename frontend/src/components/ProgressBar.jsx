'use client'
import { motion } from 'framer-motion'

export default function ProgressBar({ 
  current, 
  total, 
  label = '', 
  showPercentage = false,
  color = 'primary-cyan',
  className = '' 
}) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  const colorClasses = {
    'primary-cyan': 'bg-primary-cyan',
    'primary-gold': 'bg-primary-gold',
    'green': 'bg-green-500',
    'red': 'bg-red-500',
    'yellow': 'bg-yellow-500'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Labels */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && (
            <span className="text-primary-white/70">{label}</span>
          )}
          {showPercentage && (
            <span className="text-primary-white/70">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-primary-navy/50 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClasses[color] || colorClasses['primary-cyan']}`}
        />
      </div>

      {/* Count */}
      <div className="flex justify-between items-center text-xs text-primary-white/50">
        <span>{current} of {total}</span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
    </div>
  )
}