'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Shield,
  Filter,
  Search
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ValidatorPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const pendingEntries = [
    {
      id: 1,
      title: "Rainmaking Ceremony of the Maasai",
      type: "cultural_practice",
      community: "Maasai",
      language: "Maa",
      submittedBy: "Community Elder",
      submittedAt: "2025-10-18",
      description: "Detailed description of traditional rainmaking rituals and ceremonies",
      urgency: "high",
      similarity: 0.2
    },
    {
      id: 2,
      title: "Yoruba Proverb Collection",
      type: "proverb",
      community: "Yoruba", 
      language: "Yoruba",
      submittedBy: "Cultural Researcher",
      submittedAt: "2025-10-17",
      description: "Collection of traditional Yoruba proverbs with explanations",
      urgency: "medium",
      similarity: 0.8
    },
    {
      id: 3,
      title: "Traditional Fishing Techniques",
      type: "practice",
      community: "Luo",
      language: "Dholuo",
      submittedBy: "Local Fisher",
      submittedAt: "2025-10-16",
      description: "Indigenous fishing methods and seasonal practices",
      urgency: "low", 
      similarity: 0.4
    }
  ]

  const stats = {
    total: 24,
    pending: 12,
    approved: 8,
    rejected: 4,
    accuracy: 92
  }

  const filters = [
    { id: 'all', name: 'All Entries', count: stats.pending },
    { id: 'high', name: 'High Priority', count: 5 },
    { id: 'cultural', name: 'Cultural Practices', count: 3 },
    { id: 'medicine', name: 'Medicinal', count: 4 },
    { id: 'stories', name: 'Stories', count: 2 }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">
              Knowledge <span className="gradient-text">Validation</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-2xl mx-auto">
              Help ensure the accuracy and cultural authenticity of contributed wisdom
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              { label: 'Total Pending', value: stats.pending, icon: Clock, color: 'text-yellow-400' },
              { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-400' },
              { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-400' },
              { label: 'Accuracy', value: `${stats.accuracy}%`, icon: Shield, color: 'text-primary-cyan' },
            ].map((stat, index) => (
              <div key={index} className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                <div className={`${stat.color} mb-2`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-primary-white mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-white/70 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filters and Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-white/50 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search entries to validate..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto">
                    {filters.map((filterItem) => (
                      <button
                        key={filterItem.id}
                        onClick={() => setFilter(filterItem.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                          filter === filterItem.id
                            ? 'gold-gradient text-primary-navy'
                            : 'bg-primary-navy/50 text-primary-white/70 hover:text-primary-white'
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                        <span>{filterItem.name}</span>
                        <span className="text-xs opacity-70">({filterItem.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Entries List */}
              <div className="space-y-4">
                {pendingEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-primary-white mb-2">
                          {entry.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-primary-white/70">
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{entry.community}</span>
                          </span>
                          <span>{entry.language}</span>
                          <span>Submitted {entry.submittedAt}</span>
                          <span>By {entry.submittedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          entry.urgency === 'high' 
                            ? 'bg-red-500/20 text-red-400'
                            : entry.urgency === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {entry.urgency} priority
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          entry.similarity > 0.7
                            ? 'bg-green-500/20 text-green-400'
                            : entry.similarity > 0.3
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {Math.round(entry.similarity * 100)}% unique
                        </span>
                      </div>
                    </div>

                    <p className="text-primary-white/80 mb-4 line-clamp-2">
                      {entry.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/30 transition-colors">
                          <span>Review Details</span>
                        </button>
                      </div>
                      <button className="text-primary-white/70 hover:text-primary-white transition-colors text-sm">
                        Skip for now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {/* Validator Guidelines */}
              <div className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Validation Guidelines
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    "Check cultural accuracy and authenticity",
                    "Verify the contributor has rights to share",
                    "Ensure no sensitive or sacred knowledge is exposed",
                    "Confirm proper categorization and tagging",
                    "Look for duplicate or similar entries"
                  ].map((guideline, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-primary-cyan mt-0.5 flex-shrink-0" />
                      <span className="text-primary-white/80">{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Your Impact
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Entries Validated', value: '47' },
                    { label: 'Accuracy Score', value: '96%' },
                    { label: 'Community Trust', value: '98%' },
                    { label: 'Response Time', value: '2.3h' },
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-primary-white/70 text-sm">{stat.label}</span>
                      <span className="text-primary-cyan font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                <h3 className="text-xl font-semibold text-primary-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 gold-gradient text-primary-navy rounded-lg font-semibold hover:shadow-lg transition-all">
                    Validate Random Entry
                  </button>
                  <button className="w-full py-2 px-4 border border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors">
                    Review Guidelines
                  </button>
                  <button className="w-full py-2 px-4 border border-primary-white/20 text-primary-white rounded-lg hover:bg-primary-white/10 transition-colors">
                    Join Validator Community
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}