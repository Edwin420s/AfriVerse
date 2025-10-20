'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronDown, ChevronRight, Code, Eye } from 'lucide-react'

export default function ReasoningTrace({ atoms }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState('friendly') // 'friendly' or 'technical'

  const friendlyExplanations = {
    "plant": "Identified as a plant entity",
    "property": "Describes characteristics or qualities", 
    "relation": "Shows connections between concepts",
    "treats": "Used for healing or curing",
    "found_in": "Geographical or cultural origin"
  }

  const getFriendlyExplanation = (atom) => {
    if (atom.type === 'plant') {
      return `Recognized as a plant called "${atom.labels?.[0] || atom.id}"`
    }
    if (atom.type === 'property') {
      return `Has the property of being ${atom.predicate}`
    }
    if (atom.type === 'relation') {
      return `${atom.subject} ${atom.predicate} ${atom.object}`
    }
    return friendlyExplanations[atom.type] || `Processed as ${atom.type}`
  }

  return (
    <div className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-primary-navy/40 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-primary-cyan" />
          <div>
            <h3 className="text-xl font-semibold text-primary-white">
              AI Reasoning Process
            </h3>
            <p className="text-sm text-primary-white/70">
              How the AI understood and structured this knowledge
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-primary-cyan" />
        ) : (
          <ChevronRight className="w-5 h-5 text-primary-cyan" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-primary-cyan/20"
          >
            {/* View Mode Toggle */}
            <div className="p-4 bg-primary-navy/50 border-b border-primary-cyan/10">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('friendly')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    viewMode === 'friendly'
                      ? 'gold-gradient text-primary-navy'
                      : 'text-primary-white/70 hover:text-primary-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Friendly View</span>
                </button>
                <button
                  onClick={() => setViewMode('technical')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    viewMode === 'technical'
                      ? 'cyan-gradient text-primary-navy'
                      : 'text-primary-white/70 hover:text-primary-white'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>Technical View</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {viewMode === 'friendly' ? (
                <>
                  <div className="bg-primary-cyan/10 rounded-lg p-4 border border-primary-cyan/20">
                    <h4 className="font-semibold text-primary-cyan mb-3">
                      Natural Language Understanding
                    </h4>
                    <p className="text-primary-white/80 text-sm leading-relaxed">
                      The AI analyzed the spoken words and identified key concepts, relationships, 
                      and cultural context. Here's how it structured the knowledge:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {atoms.map((atom, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-primary-navy/50 rounded-lg border border-primary-cyan/10"
                      >
                        <div className="w-2 h-2 bg-primary-cyan rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="text-primary-white font-medium mb-1">
                            {getFriendlyExplanation(atom)}
                          </div>
                          {viewMode === 'technical' && (
                            <code className="text-xs text-primary-white/50 bg-primary-navy rounded px-2 py-1">
                              {JSON.stringify(atom)}
                            </code>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-primary-gold/10 rounded-lg p-4 border border-primary-gold/20">
                    <h4 className="font-semibold text-primary-gold mb-2">
                      Cultural Intelligence
                    </h4>
                    <p className="text-primary-white/80 text-sm">
                      The system recognized local names (mwarubaini) and connected them to 
                      scientific knowledge, preserving cultural context while enabling 
                      modern understanding.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-primary-cyan/10 rounded-lg p-4 border border-primary-cyan/20">
                    <h4 className="font-semibold text-primary-cyan mb-2">
                      Symbolic Representation
                    </h4>
                    <p className="text-primary-white/80 text-sm">
                      Knowledge encoded as MeTTa-compatible atoms for AGI reasoning:
                    </p>
                  </div>

                  <div className="font-mono text-sm space-y-2">
                    {atoms.map((atom, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-primary-navy/50 rounded border border-primary-cyan/10"
                      >
                        <div className="text-primary-cyan">
                          ({atom.type} {atom.id}
                          {atom.labels && ` :local_names ${JSON.stringify(atom.labels)}`}
                          {atom.predicate && ` :${atom.predicate} ${atom.object}`}
                          {atom.subject && atom.predicate && ` (${atom.predicate} ${atom.subject} ${atom.object})`})
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}