'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Book, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CulturalTimeline from '@/components/CulturalTimeline'

export default function TimelinePage() {
  const [selectedEra, setSelectedEra] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const historicalPeriods = [
    {
      id: 'pre-colonial',
      name: 'Pre-Colonial Era',
      period: 'Before 1500',
      description: 'Rich indigenous knowledge systems flourishing across African civilizations',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'colonial',
      name: 'Colonial Period',
      period: '1500-1960',
      description: 'Systematic suppression and transformation of indigenous knowledge',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'independence',
      name: 'Independence Movements',
      period: '1960-1990',
      description: 'Cultural revival and reclamation of indigenous heritage',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'digital',
      name: 'Digital Age',
      period: '1990-2020',
      description: 'Digital preservation and global sharing of cultural knowledge',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'agi',
      name: 'AGI Integration',
      period: '2020-Present',
      description: 'Artificial intelligence enhancing cultural preservation and understanding',
      color: 'from-primary-cyan to-primary-gold'
    }
  ]

  const keyEvents = [
    {
      id: 1,
      year: 'c. 3000 BCE',
      title: 'Nubian Civilization Knowledge',
      description: 'Advanced agricultural and architectural knowledge in Nubian civilizations',
      region: 'Northeast Africa',
      category: 'agriculture',
      significance: 'foundational'
    },
    {
      id: 2,
      year: 'c. 1000 CE',
      title: 'Timbuktu Manuscripts',
      description: 'Establishment of great libraries and centers of learning in Mali Empire',
      region: 'West Africa',
      category: 'education',
      significance: 'critical'
    },
    {
      id: 3,
      year: '1884',
      title: 'Berlin Conference',
      description: 'European colonization accelerates cultural disruption across Africa',
      region: 'Pan-African',
      category: 'historical',
      significance: 'transformative'
    },
    {
      id: 4,
      year: '1960',
      title: 'African Independence Wave',
      description: 'Nations regain sovereignty and begin cultural revival movements',
      region: 'Multiple',
      category: 'political',
      significance: 'revival'
    },
    {
      id: 5,
      year: '2003',
      title: 'UNESCO Convention',
      description: 'International recognition of intangible cultural heritage preservation',
      region: 'Global',
      category: 'international',
      significance: 'supportive'
    },
    {
      id: 6,
      year: '2025',
      title: 'AfriVerse Launch',
      description: 'AGI-powered platform for decentralized cultural knowledge preservation',
      region: 'Global',
      category: 'technological',
      significance: 'innovative'
    }
  ]

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'west', name: 'West Africa' },
    { id: 'east', name: 'East Africa' },
    { id: 'south', name: 'Southern Africa' },
    { id: 'central', name: 'Central Africa' },
    { id: 'north', name: 'North Africa' }
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
              Cultural <span className="gradient-text">Timeline</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-3xl mx-auto">
              Journey through the evolution of African indigenous knowledge preservation, 
              from ancient oral traditions to modern AGI-powered conservation.
            </p>
          </motion.div>

          {/* Interactive Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <CulturalTimeline />
          </motion.div>

          {/* Historical Periods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-cormorant font-bold text-primary-white mb-8 text-center">
              Historical Periods
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {historicalPeriods.map((period, index) => (
                <motion.div
                  key={period.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedEra(period.id)}
                >
                  <div className={`bg-gradient-to-br ${period.color} rounded-xl p-6 text-center text-primary-navy h-48 flex flex-col justify-between transition-transform group-hover:scale-105`}>
                    <div>
                      <h3 className="font-cormorant font-bold text-lg mb-2">
                        {period.name}
                      </h3>
                      <div className="text-sm opacity-80 mb-3">
                        {period.period}
                      </div>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {period.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Key Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-cormorant font-bold text-primary-white">
                Key Historical Events
              </h2>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-primary-navy/50 border border-primary-cyan/20 rounded-lg px-4 py-2 text-primary-white focus:outline-none focus:border-primary-cyan"
                >
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {keyEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 hover:border-primary-cyan/40 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-cormorant font-bold text-primary-cyan mb-1">
                          {event.year}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          event.significance === 'critical' ? 'bg-red-500/20 text-red-400' :
                          event.significance === 'foundational' ? 'bg-green-500/20 text-green-400' :
                          event.significance === 'transformative' ? 'bg-orange-500/20 text-orange-400' :
                          event.significance === 'revival' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {event.significance}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-cormorant font-bold text-primary-white mb-2 group-hover:text-primary-cyan transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-primary-white/70 mb-3">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-primary-white/50">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.region}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Book className="w-4 h-4" />
                            <span className="capitalize">{event.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary-cyan hover:bg-primary-cyan/20 rounded-lg">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-8"
          >
            <h2 className="text-3xl font-cormorant font-bold text-primary-white mb-8 text-center">
              Preservation Progress
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  period: 'Pre-1500', 
                  preserved: '15%', 
                  atRisk: '85%', 
                  description: 'Oral traditions largely lost',
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  period: '1500-1900', 
                  preserved: '25%', 
                  atRisk: '75%', 
                  description: 'Early colonial records',
                  color: 'from-yellow-500 to-orange-500'
                },
                { 
                  period: '1900-2000', 
                  preserved: '45%', 
                  atRisk: '55%', 
                  description: 'Academic documentation',
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  period: '2000-Present', 
                  preserved: '80%', 
                  atRisk: '20%', 
                  description: 'Digital preservation era',
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-1 mb-4`}>
                    <div className="bg-primary-navy rounded p-4">
                      <div className="text-2xl font-bold text-primary-white mb-1">
                        {stat.preserved}
                      </div>
                      <div className="text-primary-white/70 text-sm">
                        Knowledge Preserved
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-cormorant font-bold text-primary-white mb-1">
                    {stat.period}
                  </div>
                  <div className="text-primary-white/70 text-sm">
                    {stat.description}
                  </div>
                  <div className="text-xs text-primary-white/50 mt-2">
                    {stat.atRisk} at risk of being lost
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}