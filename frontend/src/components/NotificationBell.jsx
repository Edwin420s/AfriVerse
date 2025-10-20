'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, AlertTriangle, Info, X, Clock } from 'lucide-react'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Contribution Approved',
      message: 'Your submission "Healing Properties of Aloe Vera" has been validated',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Validation Required',
      message: '5 new entries need community validation',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New Feature',
      message: 'Voice recording is now available on mobile',
      time: '2 days ago',
      read: true
    }
  ])

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />
      default:
        return <Bell className="w-4 h-4 text-primary-cyan" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-primary-white/70 hover:text-primary-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-primary-navy/95 backdrop-blur-md border border-primary-cyan/20 rounded-lg shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary-cyan/20">
              <h3 className="font-semibold text-primary-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-primary-cyan hover:text-primary-cyan/80 text-sm transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-primary-white/50 hover:text-primary-white text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-primary-cyan/10">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-primary-navy/50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-primary-cyan/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`font-medium text-sm ${
                              !notification.read ? 'text-primary-white' : 'text-primary-white/70'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-cyan rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-primary-white/70 text-sm mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-primary-white/50">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-primary-white/30 mx-auto mb-3" />
                  <p className="text-primary-white/70 text-sm">No notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-primary-cyan/20">
              <button className="w-full text-center text-primary-cyan hover:text-primary-cyan/80 text-sm transition-colors">
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}