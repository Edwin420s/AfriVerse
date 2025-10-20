/**
 * useWeb3Actions Hook
 * Custom hook for Web3 blockchain interactions
 */

import { useState, useCallback, useEffect } from 'react'
import {
  connectWallet,
  disconnectWallet,
  switchNetwork,
  submitEntryToChain,
  validateEntryOnChain,
  getEntryFromChain,
  signMessage,
  getBalance,
  getCurrentNetwork,
  listenToEvents
} from '@/utils/blockchain'

export default function useWeb3Actions() {
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)

  // Connect to wallet
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      setError(null)
      
      const result = await connectWallet()
      
      if (result.success) {
        setAccount(result.address)
        setChainId(result.chainId)
        setProvider(result.provider)
        
        // Get balance
        const balanceResult = await getBalance(result.address)
        if (balanceResult.success) {
          setBalance(balanceResult.balance)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setBalance(null)
    setProvider(null)
    disconnectWallet()
  }, [])

  // Switch network
  const changeNetwork = useCallback(async (networkKey) => {
    try {
      setError(null)
      const result = await switchNetwork(networkKey)
      
      if (result.success) {
        const networkResult = await getCurrentNetwork()
        if (networkResult.success) {
          setChainId(networkResult.chainId)
        }
      } else {
        setError(result.error)
      }
      
      return result
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // Submit entry to blockchain
  const submitEntry = useCallback(async (cid, license, contractAddress) => {
    try {
      setError(null)
      
      if (!account) {
        throw new Error('Please connect your wallet first')
      }
      
      const result = await submitEntryToChain(cid, license, contractAddress)
      
      if (!result.success) {
        setError(result.error)
      }
      
      return result
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [account])

  // Validate entry on blockchain
  const validateEntry = useCallback(async (entryId, approved, contractAddress) => {
    try {
      setError(null)
      
      if (!account) {
        throw new Error('Please connect your wallet first')
      }
      
      const result = await validateEntryOnChain(entryId, approved, contractAddress)
      
      if (!result.success) {
        setError(result.error)
      }
      
      return result
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [account])

  // Get entry from blockchain
  const getEntry = useCallback(async (entryId, contractAddress) => {
    try {
      setError(null)
      const result = await getEntryFromChain(entryId, contractAddress)
      
      if (!result.success) {
        setError(result.error)
      }
      
      return result
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // Sign message
  const sign = useCallback(async (message) => {
    try {
      setError(null)
      
      if (!account) {
        throw new Error('Please connect your wallet first')
      }
      
      const result = await signMessage(message)
      
      if (!result.success) {
        setError(result.error)
      }
      
      return result
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [account])

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (account) {
      const result = await getBalance(account)
      if (result.success) {
        setBalance(result.balance)
      }
    }
  }, [account])

  // Listen to blockchain events
  const subscribeToEvents = useCallback((contractAddress, eventName, callback) => {
    return listenToEvents(contractAddress, eventName, callback)
  }, [])

  // Handle account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== account) {
          setAccount(accounts[0])
          getBalance(accounts[0]).then(result => {
            if (result.success) {
              setBalance(result.balance)
            }
          })
        }
      }

      const handleChainChanged = (newChainId) => {
        setChainId(newChainId)
        // Refresh the page on network change (recommended by MetaMask)
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [account, disconnect])

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          })
          
          if (accounts.length > 0) {
            await connect()
          }
        } catch (err) {
          console.error('Auto-connect failed:', err)
        }
      }
    }

    checkConnection()
  }, []) // Only run once on mount

  return {
    // State
    account,
    chainId,
    balance,
    isConnecting,
    isConnected: !!account,
    error,
    provider,

    // Actions
    connect,
    disconnect,
    changeNetwork,
    submitEntry,
    validateEntry,
    getEntry,
    sign,
    refreshBalance,
    subscribeToEvents
  }
}
