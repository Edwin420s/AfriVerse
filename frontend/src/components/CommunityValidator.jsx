'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, MessageCircle, AlertTriangle, User, Shield } from 'lucide-react'

export default function CommunityValidator({ entry, onValidate, onSkip, className = "" }) {
  const [decision, setDecision] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (finalDecision) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onValidate?.({
        entryId: entry.id,
        decision: finalDecision,
        notes: notes.trim() || `Marked as ${finalDecision} by community validator`
      })
      setDecision('')
      setNotes('')
    } catch (error) {
      console.error('Validation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = () => handleSubmit('approved')
  const handleReject = () => handleSubmit('rejected')

  const validationCriteria = [
    {
      title: 'Cultural Accuracy',
      description: 'Does this accurately represent the cultural knowledge?',
      icon: <Shield className="w-4 h-4" />
    },
    {
      title: 'Contributor Rights',
      description: 'Does the contributor have the right to share this?',
      icon: <User className="w-4 h-4" />
    },
    {
      title: 'Sensitivity Check',
      description: 'Is any sensitive or sacred knowledge appropriately protected?',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      title: 'Originality',
      description: 'Is this knowledge original and not duplicated?',
      icon: <MessageCircle className="w-4 h-4" />
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 ${className}`}
    >
      {/* Validation Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-primary-white mb-2">
            Validate Knowledge
          </h3>
          <p className="text-primary-white/70 text-sm">
            Review and validate this cultural knowledge entry
          </p>
        </div>
        <div className="text-primary-cyan">
          <Shield className="w-8 h-8" />
        </div>
      </div>

      {/* Entry Preview */}
      <div className="bg-primary-navy/50 rounded-lg p-4 mb-6 border border-primary-cyan/10">
        <h4 className="font-semibold text-primary-white mb-2">{entry.title}</h4>
        <p className="text-primary-white/70 text-sm mb-3 line-clamp-2">
          {entry.description}
        </p>
        <div className="flex items-center space-x-4 text-xs text-primary-white/50">
          <span>Community: {entry.community}</span>
          <span>Language: {entry.language}</span>
          <span>Type: {entry.type}</span>
        </div>
      </div>

      {/* Validation Criteria */}
      <div className="mb-6">
        <h4 className="font-semibold text-primary-white mb-4">
          Validation Checklist
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {validationCriteria.map((criterion, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-primary-navy/50 rounded-lg border border-primary-cyan/10"
            >
              <div className="text-primary-cyan mt-0.5">
                {criterion.icon}
              </div>
              <div>
                <div className="font-medium text-primary-white text-sm">
                  {criterion.title}
                </div>
                <div className="text-primary-white/70 text-xs">
                  {criterion.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-primary-white mb-2">
          Validation Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes, corrections, or context for your validation decision..."
          rows={3}
          className="w-full p-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white text-sm placeholder-primary-white/30 focus:outline-none focus:border-primary-cyan resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApprove}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{isSubmitting ? 'Approving...' : 'Approve'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReject}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle className="w-5 h-5" />
          <span>{isSubmitting ? 'Rejecting...' : 'Reject'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSkip}
          disabled={isSubmitting}
          className="flex items-center justify-center space-x-2 border border-primary-white/20 text-primary-white hover:bg-primary-white/10 py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Skip</span>
        </motion.button>
      </div>

      {/* Validation Guidance */}
      <div className="mt-6 p-4 bg-primary-cyan/10 rounded-lg border border-primary-cyan/20">
        <h5 className="font-semibold text-primary-cyan text-sm mb-2">
          Validation Guidelines
        </h5>
        <ul className="text-primary-white/70 text-xs space-y-1">
          <li>• Approve if knowledge is culturally accurate and appropriately shared</li>
          <li>• Reject if there are concerns about accuracy, rights, or sensitivity</li>
          <li>• Add notes to help improve the entry or explain your decision</li>
          <li>• Skip if you're unsure or need more context</li>
        </ul>
      </div>
    </motion.div>
  )
}