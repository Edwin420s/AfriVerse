'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Menu, X, Users, Book, Shield, User } from 'lucide-react'
import WalletConnect from './WalletConnect'
import NotificationBell from './NotificationBell'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Explore', href: '/explore', icon: <Book className="w-4 h-4" /> },
    { name: 'Contribute', href: '/submit', icon: <Users className="w-4 h-4" /> },
    { name: 'Validate', href: '/validator', icon: <Shield className="w-4 h-4" /> },
    { name: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
  ]

  return (
    <header className="bg-primary-navy/80 backdrop-blur-md border-b border-primary-cyan/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="gold-gradient p-2 rounded-lg">
                <Brain className="w-6 h-6 text-primary-navy" />
              </div>
              <span className="text-xl font-cormorant font-bold gradient-text">
                AfriVerse
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-primary-white/80 hover:text-primary-cyan transition-colors duration-200 cursor-pointer"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Wallet & Mobile menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <NotificationBell />
              <WalletConnect />
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden text-primary-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-primary-cyan/20"
            >
              <div className="py-4 space-y-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 text-primary-white/80 hover:text-primary-cyan transition-colors duration-200 py-2 cursor-pointer"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                ))}
                <div className="pt-4 border-t border-primary-cyan/20 flex items-center justify-between">
                  <NotificationBell />
                  <WalletConnect />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
