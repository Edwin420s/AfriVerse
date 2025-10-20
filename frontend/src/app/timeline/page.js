'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CulturalTimeline from '@/components/CulturalTimeline'
import InteractiveMap from '@/components/InteractiveMap'
import { Clock, TrendingUp, Globe, Book, Users } from 'lucide-react'
import { api } from '@/lib/api'

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState('timeline') // 'timeline' or 'map'

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const response = await api.getCulturalTimeline()
        setTimelineData(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching timeline:', error)
        setLoading(false)
      }
    }

    fetchTimelineData()
  }, [])

  const stats = [
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Years of History',
      value: '500+',
      color: 'text-primary-cyan'
    },
    {
      icon: <Book className="w-6 h-6" />,
      label: 'Historical Entries',
      value: '3,247',
      color: 'text-primary-gold'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: 'Regions Documented',
      value: '54',
      color: 'text-green-400'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Communities',
      value: '47',
      color: 'text-purple-400'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-cyan/10 to-primary-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-cormorant font-bold mb-6">
              Cultural Knowledge <span className="gradient-text">Timeline</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-3xl mx-auto">
              Explore the evolution of African indigenous knowledge preservation from oral traditions 
              to decentralized AGI systems.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-navy/50 p-6 rounded-xl border border-primary-cyan/20 text-center"
              >
                <div className={`${stat.color} mb-3 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-white/60">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* View Toggle */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-primary-navy/30 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-cormorant font-bold text-primary-white">
              Explore by {selectedView === 'timeline' ? 'Timeline' : 'Geography'}
            </h2>
            <div className="flex space-x-2 bg-primary-navy/50 p-1 rounded-lg border border-primary-cyan/20">
              <button
                onClick={() => setSelectedView('timeline')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedView === 'timeline'
                    ? 'gold-gradient text-primary-navy'
                    : 'text-primary-white/70 hover:text-primary-white'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Timeline View
              </button>
              <button
                onClick={() => setSelectedView('map')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedView === 'map'
                    ? 'gold-gradient text-primary-navy'
                    : 'text-primary-white/70 hover:text-primary-white'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Map View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {selectedView === 'timeline' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CulturalTimeline events={timelineData} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <InteractiveMap />
            </motion.div>
          )}
        </div>
      </section>

      {/* Historical Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-navy/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">
              Historical <span className="gradient-text">Milestones</span>
            </h2>
            <p className="text-xl text-primary-white/70 max-w-3xl mx-auto">
              Key moments in the journey of preserving African indigenous knowledge
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                era: 'Pre-Colonial Era',
                period: 'Before 1500s',
                title: 'Oral Tradition Dominance',
                description: 'Indigenous knowledge flourished through oral storytelling, apprenticeships, and community rituals. Knowledge keepers (griots, medicine people, elders) maintained cultural continuity.',
                impact: 'Foundation of African knowledge systems',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                era: 'Colonial Period',
                period: '1500s - 1960s',
                title: 'Systematic Suppression',
                description: 'European colonization led to deliberate erosion of indigenous knowledge systems through missionary education, language suppression, and cultural assimilation policies.',
                impact: 'Critical loss of traditional knowledge',
                color: 'from-red-500 to-orange-500'
              },
              {
                era: 'Independence Movement',
                period: '1960s - 1990s',
                title: 'Cultural Revival',
                description: 'Post-independence nations established cultural ministries, documented oral traditions, and promoted indigenous languages. Pan-African movements celebrated African heritage.',
                impact: 'Renewed interest in cultural preservation',
                color: 'from-green-500 to-emerald-500'
              },
              {
                era: 'Digital Age',
                period: '2000s - 2020',
                title: 'Digital Archives',
                description: 'Universities and NGOs began digitizing cultural knowledge. Mobile technology enabled grassroots documentation projects. Internet connectivity reached rural communities.',
                impact: 'Democratization of documentation',
                color: 'from-purple-500 to-pink-500'
              },
              {
                era: 'AGI Era',
                period: '2020 - Present',
                title: 'AI-Powered Preservation',
                description: 'Integration of AGI systems like AfriVerse enables symbolic reasoning, multi-language processing, and decentralized storage. Blockchain ensures cultural data sovereignty.',
                impact: 'Sustainable, ethical knowledge preservation',
                color: 'from-yellow-500 to-amber-500'
              }
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-navy/50 rounded-xl border border-primary-cyan/20 p-6 hover:border-primary-cyan/40 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className={`bg-gradient-to-r ${milestone.color} p-4 rounded-lg text-center`}>
                      <div className="text-primary-navy font-bold text-lg mb-1">
                        {milestone.era}
                      </div>
                      <div className="text-primary-navy/80 text-sm">
                        {milestone.period}
                      </div>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-2xl font-semibold text-primary-white mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-primary-white/70 mb-4 leading-relaxed">
                      {milestone.description}
                    </p>
                    <div className="flex items-center space-x-2 text-primary-cyan">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">Impact: {milestone.impact}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-navy to-primary-cyan/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold mb-6">
              Be Part of <span className="gradient-text">History</span>
            </h2>
            <p className="text-xl text-primary-white/70 mb-8 max-w-2xl mx-auto">
              Every contribution you make today becomes part of the ongoing story of cultural preservation. Start documenting your heritage now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gold-gradient text-primary-navy px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
                Start Contributing
              </button>
              <button className="border-2 border-primary-cyan text-primary-cyan px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-cyan/10 transition-colors">
                Explore Entries
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
