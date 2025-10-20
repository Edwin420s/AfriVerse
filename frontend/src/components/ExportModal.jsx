'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, FileText, Image, Code, Share2, CheckCircle } from 'lucide-react'

export default function ExportModal({ isOpen, onClose, content, metadata, className = "" }) {
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [includeImages, setIncludeImages] = useState(true)
  const [exportQuality, setExportQuality] = useState('high')
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Standard document format for printing and sharing',
      icon: FileText,
      color: 'text-red-400'
    },
    {
      id: 'markdown',
      name: 'Markdown',
      description: 'Plain text format with lightweight markup',
      icon: Code,
      color: 'text-blue-400'
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'Structured data format for developers and APIs',
      icon: Code,
      color: 'text-green-400'
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'Web page format with full styling',
      icon: Code,
      color: 'text-orange-400'
    },
    {
      id: 'text',
      name: 'Plain Text',
      description: 'Simple text format without formatting',
      icon: FileText,
      color: 'text-gray-400'
    }
  ]

  const qualityOptions = [
    { id: 'low', name: 'Low', description: 'Small file size, basic formatting' },
    { id: 'medium', name: 'Medium', description: 'Balanced quality and size' },
    { id: 'high', name: 'High', description: 'Best quality, larger file size' }
  ]

  const handleExport = async () => {
    setIsExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsExporting(false)
    setExportComplete(true)
    
    // Reset after success
    setTimeout(() => {
      setExportComplete(false)
      onClose()
    }, 3000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: metadata?.title || 'Cultural Knowledge Document',
          text: `Check out this cultural knowledge from AfriVerse`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`bg-primary-navy/95 backdrop-blur-md border border-primary-cyan/20 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary-cyan/20">
            <div>
              <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                Export Document
              </h2>
              <p className="text-primary-white/70 text-sm">
                Choose format and options for exporting cultural knowledge
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-primary-white/50 hover:text-primary-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {exportComplete ? (
            // Success State
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>
              <h3 className="text