'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, Globe, Book, Shield, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'

export default function CommunitiesPage() {
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const communities = [
    {
      id: 'kikuyu',
      name: 'Kikuyu Community',
      region: 'East Africa',
      country: 'Kenya',
      members: 1247,
      knowledgeEntries: 892,
      languages: ['Kikuyu', 'Swahili', 'English'],
      description: 'Preserving Kikuyu cultural heritage, traditional medicine, and agricultural practices through community collaboration and digital archiving.',
      image: '/communities/kikuyu.jpg',
      categories: ['medicine', 'agriculture', 'rituals'],
      activity: 'high',
      joined: true
    },
    {
      id: 'yoruba',
      name: 'Yoruba Cultural Preservation',
      region: 'West Africa',
      country: 'Nigeria',
      members: 2156,
      knowledgeEntries: 1342,
      languages: ['Yoruba', 'English'],
      description: 'Documenting Yoruba mythology, artistic traditions, and philosophical wisdom for future generations.',
      image: '/communities/yoruba.jpg',
      categories: ['mythology', 'art', 'philosophy'],
      activity: 'very-high',
      joined: true
    },
    {
      id: 'maasai',
      name: 'Maasai Heritage',
      region: 'East Africa',
      country: 'Kenya/Tanzania',
      members: 867,
      knowledgeEntries: 543,
      languages: ['Maa', 'Swahili', 'English'],
      description: 'Safeguarding Maasai pastoral knowledge, ecological wisdom, and social structures in the modern era.',
      image: '/communities/maasai.jpg',
      categories: ['ecology', 'social', 'livestock'],
      activity: 'medium',
      joined: false
    },
    {
      id: 'zulu',
      name: 'Zulu Nation Knowledge',
      region: 'Southern Africa',
      country: 'South Africa',
      members: 1789,
      knowledgeEntries: 987,
      languages: ['Zulu', 'English'],
      description: 'Preserving Zulu military history, craft traditions, and community governance systems.',
      image: '/communities/zulu.jpg',
      categories: ['history', 'crafts', 'governance'],
      activity: 'high',
      joined: false
    },
    {
      id: 'berber',
      name: 'Amazigh Cultural Network',
      region: 'North Africa',
      country: 'Multiple',
      members: 945,
      knowledgeEntries: 678,
      languages: ['Tamazight', 'Arabic', 'French'],
      description: 'Revitalizing Amazigh language, textile arts, and mountain agriculture practices across North Africa.',
      image: '/communities/berber.jpg',
      categories: ['language', 'textiles', 'agriculture'],
      activity: 'medium',
      joined: true
    },
    {
      id: 'igbo',
      name: 'Igbo Knowledge Systems',
      region: 'West Africa',
      country: 'Nigeria',
      members: 1324,
      knowledgeEntries: 765,
      languages: ['Igbo', 'English'],
      description: 'Documenting Igbo entrepreneurial traditions, masquerade culture, and democratic principles.',
      image: '/communities/igbo.jpg',
      categories: ['business', 'arts', 'governance'],
      activity: 'high',
      joined: false
    }
  ]

  const filters = [
    { id: 'all', name: 'All Communities', count: communities.length },
    { id: 'joined', name: 'My Communities', count: communities.filter(c => c.joined).length },
    { id: 'east', name: 'East Africa', count: communities.filter(c => c.region === 'East Africa').length },
    { id: 'west', name: 'West Africa', count: communities.filter(c => c.region === 'West Africa').length },
    { id: 'high-activity', name: 'High Activity', count: communities.filter(c => c.activity === 'high' || c.activity === 'very-high').length }
  ]

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'very-high': return 'bg-green-500'
      case 'high': return 'bg-blue-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'joined' && community.joined) ||
                         (filter === 'east' && community.region === 'East Africa') ||
                         (filter === 'west' && community.region === 'West Africa') ||
                         (filter === 'high-activity' && (community.activity === 'high' || community.activity === 'very-high'))
    
    return matchesSearch && matchesFilter
  })

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
              Cultural <span className="gradient-text">Communities</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-2xl mx-auto">
              Connect with communities preserving indigenous knowledge across Africa. 
              Join collaborative efforts to document and safeguard cultural heritage.
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
              <div className="flex-1">
                <SearchBar
                  onSearch={({ query }) => setSearchQuery(query)}
                  placeholder="Search communities by name, region, or focus..."
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

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all overflow-hidden group cursor-pointer"
                onClick={() => setSelectedCommunity(community)}
              >
                {/* Community Header */}
                <div className="p-6 border-b border-primary-cyan/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-cormorant font-bold text-primary-white mb-2 group-hover:text-primary-cyan transition-colors">
                        {community.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-primary-white/70">
                        <Globe className="w-4 h-4" />
                        <span>{community.region}</span>
                        <span>•</span>
                        <span>{community.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getActivityColor(community.activity)}`} />
                      <div className="text-xs text-primary-white/50 capitalize">
                        {community.activity} activity
                      </div>
                    </div>
                  </div>

                  <p className="text-primary-white/70 text-sm line-clamp-2">
                    {community.description}
                  </p>
                </div>

                {/* Community Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="flex items-center justify-center space-x-1 text-primary-cyan mb-1">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{community.members}</span>
                      </div>
                      <div className="text-xs text-primary-white/50">Members</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-1 text-primary-gold mb-1">
                        <Book className="w-4 h-4" />
                        <span className="font-semibold">{community.knowledgeEntries}</span>
                      </div>
                      <div className="text-xs text-primary-white/50">Entries</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-1 text-green-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold capitalize">{community.activity}</span>
                      </div>
                      <div className="text-xs text-primary-white/50">Activity</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="text-xs text-primary-white/50 mb-2">Languages</div>
                    <div className="flex flex-wrap gap-1">
                      {community.languages.map(language => (
                        <span
                          key={language}
                          className="px-2 py-1 bg-primary-cyan/20 text-primary-cyan rounded text-xs"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="text-xs text-primary-white/50 mb-2">Focus Areas</div>
                    <div className="flex flex-wrap gap-1">
                      {community.categories.map(category => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-primary-gold/20 text-primary-gold rounded text-xs capitalize"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 border-t border-primary-cyan/20">
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                      community.joined
                        ? 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/20 hover:bg-primary-cyan/30'
                        : 'gold-gradient text-primary-navy hover:shadow-lg'
                    }`}
                  >
                    {community.joined ? 'Manage Membership' : 'Join Community'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Community Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-8"
          >
            <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-6 text-center">
              Community Impact
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Communities', value: '24', icon: Users },
                { label: 'Active Members', value: '8,427', icon: Users },
                { label: 'Knowledge Entries', value: '5,123', icon: Book },
                { label: 'Languages Preserved', value: '18', icon: Shield }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-primary-cyan mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-primary-white/70 text-sm">
                    {stat.label}
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
