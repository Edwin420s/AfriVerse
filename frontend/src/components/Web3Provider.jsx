'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, AlertCircle, CheckCircle, X } from 'lucide-react'

const Web3Context = createContext()

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export default function Web3Provider({ children }) {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true)
      checkConnectedAccount()
    }
  }, [])

  const checkConnectedAccount = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        setAccount(accounts[0])
      }
    } catch (err) {
      console.error('Error checking connected account:', err)
    }
  }

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
      }
    } catch (err) {
      console.error('Error connecting wallet:', err)
      if (err.code === 4001) {
        setError('Please connect your MetaMask wallet to continue.')
      } else {
        setError('Failed to connect wallet. Please try again.')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setError(null)
  }

  const signMessage = async (message) => {
    if (!account) {
      throw new Error('No wallet connected')
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      })
      return signature
    } catch (err) {
      console.error('Error signing message:', err)
      throw err
    }
  }

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null)
        } else {
          setAccount(accounts[0])
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {})
        window.ethereum.removeListener('chainChanged', () => {})
      }
    }
  }, [])

  const value = {
    account,
    isConnecting,
    error,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    signMessage,
    setError
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
      
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-red-500/90 border border-red-400 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="flex-shrink-0 hover:bg-red-400/20 rounded p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast for Connections */}
      <AnimatePresence>
        {account && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 z-50 max-w-sm"
          >
            <div className="bg-green-500/90 border border-green-400 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Wallet Connected</p>
                  <p className="text-xs opacity-80 font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Web3Context.Provider>
  )
}