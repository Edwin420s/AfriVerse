'use client'
import { useState, useRef, useCallback } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (err) {
      setError('Microphone access is required for voice recording.')
      console.error('Error starting recording:', err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const clearRecording = useCallback(() => {
    setAudioBlob(null)
    setAudioUrl(null)
    setError(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const getRecordingTime = useCallback(() => {
    // This would track recording duration
    return 0
  }, [])

  return {
    isRecording,
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    clearRecording,
    getRecordingTime
  }
}