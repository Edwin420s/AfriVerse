'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Brain, Volume2, Languages, Clock } from 'lucide-react'

export default function VoiceAssistant({ onTranscript, className = "" }) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  const [supportedLanguages, setSupportedLanguages] = useState([
    { code: 'en', name: 'English', native: 'English' },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
    { code: 'yo', name: 'Yoruba', native: 'Yorùbá' },
    { code: 'ig', name: 'Igbo', native: 'Igbo' },
    { code: 'ha', name: 'Hausa', native: 'Hausa' },
    { code: 'am', name: 'Amharic', native: 'አማርኛ' }
  ])
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [recordingTime, setRecordingTime] = useState(0)

  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = selectedLanguage

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      startAudioAnalysis()
      startTimer()
    }

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(finalTranscript || interimTranscript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      stopListening()
    }

    recognitionRef.current.onend = () => {
      stopListening()
    }

    return () => {
      stopListening()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [selectedLanguage])

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const analyzeAudio = () => {
        if (!analyserRef.current) return
        
        analyserRef.current.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const average = sum / bufferLength
        setAudioLevel(average / 256) // Normalize to 0-1
        
        animationFrameRef.current = requestAnimationFrame(analyzeAudio)
      }
      
      analyzeAudio()
    } catch (error) {
      console.error('Error starting audio analysis:', error)
    }
  }

  const startTimer = () => {
    setRecordingTime(0)
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    setIsListening(false)
    setIsProcessing(true)
    stopTimer()
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      if (transcript) {
        onTranscript?.({
          text: transcript,
          language: selectedLanguage,
          duration: recordingTime
        })
      }
    }, 2000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getLanguageName = (code) => {
    const lang = supportedLanguages.find(l => l.code === code)
    return lang ? `${lang.name} (${lang.native})` : code
  }

  return (
    <div className={`bg-primary-navy/30 rounded-xl border border-primary-cyan/20 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-primary-white mb-2">
            Voice Knowledge Capture
          </h3>
          <p className="text-primary-white/70 text-sm">
            Speak your cultural knowledge in your native language
          </p>
        </div>
        <div className="text-primary-cyan">
          <Brain className="w-8 h-8" />
        </div>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-primary-white mb-2">
          Select Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          disabled={isListening}
          className="w-full p-3 bg-primary-navy/50 border border-primary-cyan/20 rounded-lg text-primary-white focus:outline-none focus:border-primary-cyan disabled:opacity-50"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name} - {lang.native}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Visualization */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-primary-white/70">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Voice Activity</span>
          </div>
          {isListening && (
            <div className="flex items-center space-x-2 text-primary-cyan text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>

        <div className="h-20 bg-primary-navy/50 rounded-lg border border-primary-cyan/20 p-4">
          {isListening ? (
            <div className="flex items-end justify-center space-x-1 h-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${20 + (audioLevel * 80)}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="w-1 bg-gradient-to-t from-primary-cyan to-primary-gold rounded-full"
                  style={{ height: `${20 + (Math.random() * 60)}%` }}
                />
              ))}
            </div>
          ) : isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="spinner w-8 h-8 border-2 border-primary-navy border-t-primary-cyan rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-primary-white/70 text-sm">Processing speech...</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-primary-white/50">
                <Mic className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Click microphone to start speaking</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-white mb-2">
            Transcript
          </label>
          <div className="bg-primary-navy/50 border border-primary-cyan/20 rounded-lg p-4 min-h-20">
            <p className="text-primary-white/80 leading-relaxed">
              {transcript}
            </p>
            <div className="flex items-center justify-between mt-2 text-xs text-primary-white/50">
              <span>{getLanguageName(selectedLanguage)}</span>
              <span>{transcript.split(' ').length} words</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: isListening ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-lg font-semibold transition-all ${
            isListening
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/20'
              : 'gold-gradient text-primary-navy hover:shadow-lg border border-transparent'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <>
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Start Speaking</span>
            </>
          )}
        </motion.button>

        {transcript && !isListening && !isProcessing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTranscript('')}
            className="px-6 py-4 border border-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors"
          >
            Clear
          </motion.button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-primary-cyan/10 rounded-lg border border-primary-cyan/20">
        <h4 className="font-semibold text-primary-cyan text-sm mb-2">
          Speaking Tips
        </h4>
        <ul className="text-primary-white/70 text-xs space-y-1">
          <li>• Speak clearly and at a natural pace</li>
          <li>• Use your native language for authentic expression</li>
          <li>• Include cultural context and stories</li>
          <li>• Record in a quiet environment for best results</li>
          <li>• Speak for at least 30 seconds for comprehensive capture</li>
        </ul>
      </div>
    </div>
  )
}