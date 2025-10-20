'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Cube, Scan, X, RotateCcw, Download, Share2 } from 'lucide-react'

export default function ARViewer({ artifact, className = "" }) {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isViewing, setIsViewing] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Check for AR support
    checkARSupport()
    return () => {
      stopCamera()
    }
  }, [])

  const checkARSupport = async () => {
    try {
      // Check for camera support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported on this device')
        setIsLoading(false)
        return
      }

      // Check for WebGL support for 3D rendering
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setCameraError('3D rendering not supported')
        setIsLoading(false)
        return
      }

      setIsARSupported(true)
      setIsLoading(false)
    } catch (error) {
      console.error('AR support check failed:', error)
      setCameraError('AR features not available')
      setIsLoading(false)
    }
  }

  const startARView = async () => {
    try {
      setIsLoading(true)
      setCameraError('')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setIsViewing(true)
      setIsLoading(false)
      
      // Start AR tracking and rendering
      startARTracking()
    } catch (error) {
      console.error('Failed to start AR view:', error)
      setCameraError('Failed to access camera. Please ensure camera permissions are granted.')
      setIsLoading(false)
    }
  }

  const startARTracking = () => {
    // In a real implementation, this would use AR.js, Three.js AR, or similar
    // For this demo, we'll simulate AR tracking
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    
    const render = () => {
      if (!isViewing) return

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Simulate AR object rendering
      drawARObject(ctx, canvas.width, canvas.height)
      
      requestAnimationFrame(render)
    }

    render()
  }

  const drawARObject = (ctx, width, height) => {
    // Draw a simulated 3D artifact in the center
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.3

    // Draw artifact outline
    ctx.strokeStyle = '#00ADB5'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.rect(centerX - size/2, centerY - size/2, size, size)
    ctx.stroke()

    // Draw artifact content
    ctx.fillStyle = 'rgba(255, 211, 105, 0.3)'
    ctx.fillRect(centerX - size/2, centerY - size/2, size, size)

    // Draw artifact details
    ctx.fillStyle = '#FFD369'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(artifact?.name || 'Cultural Artifact', centerX, centerY)

    // Draw tracking points
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2
      const x = centerX + Math.cos(angle) * size * 0.8
      const y = centerY + Math.sin(angle) * size * 0.8
      
      ctx.fillStyle = '#00ADB5'
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsViewing(false)
  }

  const captureImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `afriverse-ar-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const shareExperience = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AfriVerse AR Experience',
          text: `Viewing ${artifact?.name} in Augmented Reality`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 flex items-center justify-center ${className}`} style={{ height: '500px' }}>
        <div className="text-center">
          <div className="spinner w-8 h-8 border-2 border-primary-navy border-t-primary-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-white/70 text-sm">Loading AR Experience...</p>
        </div>
      </div>
    )
  }

  if (cameraError) {
    return (
      <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-8 text-center ${className}`}>
        <Scan className="w-16 h-16 text-primary-white/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-white mb-2">AR Not Available</h3>
        <p className="text-primary-white/70 mb-4">{cameraError}</p>
        <button
          onClick={checkARSupport}
          className="gold-gradient text-primary-navy px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-primary-cyan/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-cormorant font-bold text-primary-white mb-2">
              Augmented Reality View
            </h2>
            <p className="text-primary-white/70">
              Experience cultural artifacts in your environment
            </p>
          </div>
          {isViewing && (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={captureImage}
                className="p-2 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg text-primary-cyan hover:bg-primary-cyan/20 transition-colors"
                title="Capture Image"
              >
                <Download className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareExperience}
                className="p-2 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg text-primary-cyan hover:bg-primary-cyan/20 transition-colors"
                title="Share Experience"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* AR View Container */}
      <div className="relative" style={{ height: '500px' }}>
        {!isViewing ? (
          // Start AR View
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <Cube className="w-24 h-24 text-primary-cyan mx-auto mb-6" />
              <h3 className="text-2xl font-cormorant font-bold text-primary-white mb-4">
                View in Augmented Reality
              </h3>
              <p className="text-primary-white/70 mb-6 max-w-md">
                Place this cultural artifact in your environment using your device's camera. 
                Move around to explore from different angles.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startARView}
                className="gold-gradient text-primary-navy px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-3 mx-auto"
              >
                <Camera className="w-5 h-5" />
                <span>Start AR Experience</span>
              </motion.button>
              
              {/* Instructions */}
              <div className="mt-8 p-4 bg-primary-cyan/10 rounded-lg border border-primary-cyan/20 max-w-md mx-auto">
                <h4 className="font-semibold text-primary-cyan text-sm mb-2">AR Instructions</h4>
                <ul className="text-primary-white/70 text-xs space-y-1 text-left">
                  <li>• Find a well-lit, flat surface</li>
                  <li>• Grant camera permissions when prompted</li>
                  <li>• Move your device slowly for better tracking</li>
                  <li>• Tap to interact with the artifact</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Active AR View
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              width={1280}
              height={720}
            />
            
            {/* AR Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={stopCamera}
                className="p-3 bg-red-500/80 backdrop-blur-sm border border-red-400/20 rounded-full text-white hover:bg-red-500 transition-colors"
                title="Exit AR"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startARTracking}
                className="p-3 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-full text-primary-cyan hover:bg-primary-cyan/20 transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
            </div>

            {/* AR Instructions Overlay */}
            <div className="absolute top-4 left-4 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg p-3 max-w-xs">
              <p className="text-primary-white/70 text-sm">
                Move your device to explore the artifact. Tap the screen to interact.
              </p>
            </div>

            {/* Artifact Info Overlay */}
            <div className="absolute top-4 right-4 bg-primary-navy/80 backdrop-blur-sm border border-primary-cyan/20 rounded-lg p-4 max-w-sm">
              <h3 className="font-semibold text-primary-white mb-2">{artifact?.name}</h3>
              <p className="text-primary-white/70 text-sm mb-2">{artifact?.description}</p>
              <div className="flex items-center space-x-2 text-xs text-primary-white/50">
                <span>Community: {artifact?.community}</span>
                <span>•</span>
                <span>Type: {artifact?.type}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Artifact Details */}
      {artifact && !isViewing && (
        <div className="p-6 border-t border-primary-cyan/20">
          <h3 className="font-semibold text-primary-white mb-3">About this Artifact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-primary-white/70 mb-2">{artifact.description}</p>
              <div className="flex items-center space-x-4 text-primary-white/50">
                <span>Community: {artifact.community}</span>
                <span>•</span>
                <span>Age: {artifact.age}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-primary-white/70">Cultural Significance:</span>
                <span className="text-primary-cyan">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-white/70">Preservation Status:</span>
                <span className="text-primary-gold">Digitized</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-white/70">3D Model Quality:</span>
                <span className="text-green-400">High Resolution</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}