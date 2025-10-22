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
  const [connectedWallet, setConnectedWallet] = useState(null)
  const [chainId, setChainId] = useState(null)

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

  const connectWallet = async (walletType = 'metamask') => {
    setIsConnecting(true)
    setError(null)

    try {
      let accounts = []
      let chainIdHex = null

      switch (walletType) {
        case 'metamask':
          if (!window.ethereum) {
            setError('MetaMask is not installed. Please install it to continue.')
            window.open('https://metamask.io/download/', '_blank')
            return
          }
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          })
          chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
          setConnectedWallet('MetaMask')
          break

        case 'coinbase':
          if (window.coinbaseWalletExtension) {
            accounts = await window.coinbaseWalletExtension.request({
              method: 'eth_requestAccounts',
            })
            chainIdHex = await window.coinbaseWalletExtension.request({ method: 'eth_chainId' })
            setConnectedWallet('Coinbase Wallet')
          } else {
            setError('Coinbase Wallet is not installed.')
            window.open('https://www.coinbase.com/wallet', '_blank')
            return
          }
          break

        case 'trust':
          if (window.trustwallet) {
            accounts = await window.trustwallet.request({
              method: 'eth_requestAccounts',
            })
            chainIdHex = await window.trustwallet.request({ method: 'eth_chainId' })
            setConnectedWallet('Trust Wallet')
          } else {
            setError('Trust Wallet is not installed.')
            window.open('https://trustwallet.com/', '_blank')
            return
          }
          break

        case 'phantom':
          if (window.phantom?.ethereum) {
            accounts = await window.phantom.ethereum.request({
              method: 'eth_requestAccounts',
            })
            chainIdHex = await window.phantom.ethereum.request({ method: 'eth_chainId' })
            setConnectedWallet('Phantom')
          } else {
            setError('Phantom is not installed.')
            window.open('https://phantom.app/', '_blank')
            return
          }
          break

        case 'walletconnect':
          setError('WalletConnect integration coming soon!')
          return

        case 'rainbow':
          if (window.rainbow) {
            accounts = await window.rainbow.request({
              method: 'eth_requestAccounts',
            })
            chainIdHex = await window.rainbow.request({ method: 'eth_chainId' })
            setConnectedWallet('Rainbow')
          } else {
            setError('Rainbow wallet is not installed.')
            window.open('https://rainbow.me/', '_blank')
            return
          }
          break

        default:
          // Fallback to MetaMask
          if (!window.ethereum) {
            setError('No wallet detected. Please install a Web3 wallet.')
            return
          }
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          })
          chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
          setConnectedWallet('MetaMask')
      }

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setChainId(parseInt(chainIdHex, 16))
        // Store connection in localStorage
        localStorage.setItem('connectedWallet', walletType)
        localStorage.setItem('walletAccount', accounts[0])
      }
    } catch (err) {
      console.error('Error connecting wallet:', err)
      if (err.code === 4001) {
        setError('Connection request was rejected. Please try again.')
      } else if (err.code === -32002) {
        setError('Connection request is already pending. Please check your wallet.')
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
    setConnectedWallet(null)
    setChainId(null)
    // Clear localStorage
    localStorage.removeItem('connectedWallet')
    localStorage.removeItem('walletAccount')
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
    connectedWallet,
    chainId,
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