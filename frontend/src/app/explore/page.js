'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Network, Book, Mic, Users } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NodeGraph from '@/components/NodeGraph'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [showFullStory, setShowFullStory] = useState(null)
  const [showShareModal, setShowShareModal] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedEntry || showFullStory || showShareModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedEntry, showFullStory, showShareModal])

  const handleShare = (entry) => {
    // Close other modals
    setSelectedEntry(null)
    setShowFullStory(null)
    
    // Open share modal
    setShowShareModal(entry)
  }

  const copyToClipboard = (entry) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${baseUrl}/knowledge/${entry.id}/${entry.title.toLowerCase().replace(/\s+/g, '-')}`
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setToastMessage('🔗 Link copied to clipboard!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }).catch(() => {
        setToastMessage('❌ Failed to copy link')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      })
    }
  }

  const shareToSocial = (entry, platform) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${baseUrl}/knowledge/${entry.id}/${entry.title.toLowerCase().replace(/\s+/g, '-')}`
    const shareText = `Check out this African wisdom: ${entry.title} - ${entry.description}`
    
    let url = ''
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        break
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        break
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(entry.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
        break
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      setShowShareModal(null)
      setToastMessage(`✨ Shared to ${platform}!`)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleViewFull = (entry) => {
    // Close the preview modal
    setSelectedEntry(null)
    
    // Show full story view
    setShowFullStory(entry)
  }

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
    },
    {
      id: 4,
      title: "Traditional Herbal Medicine",
      type: "medicine",
      community: "Zulu",
      language: "isiZulu",
      description: "Ancient healing practices using indigenous herbs and plants",
      atoms: 20,
      validations: 15,
      status: "validated"
    },
    {
      id: 5,
      title: "Anansi the Spider Tales",
      type: "stories",
      community: "Akan",
      language: "Twi",
      description: "Collection of clever trickster stories teaching life lessons",
      atoms: 18,
      validations: 10,
      status: "validated"
    },
    {
      id: 6,
      title: "Coming of Age Ritual",
      type: "practices",
      community: "Xhosa",
      language: "isiXhosa",
      description: "Traditional ceremony marking transition to adulthood",
      atoms: 25,
      validations: 9,
      status: "pending"
    },
    {
      id: 7,
      title: "Ubuntu Philosophy",
      type: "proverbs",
      community: "Multiple",
      language: "Multiple",
      description: "I am because we are - wisdom of interconnectedness",
      atoms: 10,
      validations: 20,
      status: "validated"
    },
    {
      id: 8,
      title: "Baobab Tree Medicine",
      type: "medicine",
      community: "Multiple",
      language: "Multiple",
      description: "Nutritional and medicinal uses of the tree of life",
      atoms: 14,
      validations: 11,
      status: "validated"
    },
    {
      id: 9,
      title: "Sundiata Epic",
      type: "stories",
      community: "Mandinka",
      language: "Mandinka",
      description: "Epic tale of the Lion King of Mali and his journey",
      atoms: 30,
      validations: 18,
      status: "validated"
    },
    {
      id: 10,
      title: "Water Divination Ceremony",
      type: "practices",
      community: "San",
      language: "!Xóõ",
      description: "Ancient practice of finding underground water sources",
      atoms: 12,
      validations: 7,
      status: "pending"
    },
    {
      id: 11,
      title: "African Proverbs on Unity",
      type: "proverbs",
      community: "Pan-African",
      language: "Multiple",
      description: "Wisdom teachings about strength in community and togetherness",
      atoms: 16,
      validations: 14,
      status: "validated"
    },
    {
      id: 12,
      title: "Wisdom of Elders",
      type: "proverbs",
      community: "Multiple",
      language: "Multiple",
      description: "Traditional sayings passed down through generations",
      atoms: 22,
      validations: 16,
      status: "validated"
    }
  ]

  // Filter entries based on selected category
  const filteredEntries = selectedCategory === 'all' 
    ? sampleEntries 
    : sampleEntries.filter(entry => entry.type === selectedCategory)

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant font-bold mb-6">
              Explore <span className="gradient-text">Knowledge</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover the rich tapestry of African indigenous wisdom preserved through AGI
            </p>
          </motion.div>

          {/* Knowledge Graph Section - Compact Version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-primary-navy/60 rounded-xl border-2 border-primary-cyan/40 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-primary-white flex items-center space-x-2">
                  <Network className="w-5 h-5 text-primary-cyan" />
                  <span>Knowledge Graph</span>
                </h2>
                <div className="text-xs text-primary-white/70 font-semibold">
                  Interactive Network
                </div>
              </div>
              <NodeGraph />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters - Sticky (Outside Container) */}
        <div className="sticky top-[73px] z-40 bg-primary-dark/95 backdrop-blur-lg py-4 mb-8 border-b border-primary-cyan/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-white/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search wisdom, plants, stories, practices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-primary-navy/70 border-2 border-primary-cyan/30 rounded-xl text-primary-white text-lg placeholder-primary-white/70 focus:outline-none focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/20"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all text-base font-semibold ${
                      selectedCategory === category.id
                        ? 'gold-gradient text-primary-navy shadow-lg'
                        : 'bg-primary-navy/70 border-2 border-primary-cyan/20 text-primary-white/90 hover:text-primary-white hover:border-primary-cyan/40'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    <span className="text-xs opacity-70">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Entries - Now Full Width on Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-cormorant font-bold text-primary-white flex items-center space-x-2">
                  <span className="gold-gradient w-2 h-8 rounded-full"></span>
                  <span>Recent Contributions</span>
                </h3>
                <div className="bg-primary-cyan/20 text-primary-cyan px-4 py-2 rounded-lg font-bold">
                  {filteredEntries.length} {filteredEntries.length === 1 ? 'Entry' : 'Entries'}
                </div>
              </div>

              <div className="space-y-4">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedEntry(entry)}
                    className="bg-primary-navy/50 rounded-xl p-5 border-2 border-primary-cyan/30 hover:border-primary-cyan hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-bold text-primary-white">
                        {entry.title}
                      </h4>
                      <span className={`text-sm px-3 py-1 rounded-full font-bold ${
                        entry.status === 'validated' 
                          ? 'bg-green-500/30 text-green-300 border border-green-500/50' 
                          : 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                      }`}>
                        {entry.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-primary-white/80 text-base mb-3 line-clamp-2 leading-relaxed">
                      {entry.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-primary-white/70 font-medium">
                      <span>{entry.community} • {entry.language}</span>
                      <span>{entry.atoms} atoms • {entry.validations} validations</span>
                    </div>
                  </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-primary-white/70 text-lg">No entries found for this category</p>
                  </div>
                )}
              </div>

            </motion.div>

            {/* Stats Panel - Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-primary-navy/50 rounded-xl p-6 border-2 border-primary-cyan/30 shadow-xl sticky top-[200px]">
                <h4 className="text-xl font-bold text-primary-white mb-6 flex items-center space-x-2">
                  <span className="text-2xl">📊</span>
                  <span>Knowledge Stats</span>
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Total Entries', value: '1,247' },
                    { label: 'Validated Knowledge', value: '892' },
                    { label: 'Communities', value: '24' },
                    { label: 'Languages', value: '12' },
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-primary-cyan/10 transition-colors">
                      <span className="text-primary-white/80 text-base">{stat.label}</span>
                      <span className="text-primary-cyan font-bold text-lg">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-50 bg-primary-navy border-2 border-primary-cyan/50 rounded-lg px-6 py-4 shadow-2xl"
        >
          <div className="flex items-center space-x-3">
            <div className="text-primary-cyan">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-primary-white font-semibold">{toastMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedEntry(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-primary-navy/95 backdrop-blur-lg border-2 border-primary-cyan/50 rounded-2xl p-8 max-w-2xl w-full my-8 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-cormorant font-bold text-primary-white mb-2">
                  {selectedEntry.title}
                </h2>
                <div className="flex items-center space-x-3 text-sm text-primary-white/70">
                  <span className="flex items-center space-x-1">
                    <span className="text-primary-cyan">{selectedEntry.community}</span>
                  </span>
                  <span>•</span>
                  <span>{selectedEntry.language}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full ${
                    selectedEntry.status === 'validated'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedEntry.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-primary-cyan/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-primary-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary-white mb-3">Description</h3>
                <p className="text-primary-white/80 leading-relaxed">
                  {selectedEntry.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-navy/50 rounded-lg p-4 border border-primary-cyan/20">
                  <div className="text-primary-cyan text-2xl font-bold mb-1">
                    {selectedEntry.atoms}
                  </div>
                  <div className="text-primary-white/70 text-sm">Knowledge Atoms</div>
                </div>
                <div className="bg-primary-navy/50 rounded-lg p-4 border border-primary-cyan/20">
                  <div className="text-primary-gold text-2xl font-bold mb-1">
                    {selectedEntry.validations}
                  </div>
                  <div className="text-primary-white/70 text-sm">Validations</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary-white mb-3">Metadata</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-white/70">Type:</span>
                    <span className="text-primary-cyan capitalize">{selectedEntry.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-white/70">Community:</span>
                    <span className="text-primary-white">{selectedEntry.community}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-white/70">Language:</span>
                    <span className="text-primary-white">{selectedEntry.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-white/70">Status:</span>
                    <span className="text-primary-white capitalize">{selectedEntry.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewFull(selectedEntry)}
                  className="flex-1 gold-gradient text-primary-navy px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>View Full Story</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShare(selectedEntry)}
                  className="px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg font-semibold hover:bg-primary-cyan/10 transition-all flex items-center space-x-2"
                >
                  <span>Share</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full Story View */}
      {showFullStory && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[100] overflow-y-auto"
          onClick={() => setShowFullStory(null)}
        >
          <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-primary-navy via-primary-navy/95 to-primary-navy/90 border-2 border-primary-cyan/50 rounded-3xl p-10 max-w-4xl w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                    showFullStory.status === 'validated'
                      ? 'bg-green-500/30 text-green-300 border-2 border-green-500/50'
                      : 'bg-yellow-500/30 text-yellow-300 border-2 border-yellow-500/50'
                  }`}>
                    {showFullStory.status.toUpperCase()}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-primary-white mb-4 leading-tight">
                    {showFullStory.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-base text-primary-white/80">
                    <span className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-primary-cyan"></span>
                      <span className="font-semibold text-primary-cyan">{showFullStory.community}</span>
                    </span>
                    <span>•</span>
                    <span>{showFullStory.language}</span>
                    <span>•</span>
                    <span className="capitalize text-primary-gold">{showFullStory.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullStory(null)}
                  className="p-3 hover:bg-primary-cyan/10 rounded-xl transition-colors ml-4"
                >
                  <svg className="w-7 h-7 text-primary-white/70 hover:text-primary-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-primary-navy/50 rounded-xl p-5 border border-primary-cyan/30">
                  <div className="text-3xl font-bold text-primary-cyan mb-1">{showFullStory.atoms}</div>
                  <div className="text-sm text-primary-white/70">Knowledge Atoms</div>
                </div>
                <div className="bg-primary-navy/50 rounded-xl p-5 border border-primary-cyan/30">
                  <div className="text-3xl font-bold text-primary-gold mb-1">{showFullStory.validations}</div>
                  <div className="text-sm text-primary-white/70">Validations</div>
                </div>
                <div className="bg-primary-navy/50 rounded-xl p-5 border border-primary-cyan/30">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {Math.round((showFullStory.validations / (showFullStory.validations + 2)) * 100)}%
                  </div>
                  <div className="text-sm text-primary-white/70">Accuracy</div>
                </div>
                <div className="bg-primary-navy/50 rounded-xl p-5 border border-primary-cyan/30">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{showFullStory.id}</div>
                  <div className="text-sm text-primary-white/70">Entry ID</div>
                </div>
              </div>

              {/* Full Story Content */}
              <div className="space-y-8">
                {/* Description Section */}
                <section className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                  <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-4 flex items-center space-x-2">
                    <span className="text-primary-gold">📖</span>
                    <span>Full Description</span>
                  </h2>
                  <p className="text-lg text-primary-white/90 leading-relaxed">
                    {showFullStory.description}
                  </p>
                  <div className="mt-4 p-4 bg-primary-cyan/10 rounded-lg border-l-4 border-primary-cyan">
                    <p className="text-primary-white/80 italic">
                      This knowledge has been preserved and validated by the {showFullStory.community} community, 
                      passed down through generations in the {showFullStory.language} language.
                    </p>
                  </div>
                </section>

                {/* Knowledge Details */}
                <section className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                  <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-4 flex items-center space-x-2">
                    <span className="text-primary-cyan">ℹ️</span>
                    <span>Knowledge Details</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-primary-navy/50 rounded-lg">
                        <span className="text-primary-white/70">Type:</span>
                        <span className="text-primary-cyan font-semibold capitalize">{showFullStory.type}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary-navy/50 rounded-lg">
                        <span className="text-primary-white/70">Community:</span>
                        <span className="text-primary-white font-semibold">{showFullStory.community}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary-navy/50 rounded-lg">
                        <span className="text-primary-white/70">Language:</span>
                        <span className="text-primary-white font-semibold">{showFullStory.language}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-primary-navy/50 rounded-lg">
                        <span className="text-primary-white/70">Status:</span>
                        <span className={`font-semibold capitalize ${
                          showFullStory.status === 'validated' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {showFullStory.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary-navy/50 rounded-lg">
                        <span className="text-primary-white/70">Knowledge Atoms:</span>
                        <span className="text-primary-cyan font-semibold">{showFullStory.atoms}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary-navy/50 rounded-lg">
                        <span className="text-primary-white/70">Validations:</span>
                        <span className="text-primary-gold font-semibold">{showFullStory.validations}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cultural Context */}
                <section className="bg-primary-navy/30 rounded-xl p-6 border border-primary-cyan/20">
                  <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-4 flex items-center space-x-2">
                    <span className="text-primary-gold">🌍</span>
                    <span>Cultural Context</span>
                  </h2>
                  <p className="text-primary-white/80 leading-relaxed mb-4">
                    This wisdom originates from the <strong className="text-primary-cyan">{showFullStory.community}</strong> community 
                    and represents a vital piece of African indigenous knowledge. It has been carefully documented and validated 
                    to ensure authenticity and cultural accuracy.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-primary-cyan/20 text-primary-cyan rounded-full text-sm font-semibold">
                      #{showFullStory.community.toLowerCase().replace(/\s+/g, '')}
                    </span>
                    <span className="px-4 py-2 bg-primary-gold/20 text-primary-gold rounded-full text-sm font-semibold">
                      #{showFullStory.type}
                    </span>
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                      #{showFullStory.language.toLowerCase().replace(/\s+/g, '')}
                    </span>
                  </div>
                </section>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-primary-cyan/20">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleShare(showFullStory)
                    setShowFullStory(null)
                  }}
                  className="flex-1 gold-gradient text-primary-navy px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share This Story</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFullStory(null)}
                  className="px-8 py-4 border-2 border-primary-cyan text-primary-cyan rounded-xl font-bold text-lg hover:bg-primary-cyan/10 transition-all"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setShowShareModal(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-primary-navy/95 backdrop-blur-lg border-2 border-primary-cyan/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-cormorant font-bold text-primary-white mb-2">
                  Share This Story
                </h2>
                <p className="text-primary-white/70 text-sm">
                  {showShareModal.title}
                </p>
              </div>
              <button
                onClick={() => setShowShareModal(null)}
                className="p-2 hover:bg-primary-cyan/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-primary-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Social Media Options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-bold text-primary-white/80 uppercase tracking-wider mb-3">Share on Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Twitter */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial(showShareModal, 'twitter')}
                  className="flex items-center space-x-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500/50 hover:border-blue-500 rounded-xl transition-all group"
                >
                  <div className="text-2xl">𝕏</div>
                  <span className="text-blue-400 font-semibold">Twitter</span>
                </motion.button>

                {/* Facebook */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial(showShareModal, 'facebook')}
                  className="flex items-center space-x-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border-2 border-blue-600/50 hover:border-blue-600 rounded-xl transition-all group"
                >
                  <div className="text-2xl">📘</div>
                  <span className="text-blue-500 font-semibold">Facebook</span>
                </motion.button>

                {/* LinkedIn */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial(showShareModal, 'linkedin')}
                  className="flex items-center space-x-3 p-4 bg-blue-700/20 hover:bg-blue-700/30 border-2 border-blue-700/50 hover:border-blue-700 rounded-xl transition-all group"
                >
                  <div className="text-2xl">💼</div>
                  <span className="text-blue-400 font-semibold">LinkedIn</span>
                </motion.button>

                {/* WhatsApp */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial(showShareModal, 'whatsapp')}
                  className="flex items-center space-x-3 p-4 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50 hover:border-green-500 rounded-xl transition-all group"
                >
                  <div className="text-2xl">💬</div>
                  <span className="text-green-400 font-semibold">WhatsApp</span>
                </motion.button>

                {/* Telegram */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial(showShareModal, 'telegram')}
                  className="flex items-center space-x-3 p-4 bg-sky-500/20 hover:bg-sky-500/30 border-2 border-sky-500/50 hover:border-sky-500 rounded-xl transition-all group"
                >
                  <div className="text-2xl">✈️</div>
                  <span className="text-sky-400 font-semibold">Telegram</span>
                </motion.button>

                {/* Email */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial(showShareModal, 'email')}
                  className="flex items-center space-x-3 p-4 bg-gray-500/20 hover:bg-gray-500/30 border-2 border-gray-500/50 hover:border-gray-500 rounded-xl transition-all group"
                >
                  <div className="text-2xl">📧</div>
                  <span className="text-gray-300 font-semibold">Email</span>
                </motion.button>
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-primary-white/80 uppercase tracking-wider">Or Copy Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/knowledge/${showShareModal.id}/${showShareModal.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex-1 px-4 py-3 bg-primary-navy/70 border-2 border-primary-cyan/30 rounded-lg text-primary-white text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    copyToClipboard(showShareModal)
                    setShowShareModal(null)
                  }}
                  className="gold-gradient text-primary-navy px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}