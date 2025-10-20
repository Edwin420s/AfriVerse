'use client'
import { useState, useEffect, useCallback } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications from localStorage on mount
    const saved = localStorage.getItem('afriverse_notifications')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNotifications(parsed)
        updateUnreadCount(parsed)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
  }, [])

  const updateUnreadCount = useCallback((notifs) => {
    const unread = notifs.filter(n => !n.read).length
    setUnreadCount(unread)
  }, [])

  const saveNotifications = useCallback((notifs) => {
    setNotifications(notifs)
    updateUnreadCount(notifs)
    localStorage.setItem('afriverse_notifications', JSON.stringify(notifs))
  }, [updateUnreadCount])

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }
    
    const updated = [newNotification, ...notifications].slice(0, 50) // Keep last 50
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  const markAsRead = useCallback((id) => {
    const updated = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    )
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  const markAllAsRead = useCallback(() => {
    const updated = notifications.map(notification => ({ ...notification, read: true }))
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  const removeNotification = useCallback((id) => {
    const updated = notifications.filter(notification => notification.id !== id)
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  const clearAll = useCallback(() => {
    saveNotifications([])
  }, [saveNotifications])

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
}