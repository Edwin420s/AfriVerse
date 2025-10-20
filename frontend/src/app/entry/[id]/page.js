'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Download, 
  CheckCircle, 
  XCircle, 
  Users,
  Globe,
  Calendar,
  Shield
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReasoningTrace from '@/components/ReasoningTrace'

export default function EntryPage({ params }) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Mock data - in real app, fetch based on params.id
  const entry = {
    id: params.id,
    title: "Healing Properties of Aloe Vera",
    type: "medicinal_knowledge",
    community: "Kikuyu",
    language: "Swahili",
    description: "Traditional uses of aloe vera (mwarubaini) for skin treatment, wound healing, and digestive issues. The plant is known for its soothing and anti-inflammatory properties.",
    transcript: "In our community, we call this plant mwarubaini, which means the plant of forty. We use it to treat burns, skin rashes, and stomach problems. The gel inside the leaves is very cooling and helps with inflammation.",
    atoms: [
      { type: "plant", id: "aloe_vera", labels: ["mwarubaini"] },
      { type: "property", subject: "aloe_vera", predicate: "soothing", object: true },
      { type: "property", subject: "aloe_vera", predicate: "anti-inflammatory", object: true },
      { type: "relation", predicate: "treats", subject: "aloe_vera", object: "burn" },
      { type: "relation", predicate: "treats", subject: "aloe_vera", object: "skin_rash" },
      { type: "relation", predicate: "treats", subject: "aloe_vera", object: "stomach_problem" },
      { type: "relation", predicate: "found_in", subject: "aloe_vera", object: "eastern_kenya" }
    ],
    validations: [
      { validator: "Community Elder", decision: "approved", notes: "Accurate representation", date: "2025-10-15" },
      { validator: "Botanist", decision: "approved", notes: "Scientifically verified properties", date: "2025-10-16" }
    ],
    license: "CC BY-NC",
    status: "validated",
    createdAt: "2025-10-14",
    audioUrl: "/sample-audio.mp3" // This would be real in production
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-primary-white">
                {entry.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                entry.status === 'validated' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {entry.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-primary-white/70">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{entry.community}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>{entry.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{entry.createdAt}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>{entry.license}</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Audio Player */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20"
              >
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Original Recording
                </h3>
                <div className="flex items-center space-x-4 p-4 bg-primary-navy/50 rounded-lg">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 gold-gradient rounded-full text-primary-navy hover:shadow-lg transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 bg-primary-navy rounded-full overflow-hidden">
                      <div className="h-full gold-gradient w-1/3"></div>
                    </div>
                  </div>
                  <button className="text-primary-cyan hover:text-primary-cyan/80 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20"
              >
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Description
                </h3>
                <p className="text-primary-white/80 leading-relaxed">
                  {entry.description}
                </p>
              </motion.div>

              {/* Transcript */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20"
              >
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Transcript
                </h3>
                <p className="text-primary-white/80 leading-relaxed italic">
                  "{entry.transcript}"
                </p>
              </motion.div>

              {/* AI Reasoning */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ReasoningTrace atoms={entry.atoms} />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Validations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20"
              >
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Community Validations
                </h3>
                <div className="space-y-4">
                  {entry.validations.map((validation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {validation.decision === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-primary-white">
                          {validation.validator}
                        </div>
                        <div className="text-sm text-primary-white/70">
                          {validation.notes}
                        </div>
                        <div className="text-xs text-primary-white/50 mt-1">
                          {validation.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Related Knowledge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20"
              >
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Related Knowledge
                </h3>
                <div className="space-y-3">
                  {[
                    "Traditional Skin Treatments",
                    "Medicinal Plants of Kenya", 
                    "Kikuyu Healing Practices",
                    "Anti-inflammatory Herbs"
                  ].map((topic, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block text-primary-cyan hover:text-primary-cyan/80 transition-colors text-sm py-1"
                    >
                      {topic}
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20"
              >
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Contribute
                </h3>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 bg-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/30 transition-colors text-sm">
                    Add Related Knowledge
                  </button>
                  <button className="w-full py-2 px-4 border border-primary-gold/20 text-primary-gold rounded-lg hover:bg-primary-gold/10 transition-colors text-sm">
                    Validate This Entry
                  </button>
                  <button className="w-full py-2 px-4 border border-primary-white/20 text-primary-white rounded-lg hover:bg-primary-white/10 transition-colors text-sm">
                    Share Knowledge
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}