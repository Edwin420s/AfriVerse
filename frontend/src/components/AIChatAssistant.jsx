'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, X, Minimize2, Maximize2, Brain, Book, Search } from 'lucide-react'

export default function AIChatAssistant({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AfriVerse AI assistant. I can help you explore cultural knowledge, find specific information, or guide you through contributing wisdom. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you're interested in African indigenous knowledge. Let me search our cultural database for relevant information...",
        "That's a fascinating question about traditional practices. Based on our knowledge graph, I found several related entries that might interest you.",
        "I can help you contribute that wisdom to AfriVerse. Would you like me to guide you through the submission process?",
        "The cultural knowledge you're asking about is preserved in our decentralized archive. Let me show you the related symbolic representations.",
        "I've analyzed your query using our AGI systems. Here's what I discovered in the cultural memory network..."
      ]
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 2000)
  }

  const quickQuestions = [
    "How do I contribute knowledge?",
    "Show me medicinal plants",
    "Explain cultural validation",
    "What languages are supported?",
    "How does AGI preserve culture?"
  ]

  const handleQuickQuestion = (question) => {
    setInputMessage(question)
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your AfriVerse AI assistant. How can I help you explore cultural knowledge today?',
        timestamp: new Date()
      }
    ])
  }

  return (
    <>
      {/* Chat Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 gold-gradient p-4 rounded-full shadow-lg z-40"
        >
          <Brain className="w-6 h-6 text-primary-navy" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed bottom-6 right-6 bg-primary-navy/95 backdrop-blur-md border border-primary-cyan/20 rounded-xl shadow-2xl z-50 ${
              isMinimized ? 'w-80' : 'w-96'
            } ${className}`}
            style={{ height: isMinimized ? 'auto' : '600px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary-cyan/20">
              <div className="flex items-center space-x-3">
                <div className="gold-gradient p-2 rounded-lg">
                  <Bot className="w-5 h-5 text-primary-navy" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-white">Cultural AI Assistant</h3>
                  <p className="text-primary-white/50 text-xs">Powered by AGI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 text-primary-white/50 hover:text-primary-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-primary-white/50 hover:text-primary-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start space-x-3 ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'gold-gradient' : 'cyan-gradient'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-primary-navy" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary-navy" />
                        )}
                      </div>
                      
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'gold-gradient text-primary-navy' 
                          : 'bg-primary-navy/50 border border-primary-cyan/20 text-primary-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="cyan-gradient w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-navy" />
                      </div>
                      <div className="bg-primary-navy/50 border border-primary-cyan/20 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                <div className="p-4 border-t border-primary-cyan/20">
                  <p className="text-primary-white/70 text-sm mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="px-3 py-1 bg-primary-navy/50 border border-primary-cyan/20 text-primary-cyan rounded-full text-xs hover:bg-primary-cyan/20 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-primary-cyan/20">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about cultural knowledge..."
                      className="flex-1 p-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white placeholder-primary-white/50 focus:outline-none focus:border-primary-cyan"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="gold-gradient text-primary-navy p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={clearChat}
                      className="text-primary-white/50 hover:text-primary-white text-xs transition-colors"
                    >
                      Clear chat
                    </button>
                    <div className="flex items-center space-x-2 text-xs text-primary-white/50">
                      <Book className="w-3 h-3" />
                      <span>Cultural AI • AGI-Powered</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isMinimized && (
              <div className="p-4 text-center">
                <p className="text-primary-white/70 text-sm">AI Assistant is minimized</p>
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-primary-cyan hover:text-primary-cyan/80 text-xs mt-1"
                >
                  Click to expand
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
