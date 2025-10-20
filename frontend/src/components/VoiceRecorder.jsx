'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mic, Square, Play, Trash2 } from 'lucide-react'

export default function VoiceRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        onRecordingComplete?.(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Microphone access is required for voice recording.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
  }

  return (
    <div className="space-y-4">
      {!audioBlob ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-3 transition-all ${
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'cyan-gradient text-primary-navy hover:shadow-lg'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </>
          )}
        </motion.button>
      ) : (
        <div className="space-y-4">
          <audio
            controls
            src={audioUrl}
            className="w-full"
          />
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearRecording}
              className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRecordingComplete?.(audioBlob)}
              className="flex-1 py-3 gold-gradient text-primary-navy rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              <span>Use Recording</span>
            </motion.button>
          </div>
        </div>
      )}

      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center space-x-2 text-primary-cyan"
        >
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-primary-cyan rounded-full"
              />
            ))}
          </div>
          <span className="text-sm">Recording in progress...</span>
        </motion.div>
      )}
    </div>
  )
}