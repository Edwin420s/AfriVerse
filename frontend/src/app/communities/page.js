'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, Book, TrendingUp, Search, Filter, ArrowRight, Globe, Heart } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { api } from '@/lib/api'

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // Fetch communities data
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true)
        const response = await api.getCommunities({ 
          region: selectedRegion !== 'all' ? selectedRegion : undefined,
          sort: sortBy 
        })
        
        // Mock data for demonstration if API returns empty
        const mockCommunities = [
          {
            id: 1,
            name: 'Kikuyu Wisdom Keepers',
            region: 'East Africa',
            country: 'Kenya',
            language: 'Kikuyu',
            memberCount: 247,
            entriesCount: 892,
            validatorCount: 34,
            description: 'Preserving Kikuyu traditional knowledge, proverbs, and medicinal practices from Central Kenya highlands.',
            tags: ['Traditional Medicine', 'Oral Stories', 'Proverbs'],
            verificationRate: 94,
            trending: true
          },
          {
            id: 2,
            name: 'Yoruba Cultural Heritage',
            region: 'West Africa',
            country: 'Nigeria',
            language: 'Yoruba',
            memberCount: 583,
            entriesCount: 1547,
            validatorCount: 67,
            description: 'Documenting Yoruba orisha traditions, Ifa divination knowledge, and artistic expressions.',
            tags: ['Spirituality', 'Art', 'Music'],
            verificationRate: 91,
            trending: true
          },
          {
            id: 3,
            name: 'Maasai Oral Traditions',
            region: 'East Africa',
            country: 'Kenya & Tanzania',
            language: 'Maa',
            memberCount: 156,
            entriesCount: 423,
            validatorCount: 21,
            description: 'Recording Maasai age-set knowledge, warrior traditions, and pastoralist wisdom.',
            tags: ['Oral Traditions', 'Pastoralism', 'Cultural Practices'],
            verificationRate: 96,
            trending: false
          },
          {
            id: 4,
            name: 'Zulu Ancestral Knowledge',
            region: 'Southern Africa',
            country: 'South Africa',
            language: 'Zulu',
            memberCount: 394,
            entriesCount: 1103,
            validatorCount: 48,
            description: 'Preserving Zulu traditional healing, beadwork symbolism, and warrior history.',
            tags: ['Traditional Medicine', 'Crafts', 'History'],
            verificationRate: 89,
            trending: false
          },
          {
            id: 5,
            name: 'Swahili Coastal Wisdom',
            region: 'East Africa',
            country: 'Kenya & Tanzania',
            language: 'Swahili',
            memberCount: 421,
            entriesCount: 967,
            validatorCount: 52,
            description: 'Documenting Swahili maritime knowledge, trade history, and Islamic traditions.',
            tags: ['Maritime', 'Trade', 'History'],
            verificationRate: 92,
            trending: true
          },
          {
            id: 6,
            name: 'Igbo Traditional Systems',
            region: 'West Africa',
            country: 'Nigeria',
            language: 'Igbo',
            memberCount: 312,
            entriesCount: 754,
            validatorCount: 39,
            description: 'Recording Igbo traditional governance, market systems, and folk wisdom.',
            tags: ['Governance', 'Economics', 'Proverbs'],
            verificationRate: 88,
            trending: false
          }
        ]

        setCommunities(response.data && response.data.length > 0 ? response.data : mockCommunities)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching communities:', error)
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [selectedRegion, sortBy])

  // Filter communities based on search
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const regions = ['all', 'East Africa', 'West Africa', 'Southern Africa', 'Central Africa', 'North Africa']

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
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-cormorant font-bold mb-6">
              Cultural <span className="gradient-text">Communities</span>
            </h1>
            <p className="text-xl text-primary-white/70 mb-8 max-w-3xl mx-auto">
              Connect with communities preserving indigenous knowledge across Africa. Join, contribute, and help safeguard cultural heritage.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Active Communities', value: '47+', icon: <Users className="w-5 h-5" /> },
                { label: 'Total Members', value: '2,500+', icon: <Globe className="w-5 h-5" /> },
                { label: 'Knowledge Entries', value: '8,900+', icon: <Book className="w-5 h-5" /> },
                { label: 'Languages', value: '35+', icon: <Heart className="w-5 h-5" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-primary-navy/50 p-6 rounded-xl border border-primary-cyan/20"
                >
                  <div className="text-primary-cyan mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-primary-gold mb-1">{stat.value}</div>
                  <div className="text-primary-white/70 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-primary-navy/30 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search communities, languages, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan"
              />
            </div>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white focus:outline-none focus:border-primary-cyan"
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white focus:outline-none focus:border-primary-cyan"
            >
              <option value="popular">Most Popular</option>
              <option value="active">Most Active</option>
              <option value="recent">Recently Added</option>
              <option value="entries">Most Entries</option>
            </select>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-primary-white/30 mx-auto mb-4" />
              <p className="text-xl text-primary-white/70">No communities found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all duration-300 overflow-hidden group"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-primary-cyan/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary-white mb-2 group-hover:text-primary-cyan transition-colors">
                          {community.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-primary-white/60">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{community.country}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4" />
                            <span>{community.language}</span>
                          </div>
                        </div>
                      </div>
                      {community.trending && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-primary-gold/20 text-primary-gold rounded-full text-xs">
                          <TrendingUp className="w-3 h-3" />
                          <span>Trending</span>
                        </div>
                      )}
                    </div>

                    <p className="text-primary-white/70 text-sm line-clamp-3 mb-4">
                      {community.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary-cyan/10 text-primary-cyan rounded text-xs border border-primary-cyan/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-primary-cyan">{community.memberCount}</div>
                        <div className="text-xs text-primary-white/50">Members</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-gold">{community.entriesCount}</div>
                        <div className="text-xs text-primary-white/50">Entries</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-white">{community.validatorCount}</div>
                        <div className="text-xs text-primary-white/50">Validators</div>
                      </div>
                    </div>

                    {/* Verification Rate */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-xs text-primary-white/60 mb-2">
                        <span>Verification Rate</span>
                        <span className="font-semibold">{community.verificationRate}%</span>
                      </div>
                      <div className="w-full bg-primary-navy/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-cyan to-primary-gold rounded-full h-2 transition-all duration-500"
                          style={{ width: `${community.verificationRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex-1 gold-gradient text-primary-navy px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                        <span>Join Community</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 border border-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors">
                        <Book className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
              Start Your Own <span className="gradient-text">Community</span>
            </h2>
            <p className="text-xl text-primary-white/70 mb-8 max-w-2xl mx-auto">
              Don't see your community listed? Create one and start preserving your cultural heritage today.
            </p>
            <button className="gold-gradient text-primary-navy px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
              Create Community
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
