'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function FileUpload({ 
  onFileSelect, 
  acceptedTypes = ['audio/*', 'video/*', '.txt', '.pdf', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "" 
}) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const file = files[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }

    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type)
      }
      return file.type.startsWith(type.replace('/*', ''))
    })

    if (!isAccepted) {
      setError(`File type not supported. Accepted: ${acceptedTypes.join(', ')}`)
      return
    }

    setError('')
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onFileSelect?.(null)
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('audio/')) return '🎵'
    if (file.type.startsWith('video/')) return '🎬'
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type === 'text/plain') return '📄'
    if (file.type.includes('pdf')) return '📕'
    if (file.type.includes('document')) return '📝'
    return '📎'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-primary-cyan bg-primary-cyan/10'
            : 'border-primary-cyan/20 hover:border-primary-cyan/40'
        } ${error ? 'border-red-400 bg-red-400/10' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-3">
          <div className="text-primary-cyan">
            <Upload className="w-12 h-12 mx-auto" />
          </div>
          <div>
            <p className="text-lg font-semibold text-primary-white mb-2">
              {selectedFile ? 'File Selected' : 'Upload File'}
            </p>
            <p className="text-primary-white/70 text-sm">
              {selectedFile 
                ? 'Click or drag to change file'
                : 'Drag & drop or click to browse'
              }
            </p>
          </div>
          <div className="text-primary-white/50 text-xs">
            Supported: {acceptedTypes.join(', ')} • Max: {formatFileSize(maxSize)}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-400/20 rounded-lg text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Selected File */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getFileIcon(selectedFile)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-primary-white text-sm truncate">
                {selectedFile.name}
              </p>
              <p className="text-primary-white/50 text-xs">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <button
              onClick={removeFile}
              className="p-1 text-primary-white/50 hover:text-primary-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* File Type Examples */}
      {!selectedFile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { type: 'Audio', icon: '🎵', formats: 'MP3, WAV, M4A' },
            { type: 'Video', icon: '🎬', formats: 'MP4, MOV, AVI' },
            { type: 'Text', icon: '📄', formats: 'TXT, PDF, DOC' },
            { type: 'Images', icon: '🖼️', formats: 'JPG, PNG, WEBP' }
          ].map((item, index) => (
            <div
              key={index}
              className="p-3 bg-primary-navy/50 border border-primary-cyan/10 rounded-lg text-center"
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="font-medium text-primary-white">{item.type}</div>
              <div className="text-primary-white/50">{item.formats}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}