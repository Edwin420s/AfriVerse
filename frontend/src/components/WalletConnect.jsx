'use client'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Copy, CheckCircle } from 'lucide-react'
import { useWeb3 } from './Web3Provider'
import { useState } from 'react'
import WalletModal from './WalletModal'

export default function WalletConnect() {
  const { 
    account, 
    isConnecting, 
    connectWallet, 
    disconnectWallet, 
    isMetaMaskInstalled,
    connectedWallet 
  } = useWeb3()
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleConnectWallet = async (walletId) => {
    await connectWallet(walletId)
  }

  if (account) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyAddress}
            className="flex items-center space-x-2 px-3 py-2 bg-primary-cyan/20 text-primary-cyan rounded-lg border border-primary-cyan/20 hover:bg-primary-cyan/30 transition-colors"
            title={connectedWallet || 'Connected'}
          >
            {copied ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="text-sm font-mono">{formatAddress(account)}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnectWallet}
            className="p-2 bg-red-500/20 text-red-400 rounded-lg border border-red-400/20 hover:bg-red-500/30 transition-colors"
            title="Disconnect Wallet"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
        <WalletModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onConnect={handleConnectWallet}
        />
      </>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenModal}
        disabled={isConnecting}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
          isConnecting
            ? 'bg-primary-cyan/20 text-primary-cyan border-primary-cyan/20 cursor-not-allowed'
            : 'gold-gradient text-primary-navy border-transparent hover:shadow-lg'
        }`}
      >
        <Wallet className="w-4 h-4" />
        <span className="text-sm font-semibold">
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </motion.button>
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnectWallet}
      />
    </>
  )
}