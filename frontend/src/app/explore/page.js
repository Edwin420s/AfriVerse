'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Network, Book, Mic, Users } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NodeGraph from '@/components/NodeGraph'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Knowledge', icon: <Network className="w-4 h-4" />, count: 1247 },
    { id: 'stories', name: 'Oral Stories', icon: <Book className="w-4 h-4" />, count: 342 },
    { id: 'medicine', name: 'Medicinal', icon: <Users className="w-4 h-4" />, count: 189 },
    { id: 'practices', name: 'Cultural Practices', icon: <Mic className="w-4 h-4" />, count: 156 },
    { id: 'proverbs', name: 'Proverbs', icon: <Filter className="w-4 h-4" />, count: 560 },
  ]

  const sampleEntries = [
    {
      id: 1,
      title: "Healing Properties of Aloe Vera",
      type: "medicine",
      community: "Kikuyu",
      language: "Swahili",
      description: "Traditional uses of aloe vera for skin treatment and wound healing",
      atoms: 12,
      validations: 8,
      status: "validated"
    },
    {
      id: 2,
      title: "The Wise Tortoise and The Hare",
      type: "stories",
      community: "Yoruba",
      language: "Yoruba",
      description: "Classic folktale teaching the value of persistence and wisdom",
      atoms: 8,
      validations: 12,
      status: "validated"
    },
    {
      id: 3,
      title: "Rainmaking Ceremony",
      type: "practices",
      community: "Maasai",
      language: "Maa",
      description: "Traditional rituals for calling rain during drought seasons",
      atoms: 15,
      validations: 6,
      status: "pending"
    }
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
              Explore <span className="gradient-text">Knowledge</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-2xl mx-auto">
              Discover the rich tapestry of African indigenous wisdom preserved through AGI
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-white/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search wisdom, plants, stories, practices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      selectedCategory === category.id
                        ? 'gold-gradient text-primary-navy'
                        : 'bg-primary-navy/50 text-primary-white/70 hover:text-primary-white'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    <span className="text-xs opacity-70">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Knowledge Graph */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-primary-navy/30 rounded-2xl border border-primary-cyan/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-primary-white">
                    Knowledge Graph
                  </h2>
                  <div className="text-primary-cyan">
                    <Network className="w-6 h-6" />
                  </div>
                </div>
                <NodeGraph />
              </div>
            </motion.div>

            {/* Recent Entries */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-primary-white mb-4">
                Recent Contributions
              </h3>

              <div className="space-y-4">
                {sampleEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-primary-navy/30 rounded-xl p-4 border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-primary-white">
                        {entry.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        entry.status === 'validated' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-primary-white/70 text-sm mb-3 line-clamp-2">
                      {entry.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-primary-white/50">
                      <span>{entry.community} • {entry.language}</span>
                      <span>{entry.atoms} atoms • {entry.validations} validations</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                <h4 className="font-semibold text-primary-white mb-4">
                  Knowledge Stats
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Total Entries', value: '1,247' },
                    { label: 'Validated Knowledge', value: '892' },
                    { label: 'Communities', value: '24' },
                    { label: 'Languages', value: '12' },
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-primary-white/70">{stat.label}</span>
                      <span className="text-primary-cyan font-semibold">{stat.value}</span>
                    </div>
                  ))}
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