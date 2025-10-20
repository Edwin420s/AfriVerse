'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Edit3, FileText, Clock, Share2, Plus, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CollaborativeEditor from '@/components/CollaborativeEditor'

export default function CollaboratePage() {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [viewMode, setViewMode] = useState('my-documents')
  const [searchQuery, setSearchQuery] = useState('')

  const documents = [
    {
      id: 'doc-001',
      title: 'Traditional Healing Practices - Kikuyu Community',
      description: 'Comprehensive documentation of herbal medicine and healing rituals',
      lastModified: new Date('2025-01-15'),
      collaborators: 8,
      status: 'active',
      category: 'medicine',
      community: 'Kikuyu',
      wordCount: 12450,
      versions: 12
    },
    {
      id: 'doc-002',
      title: 'Agricultural Wisdom - Seasonal Planting Guide',
      description: 'Indigenous knowledge of crop cycles and sustainable farming methods',
      lastModified: new Date('2025-01-12'),
      collaborators: 5,
      status: 'active',
      category: 'agriculture',
      community: 'Multiple',
      wordCount: 8765,
      versions: 8
    },
    {
      id: 'doc-003',
      title: 'Oral History Collection - Elder Interviews',
      description: 'Transcribed oral histories and storytelling traditions',
      lastModified: new Date('2025-01-10'),
      collaborators: 12,
      status: 'review',
      category: 'history',
      community: 'Yoruba',
      wordCount: 23450,
      versions: 15
    },
    {
      id: 'doc-004',
      title: 'Cultural Rituals and Ceremonies',
      description: 'Documentation of traditional ceremonies and their significance',
      lastModified: new Date('2025-01-08'),
      collaborators: 6,
      status: 'active',
      category: 'rituals',
      community: 'Maasai',
      wordCount: 15670,
      versions: 10
    },
    {
      id: 'doc-005',
      title: 'Indigenous Language Preservation',
      description: 'Grammar, vocabulary, and usage of endangered languages',
      lastModified: new Date('2025-01-05'),
      collaborators: 15,
      status: 'active',
      category: 'language',
      community: 'Multiple',
      wordCount: 34560,
      versions: 20
    },
    {
      id: 'doc-006',
      title: 'Traditional Craft Documentation',
      description: 'Methods and meanings behind traditional crafts and arts',
      lastModified: new Date('2025-01-03'),
      collaborators: 4,
      status: 'draft',
      category: 'crafts',
      community: 'Zulu',
      wordCount: 9870,
      versions: 6
    }
  ]

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'my-documents', name: 'My Documents', count: documents.filter(d => d.status !== 'draft').length },
    { id: 'shared', name: 'Shared with Me', count: documents.filter(d => d.collaborators > 1).length },
    { id: 'medicine', name: 'Medicine', count: documents.filter(d => d.category === 'medicine').length },
    { id: 'agriculture', name: 'Agriculture', count: documents.filter(d => d.category === 'agriculture').length },
    { id: 'history', name: 'History', count: documents.filter(d => d.category === 'history').length }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-400/20'
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/20'
      case 'draft': return 'bg-blue-500/20 text-blue-400 border-blue-400/20'
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-400/20'
      default: return 'bg-primary-cyan/20 text-primary-cyan border-primary-cyan/20'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatWordCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesView = viewMode === 'all' || 
                       (viewMode === 'my-documents' && doc.status !== 'draft') ||
                       (viewMode === 'shared' && doc.collaborators > 1) ||
                       doc.category === viewMode
    
    return matchesSearch && matchesView
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
              Collaborative <span className="gradient-text">Editing</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-2xl mx-auto">
              Work together with community members to document and preserve cultural knowledge in real-time.
            </p>
          </motion.div>

          {selectedDocument ? (
            // Document Editor View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="flex items-center space-x-2 text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                >
                  <span>← Back to Documents</span>
                </button>
                
                <div className="flex items-center space-x-4 text-sm text-primary-white/70">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{selectedDocument.collaborators} collaborators</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Last edited {formatDate(selectedDocument.lastModified)}</span>
                  </div>
                </div>
              </div>

              <CollaborativeEditor 
                documentId={selectedDocument.id}
                onSave={(document) => console.log('Document saved:', document)}
                className="w-full"
              />
            </motion.div>
          ) : (
            // Documents Gallery
            <>
              {/* Header Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8"
              >
                <div className="flex-1 w-full lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-white/50 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 gold-gradient text-primary-navy px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    <span>New Document</span>
                  </button>
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setViewMode(category.id)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        viewMode === category.id
                          ? 'gold-gradient text-primary-navy'
                          : 'bg-primary-navy/50 text-primary-white/70 hover:text-primary-white'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 hover:border-primary-cyan/40 transition-all overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedDocument(document)}
                  >
                    {/* Document Header */}
                    <div className="p-6 border-b border-primary-cyan/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-cormorant font-bold text-primary-white mb-2 group-hover:text-primary-cyan transition-colors line-clamp-2">
                            {document.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-primary-white/50">
                            <span>{document.community}</span>
                            <span>•</span>
                            <span className="capitalize">{document.category}</span>
                          </div>
                        </div>
                        
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(document.status)}`}>
                          <span className="capitalize">{document.status}</span>
                        </div>
                      </div>

                      <p className="text-primary-white/70 text-sm line-clamp-2">
                        {document.description}
                      </p>
                    </div>

                    {/* Document Stats */}
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div>
                          <div className="flex items-center justify-center space-x-1 text-primary-cyan mb-1">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold">{document.collaborators}</span>
                          </div>
                          <div className="text-xs text-primary-white/50">Collaborators</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center space-x-1 text-primary-gold mb-1">
                            <FileText className="w-4 h-4" />
                            <span className="font-semibold">{formatWordCount(document.wordCount)}</span>
                          </div>
                          <div className="text-xs text-primary-white/50">Words</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center space-x-1 text-green-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">{document.versions}</span>
                          </div>
                          <div className="text-xs text-primary-white/50">Versions</div>
                        </div>
                      </div>

                      {/* Last Modified */}
                      <div className="flex items-center justify-between text-xs text-primary-white/50">
                        <span>Last modified</span>
                        <span>{formatDate(document.lastModified)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-primary-cyan/20 flex space-x-2">
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-primary-cyan/20 text-primary-cyan hover:bg-primary-cyan/30 py-2 px-3 rounded-lg text-sm transition-colors">
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      <button className="flex items-center justify-center space-x-2 border border-primary-cyan/20 text-primary-cyan hover:bg-primary-cyan/10 py-2 px-3 rounded-lg text-sm transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredDocuments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <FileText className="w-16 h-16 text-primary-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-white mb-2">
                    No documents found
                  </h3>
                  <p className="text-primary-white/70 mb-6">
                    {searchQuery ? 'Try adjusting your search terms' : 'Create your first collaborative document'}
                  </p>
                  <button className="gold-gradient text-primary-navy px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Create New Document
                  </button>
                </motion.div>
              )}

              {/* Collaboration Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-8"
              >
                <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-6 text-center">
                  Collaboration Impact
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Active Documents', value: '48', icon: FileText },
                    { label: 'Total Collaborators', value: '327', icon: Users },
                    { label: 'Words Documented', value: '1.2M', icon: Edit3 },
                    { label: 'Communities Involved', value: '24', icon: Share2 }
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}