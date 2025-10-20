'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, CheckCircle } from 'lucide-react'

export default function ConsentModal({ isOpen, onClose, onAgree }) {
  const consentPoints = [
    "I understand this knowledge will be processed by AI systems to extract symbolic meaning",
    "I have the right to share this cultural knowledge",
    "I understand how the chosen license affects usage rights",
    "I consent to community validation of this contribution",
    "I acknowledge this becomes part of a decentralized knowledge graph",
    "I understand I can request removal of sensitive content"
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-primary-navy border border-primary-cyan/20 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-cyan/20 rounded-lg">
                  <Shield className="w-6 h-6 text-primary-cyan" />
                </div>
                <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                  Cultural Consent Agreement
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-primary-white/70 hover:text-primary-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="bg-primary-navy/30 rounded-xl p-4 border border-primary-cyan/10">
                <p className="text-primary-white/80 leading-relaxed">
                  By contributing to AfriVerse, you are helping preserve indigenous knowledge 
                  for future generations. This agreement ensures your rights are protected 
                  while enabling ethical AI development.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary-white">
                  Please confirm you understand:
                </h3>
                <div className="space-y-3">
                  {consentPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-cyan mt-0.5 flex-shrink-0" />
                      <span className="text-primary-white/80 text-sm leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-cyan/10 rounded-xl p-4 border border-primary-cyan/20">
                <h4 className="font-semibold text-primary-cyan mb-2">
                  Cultural Sensitivity
                </h4>
                <p className="text-primary-white/70 text-sm leading-relaxed">
                  Some knowledge may be culturally sensitive. You can mark contributions as 
                  'community-only' or 'research-only' to control access. Community validators 
                  from relevant cultural backgrounds will review all submissions.
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-primary-cyan/20 text-primary-white rounded-lg hover:bg-primary-navy/50 transition-colors"
                >
                  I Need More Time
                </button>
                <button
                  onClick={onAgree}
                  className="flex-1 py-3 gold-gradient text-primary-navy rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  I Understand & Agree
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}