/**
 * useRealTime Hook
 * Custom hook for real-time data synchronization using WebSocket or Server-Sent Events
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export default function useRealTime(endpoint, options = {}) {
  const {
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onConnect = null,
    onDisconnect = null,
    onError = null,
    onMessage = null
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)
  const [reconnectCount, setReconnectCount] = useState(0)

  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const shouldReconnectRef = useRef(true)

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const wsUrl = endpoint.startsWith('ws') 
        ? endpoint 
        : `ws://${window.location.host}${endpoint}`

      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        setReconnectCount(0)
        onConnect?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          onMessage?.(data)
        } catch (err) {
          console.error('Failed to parse message:', err)
          setLastMessage(event.data)
          onMessage?.(event.data)
        }
      }

      ws.onerror = (err) => {
        console.error('WebSocket error:', err)
        setError('Connection error')
        onError?.(err)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        onDisconnect?.()

        // Attempt to reconnect
        if (shouldReconnectRef.current && reconnectCount < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1)
            connect()
          }, reconnectInterval)
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('WebSocket connection failed:', err)
      setError(err.message)
      onError?.(err)
    }
  }, [endpoint, reconnectCount, maxReconnectAttempts, reconnectInterval, onConnect, onDisconnect, onError, onMessage])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
  }, [])

  // Send message through WebSocket
  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      wsRef.current.send(message)
      return true
    }
    console.warn('WebSocket not connected')
    return false
  }, [])

  // Subscribe to specific event type
  const subscribe = useCallback((eventType, callback) => {
    const handler = (data) => {
      if (data.type === eventType) {
        callback(data)
      }
    }

    // Store handler reference for cleanup
    return handler
  }, [])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    isConnected,
    lastMessage,
    error,
    reconnectCount,
    connect,
    disconnect,
    send,
    subscribe
  }
}

// Hook for Server-Sent Events (SSE)
export function useServerSentEvents(endpoint, options = {}) {
  const {
    autoConnect = true,
    onConnect = null,
    onMessage = null,
    onError = null
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)

  const eventSourceRef = useRef(null)

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return
    }

    try {
      const eventSource = new EventSource(endpoint)

      eventSource.onopen = () => {
        console.log('SSE connected')
        setIsConnected(true)
        setError(null)
        onConnect?.()
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          onMessage?.(data)
        } catch (err) {
          setLastMessage(event.data)
          onMessage?.(event.data)
        }
      }

      eventSource.onerror = (err) => {
        console.error('SSE error:', err)
        setError('Connection error')
        setIsConnected(false)
        onError?.(err)
        eventSource.close()
        eventSourceRef.current = null
      }

      eventSourceRef.current = eventSource
    } catch (err) {
      console.error('SSE connection failed:', err)
      setError(err.message)
      onError?.(err)
    }
  }, [endpoint, onConnect, onMessage, onError])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect
  }
}

// Hook for polling (fallback when WebSocket/SSE not available)
export function usePolling(fetchFunction, interval = 5000, options = {}) {
  const {
    autoStart = true,
    onSuccess = null,
    onError = null
  } = options

  const [data, setData] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState(null)

  const intervalRef = useRef(null)

  const start = useCallback(() => {
    if (intervalRef.current) {
      return
    }

    setIsPolling(true)

    const poll = async () => {
      try {
        const result = await fetchFunction()
        setData(result)
        setError(null)
        onSuccess?.(result)
      } catch (err) {
        console.error('Polling error:', err)
        setError(err.message)
        onError?.(err)
      }
    }

    // Initial fetch
    poll()

    // Set up interval
    intervalRef.current = setInterval(poll, interval)
  }, [fetchFunction, interval, onSuccess, onError])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setIsPolling(false)
    }
  }, [])

  useEffect(() => {
    if (autoStart) {
      start()
    }

    return () => {
      stop()
    }
  }, [autoStart, start, stop])

  return {
    data,
    isPolling,
    error,
    start,
    stop
  }
}

// Hook for real-time presence (who's online)
export function usePresence(roomId, userId) {
  const [users, setUsers] = useState([])
  const { isConnected, send, subscribe } = useRealTime('/api/presence')

  useEffect(() => {
    if (isConnected && roomId && userId) {
      // Join room
      send({
        type: 'join',
        roomId,
        userId,
        timestamp: new Date().toISOString()
      })

      // Listen for presence updates
      const handler = subscribe('presence_update', (data) => {
        if (data.roomId === roomId) {
          setUsers(data.users || [])
        }
      })

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        send({
          type: 'heartbeat',
          roomId,
          userId,
          timestamp: new Date().toISOString()
        })
      }, 30000)

      return () => {
        clearInterval(heartbeatInterval)
        // Leave room
        send({
          type: 'leave',
          roomId,
          userId,
          timestamp: new Date().toISOString()
        })
      }
    }
  }, [isConnected, roomId, userId, send, subscribe])

  return {
    users,
    isConnected
  }
}

// Export all hooks
export default useRealTime
