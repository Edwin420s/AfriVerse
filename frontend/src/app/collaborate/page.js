'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Edit3, MessageCircle, Share2, Globe, Lock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CollaborativeEditor from '@/components/CollaborativeEditor'

export default function CollaboratePage() {
  const [activeDocument, setActiveDocument] = useState('cultural-doc-1')
  const [showNewDocModal, setShowNewDocModal] = useState(false)

  const documents = [
    {
      id: 'cultural-doc-1',
      title: 'Traditional Healing Practices',
      description: 'Comprehensive documentation of indigenous healing methods',
      collaborators: 8,
      lastModified: '2 hours ago',
      status: 'active',
      access: 'private'
    },
    {
      id: 'cultural-doc-2',
      title: 'Oral History Collection',
      description: 'Recorded oral traditions and historical narratives',
      collaborators: 12,
      lastModified: '1 day ago',
      status: 'active',
      access: 'community'
    },
    {
      id: 'cultural-doc-3',
      title: 'Agricultural Wisdom',
      description: 'Traditional farming techniques and seasonal knowledge',
      collaborators: 5,
      lastModified: '3 days ago',
      status: 'draft',
      access: 'private'
    },
    {
      id: 'cultural-doc-4',
      title: 'Cultural Rituals Guide',
      description: 'Documentation of ceremonial practices and rituals',
      collaborators: 15,
      lastModified: '1 week ago',
      status: 'published',
      access: 'public'
    }
  ]

  const activeUsers = [
    { name: 'Community Elder', role: 'Contributor', active: 'Editing healing section' },
    { name: 'Cultural Researcher', role: 'Editor', active: 'Reviewing citations' },
    { name: 'Local Healer', role: 'Reviewer', active: 'Adding spiritual context' },
    { name: 'Language Expert', role: 'Translator', active: 'Working on translations' }
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
              Collaborative <span className="gradient-text">Editing</span>
            </h1>
            <p className="text-xl text-primary-white/70 max-w-3xl mx-auto">
              Work together with community members, researchers, and cultural experts 
              to document and preserve indigenous knowledge in real-time.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Document List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-cormorant font-bold text-primary-white">
                    Documents
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewDocModal(true)}
                    className="gold-gradient text-primary-navy p-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      onClick={() => setActiveDocument(doc.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        activeDocument === doc.id
                          ? 'border-primary-cyan bg-primary-cyan/10'
                          : 'border-primary-cyan/20 hover:border-primary-cyan/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-primary-white text-sm">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {doc.access === 'public' ? (
                            <Globe className="w-3 h-3 text-green-400" />
                          ) : (
                            <Lock className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-primary-white/70 text-xs mb-2 line-clamp-2">
                        {doc.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-primary-white/50">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{doc.collaborators}</span>
                        </div>
                        <span>{doc.lastModified}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active Collaborators */}
              <div className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6">
                <h3 className="font-semibold text-primary-white mb-4 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary-cyan" />
                  <span>Active Now</span>
                </h3>
                
                <div className="space-y-3">
                  {activeUsers.map((user, index) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="flex items-center space-x-3 p-3 bg-primary-navy/50 rounded-lg border border-primary-cyan/10"
                    >
                      <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center text-primary-navy font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-primary-white text-sm">
                            {user.name}
                          </span>
                          <span className="text-primary-cyan text-xs capitalize">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-primary-white/50 text-xs truncate">
                          {user.active}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Editor Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1"
            >
              <CollaborativeEditor 
                documentId={activeDocument}
                onSave={(document) => {
                  console.log('Document saved:', document)
                  // In real implementation, this would update the document in the backend
                }}
                className="w-full"
              />
            </motion.div>
          </div>

          {/* Collaboration Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Edit3 className="w-8 h-8" />,
                title: 'Real-time Editing',
                description: 'Multiple users can edit simultaneously with live updates'
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: 'Integrated Chat',
                description: 'Discuss changes and coordinate with collaborators in real-time'
              },
              {
                icon: <Share2 className="w-8 h-8" />,
                title: 'Smart Sharing',
                description: 'Control access levels and share with specific communities'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 text-center"
              >
                <div className="text-primary-cyan mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-primary-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary-white/70 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* New Document Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-navy border border-primary-cyan/20 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-cormorant font-bold text-primary-white mb-4">
              Create New Document
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-white mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="Enter document title..."
                  className="w-full p-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-white mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the purpose of this document..."
                  rows={3}
                  className="w-full p-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-white mb-2">
                  Access Level
                </label>
                <select className="w-full p-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white focus:outline-none focus:border-primary-cyan">
                  <option value="private">Private - Only invited collaborators</option>
                  <option value="community">Community - All community members</option>
                  <option value="public">Public - Anyone can view</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewDocModal(false)}
                className="flex-1 py-3 border border-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewDocModal(false)}
                className="flex-1 gold-gradient text-primary-navy py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Document
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}