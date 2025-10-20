'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Edit3, Save, Share2, MessageCircle, Eye, EyeOff, Lock, Unlock } from 'lucide-react'

export default function CollaborativeEditor({ documentId, onSave, className = "" }) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [collaborators, setCollaborators] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  const editorRef = useRef(null)
  const chatRef = useRef(null)

  // Simulated collaborative editing data
  const sampleDocument = {
    id: documentId,
    title: 'Traditional Healing Practices Documentation',
    content: `# Traditional Healing Practices of East Africa

## Overview
This document captures indigenous healing knowledge from various East African communities, focusing on herbal remedies, spiritual practices, and community healing rituals.

## Key Practices

### Herbal Medicine
- Use of Aloe Vera (Mwarubaini) for skin conditions
- Moringa leaves for nutritional supplementation
- Neem tree extracts for antimicrobial purposes

### Spiritual Healing
- Ritual ceremonies for mental wellness
- Community cleansing practices
- Ancestral communication methods

## Cultural Context
Each practice is deeply rooted in community values and environmental understanding. Preservation requires respecting original contexts while making knowledge accessible.`,
    collaborators: [
      { id: 1, name: 'Community Elder', role: 'Contributor', avatar: '👴', online: true },
      { id: 2, name: 'Cultural Researcher', role: 'Editor', avatar: '👩‍🔬', online: true },
      { id: 3, name: 'Local Healer', role: 'Reviewer', avatar: '🧙‍♂️', online: false }
    ],
    chat: [
      { id: 1, user: 'Community Elder', message: 'We should add more context about the seasonal availability of herbs.', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, user: 'Cultural Researcher', message: 'Good point. I\'ll research the harvesting cycles.', timestamp: new Date(Date.now() - 1800000) },
      { id: 3, user: 'Local Healer', message: 'Remember to include the spiritual preparations before harvesting.', timestamp: new Date(Date.now() - 600000) }
    ]
  }

  useEffect(() => {
    // Load document data
    setTitle(sampleDocument.title)
    setContent(sampleDocument.content)
    setCollaborators(sampleDocument.collaborators)
    setChatMessages(sampleDocument.chat)
    setActiveUsers(sampleDocument.collaborators.filter(user => user.online))

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveUsers(prev => 
        prev.map(user => ({
          ...user,
          online: Math.random() > 0.1 // 90% chance of staying online
        }))
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [documentId])

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSave = () => {
    setIsEditing(false)
    onSave?.({
      id: documentId,
      title,
      content,
      lastModified: new Date()
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: 'AfriVerse Collaborative Document',
      text: `Check out this cultural knowledge document: ${title}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Document link copied to clipboard!')
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      user: 'You',
      message: newMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-primary-cyan/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-cormorant font-bold bg-transparent border-b border-primary-cyan text-primary-white focus:outline-none focus:border-primary-cyan"
                placeholder="Document Title"
              />
            ) : (
              <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                {title}
              </h2>
            )}
            
            <div className="flex items-center space-x-2">
              {isPublic ? (
                <Unlock className="w-4 h-4 text-green-400" />
              ) : (
                <Lock className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-sm text-primary-white/50">
                {isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPublic(!isPublic)}
              className={`p-2 rounded-lg border transition-colors ${
                isPublic 
                  ? 'bg-green-500/20 text-green-400 border-green-400/20' 
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/20'
              }`}
            >
              {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2 bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/20 rounded-lg hover:bg-primary-cyan/30 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg border transition-colors ${
                isEditing 
                  ? 'bg-primary-cyan text-primary-navy border-transparent' 
                  : 'bg-primary-cyan/20 text-primary-cyan border-primary-cyan/20'
              }`}
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>

            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="gold-gradient text-primary-navy p-2 rounded-lg hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Collaborators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary-cyan" />
            <span className="text-sm text-primary-white/70">Collaborators:</span>
            <div className="flex -space-x-2">
              {collaborators.map((user) => (
                <div
                  key={user.id}
                  className={`relative w-8 h-8 rounded-full border-2 border-primary-navy flex items-center justify-center text-sm ${
                    user.online ? 'bg-primary-cyan/20' : 'bg-primary-white/20'
                  }`}
                  title={`${user.name} (${user.role})`}
                >
                  {user.avatar}
                  {user.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-navy"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-primary-white/50">
            {activeUsers.length} online now
          </div>
        </div>
      </div>

      <div className="flex" style={{ height: '600px' }}>
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            {isEditing ? (
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-transparent text-primary-white resize-none focus:outline-none leading-relaxed font-mono text-sm"
                placeholder="Start documenting cultural knowledge..."
              />
            ) : (
              <div className="prose prose-invert max-w-none">
                <pre className="text-primary-white whitespace-pre-wrap font-mono text-sm">
                  {content}
                </pre>
              </div>
            )}
          </div>

          {/* Editor Status Bar */}
          <div className="p-4 border-t border-primary-cyan/20 flex items-center justify-between text-sm text-primary-white/50">
            <div>
              {isEditing ? 'Editing' : 'Viewing'} • {content.length} characters
            </div>
            <div>
              Last saved: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 border-l border-primary-cyan/20 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-primary-cyan/20">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-primary-cyan" />
              <span className="font-semibold text-primary-white">Collaboration Chat</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatRef}
            className="flex-1 p-4 overflow-y-auto space-y-4"
          >
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${
                  message.user === 'You' 
                    ? 'bg-primary-cyan/20 ml-8' 
                    : 'bg-primary-navy/50 mr-8'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    message.user === 'You' ? 'text-primary-cyan' : 'text-primary-gold'
                  }`}>
                    {message.user}
                  </span>
                  <span className="text-xs text-primary-white/50">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-primary-white/80 text-sm">
                  {message.message}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-primary-cyan/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white text-sm placeholder-primary-white/30 focus:outline-none focus:border-primary-cyan"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="gold-gradient text-primary-navy p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Collaborative Editing Features */}
      <div className="p-4 border-t border-primary-cyan/20 bg-primary-navy/50">
        <h4 className="font-semibold text-primary-white text-sm mb-3">Collaborative Features</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            { feature: 'Real-time Editing', status: 'Active', color: 'text-green-400' },
            { feature: 'Version History', status: 'Enabled', color: 'text-blue-400' },
            { feature: 'Comments', status: 'Available', color: 'text-yellow-400' },
            { feature: 'Export Options', status: 'PDF, Markdown', color: 'text-purple-400' }
          ].map((item, index) => (
            <div key={index} className="text-center p-2 bg-primary-navy/30 rounded border border-primary-cyan/10">
              <div className="text-primary-white/70">{item.feature}</div>
              <div className={item.color}>{item.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}