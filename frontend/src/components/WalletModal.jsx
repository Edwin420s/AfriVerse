'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, ExternalLink, Download, CheckCircle, ArrowLeft } from 'lucide-react'

const walletProviders = [
  {
    name: 'MetaMask',
    id: 'metamask',
    icon: '🦊',
    description: 'Connect with MetaMask wallet',
    downloadUrl: 'https://metamask.io/download/',
  },
  {
    name: 'WalletConnect',
    id: 'walletconnect',
    icon: '🔗',
    description: 'Scan with WalletConnect',
    downloadUrl: 'https://walletconnect.com/',
  },
  {
    name: 'Coinbase Wallet',
    id: 'coinbase',
    icon: '🔵',
    description: 'Connect with Coinbase Wallet',
    downloadUrl: 'https://www.coinbase.com/wallet',
  },
  {
    name: 'Trust Wallet',
    id: 'trust',
    icon: '🛡️',
    description: 'Connect with Trust Wallet',
    downloadUrl: 'https://trustwallet.com/',
  },
  {
    name: 'Phantom',
    id: 'phantom',
    icon: '👻',
    description: 'Connect with Phantom wallet',
    downloadUrl: 'https://phantom.app/',
  },
  {
    name: 'Rainbow',
    id: 'rainbow',
    icon: '🌈',
    description: 'Connect with Rainbow wallet',
    downloadUrl: 'https://rainbow.me/',
  },
]

export default function WalletModal({ isOpen, onClose, onConnect }) {
  const [installedWallets, setInstalledWallets] = useState([])
  const [notInstalledWallets, setNotInstalledWallets] = useState([])

  useEffect(() => {
    if (isOpen) {
      checkInstalledWallets()
    }
  }, [isOpen])

  const checkInstalledWallets = () => {
    const installed = []
    const notInstalled = []

    walletProviders.forEach(wallet => {
      let isInstalled = false
      
      switch(wallet.id) {
        case 'metamask':
          isInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
          break
        case 'coinbase':
          isInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet
          break
        case 'trust':
          isInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isTrust
          break
        case 'phantom':
          isInstalled = typeof window.phantom !== 'undefined'
          break
        case 'rainbow':
          isInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isRainbow
          break
        default:
          isInstalled = false
      }

      if (isInstalled) {
        installed.push(wallet)
      } else {
        notInstalled.push(wallet)
      }
    })

    setInstalledWallets(installed)
    setNotInstalledWallets(notInstalled)
  }

  const handleWalletClick = async (walletId) => {
    try {
      await onConnect(walletId)
      onClose()
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const handleDownload = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - semi-transparent, click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Dropdown Modal - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: 10 }}
            className="fixed top-20 right-4 z-50 bg-primary-navy border-2 border-primary-cyan/40 rounded-2xl shadow-2xl w-[420px] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="p-5 border-b border-primary-cyan/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="gold-gradient p-2 rounded-lg">
                      <Wallet className="w-6 h-6 text-primary-navy" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-cormorant font-bold text-primary-white">
                        Connect Wallet
                      </h2>
                      <p className="text-sm text-primary-white/60">
                        Choose your preferred wallet
                      </p>
                    </div>
                  </div>
                  
                  {/* Close X Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-primary-cyan/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-primary-white/70" />
                  </motion.button>
                </div>
              </div>

              {/* Wallet Options */}
              <div className="p-5 space-y-5">
                {/* Installed Wallets */}
                {installedWallets.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3 bg-green-500/10 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h3 className="text-base font-bold text-primary-white">
                        ✓ Installed ({installedWallets.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {installedWallets.map((wallet) => (
                        <motion.button
                          key={wallet.id}
                          whileHover={{ scale: 1.03, x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleWalletClick(wallet.id)}
                          className="w-full flex items-center justify-between p-3 bg-green-500/10 hover:bg-green-500/20 border-2 border-green-500/40 hover:border-green-500/60 rounded-lg transition-all group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{wallet.icon}</div>
                            <div className="text-left">
                              <h3 className="text-base font-bold text-primary-white">
                                {wallet.name}
                              </h3>
                              <p className="text-xs text-green-400">
                                ✓ Ready
                              </p>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-green-500/30 text-green-300 rounded-lg text-xs font-bold">
                            Connect
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Not Installed Wallets */}
                {notInstalledWallets.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3 bg-primary-gold/10 p-2 rounded-lg">
                      <Download className="w-5 h-5 text-primary-gold" />
                      <h3 className="text-base font-bold text-primary-white">
                        ↓ Available ({notInstalledWallets.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {notInstalledWallets.map((wallet) => (
                        <motion.button
                          key={wallet.id}
                          whileHover={{ scale: 1.03, x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleDownload(wallet.downloadUrl)}
                          className="w-full flex items-center justify-between p-3 bg-primary-navy/60 hover:bg-primary-cyan/10 border-2 border-primary-cyan/20 hover:border-primary-gold/50 rounded-lg transition-all group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl opacity-50">{wallet.icon}</div>
                            <div className="text-left">
                              <h3 className="text-base font-bold text-primary-white/90">
                                {wallet.name}
                              </h3>
                              <p className="text-xs text-primary-white/60">
                                Click to download
                              </p>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-primary-gold group-hover:scale-110 transition-transform" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer - Help Text */}
              <div className="p-4 border-t border-primary-cyan/20 bg-primary-navy/50">
                <div className="flex items-start space-x-2">
                  <div className="text-primary-gold mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-xs text-primary-white/70">
                    <p className="font-bold text-primary-white mb-1">New to Web3?</p>
                    <p>Start with <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-primary-cyan hover:text-primary-gold underline">MetaMask</a> - easy to use!</p>
                  </div>
                </div>
              </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
