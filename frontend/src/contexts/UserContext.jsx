'use client'
/**
 * UserContext
 * Global user authentication and profile management
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { signMessage, verifySignature } from '@/utils/blockchain'

const UserContext = createContext(undefined)

export function UserProvider({ children }) {
  // User State
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Wallet State
  const [walletAddress, setWalletAddress] = useState(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  // Profile State
  const [profile, setProfile] = useState(null)
  const [contributions, setContributions] = useState([])
  const [validations, setValidations] = useState([])
  const [badges, setBadges] = useState([])

  // Statistics
  const [stats, setStats] = useState({
    contributionCount: 0,
    validationCount: 0,
    reputation: 0,
    rank: null
  })

  // Sign in with wallet
  const signInWithWallet = useCallback(async (address, signer) => {
    try {
      setIsLoading(true)
      setError(null)

      // Create message to sign
      const timestamp = Date.now()
      const message = `Sign in to AfriVerse\n\nTimestamp: ${timestamp}\nAddress: ${address}`

      // Sign message
      const signResult = await signMessage(message)
      
      if (!signResult.success) {
        throw new Error(signResult.error || 'Failed to sign message')
      }

      // Authenticate with backend
      const response = await api.login({
        walletAddress: address,
        signature: signResult.signature,
        message
      })

      if (response.success) {
        const userData = response.data.user
        setUser(userData)
        setWalletAddress(address)
        setIsAuthenticated(true)
        setIsWalletConnected(true)
        
        // Store auth token
        if (userData.token) {
          localStorage.setItem('authToken', userData.token)
        }

        // Fetch user profile
        await fetchUserProfile(address)
        
        return { success: true, user: userData }
      } else {
        throw new Error(response.error || 'Authentication failed')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sign out
  const signOut = useCallback(() => {
    setUser(null)
    setWalletAddress(null)
    setIsAuthenticated(false)
    setIsWalletConnected(false)
    setProfile(null)
    setContributions([])
    setValidations([])
    setBadges([])
    setStats({
      contributionCount: 0,
      validationCount: 0,
      reputation: 0,
      rank: null
    })
    
    // Clear stored token
    localStorage.removeItem('authToken')
  }, [])

  // Fetch user profile
  const fetchUserProfile = useCallback(async (address) => {
    try {
      const response = await api.getUserProfile(address || walletAddress)

      if (response.success) {
        const profileData = response.data.profile
        setProfile(profileData)
        
        // Update stats
        if (profileData.stats) {
          setStats(profileData.stats)
        }

        return profileData
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    }
  }, [walletAddress])

  // Fetch user contributions
  const fetchContributions = useCallback(async () => {
    try {
      const response = await api.getUserContributions(walletAddress)

      if (response.success) {
        setContributions(response.data.contributions || [])
      }
    } catch (error) {
      console.error('Fetch contributions error:', error)
    }
  }, [walletAddress])

  // Fetch user validations
  const fetchValidations = useCallback(async () => {
    try {
      const response = await api.getValidationHistory(walletAddress)

      if (response.success) {
        setValidations(response.data.validations || [])
      }
    } catch (error) {
      console.error('Fetch validations error:', error)
    }
  }, [walletAddress])

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      setError(null)

      const response = await api.updateUserProfile(walletAddress, updates)

      if (response.success) {
        setProfile(prev => ({ ...prev, ...updates }))
        return { success: true }
      } else {
        setError(response.error || 'Failed to update profile')
        return { success: false, error: response.error }
      }
    } catch (err) {
      console.error('Update profile error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [walletAddress])

  // Award badge to user
  const awardBadge = useCallback((badge) => {
    setBadges(prev => {
      const exists = prev.some(b => b.id === badge.id)
      if (exists) return prev
      return [...prev, { ...badge, awardedAt: new Date().toISOString() }]
    })
  }, [])

  // Update reputation
  const updateReputation = useCallback((change) => {
    setStats(prev => ({
      ...prev,
      reputation: Math.max(0, prev.reputation + change)
    }))
  }, [])

  // Check if user has role
  const hasRole = useCallback((role) => {
    if (!user) return false
    return user.role === role || user.roles?.includes(role)
  }, [user])

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false
    return user.permissions?.includes(permission) || hasRole('admin')
  }, [user, hasRole])

  // Auto-authenticate on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        
        if (token) {
          // Decode token to get wallet address
          const decoded = JSON.parse(atob(token.split('.')[1] || btoa(token)))
          
          if (decoded.walletAddress) {
            setWalletAddress(decoded.walletAddress)
            setIsAuthenticated(true)
            
            // Fetch user data
            await fetchUserProfile(decoded.walletAddress)
          }
        }
      } catch (error) {
        console.error('Auto-auth error:', error)
        // Clear invalid token
        localStorage.removeItem('authToken')
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [fetchUserProfile])

  // Fetch contributions and validations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && walletAddress) {
      fetchContributions()
      fetchValidations()
    }
  }, [isAuthenticated, walletAddress, fetchContributions, fetchValidations])

  const value = {
    // User State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Wallet
    walletAddress,
    isWalletConnected,
    
    // Profile
    profile,
    contributions,
    validations,
    badges,
    stats,
    
    // Actions
    signInWithWallet,
    signOut,
    fetchUserProfile,
    fetchContributions,
    fetchValidations,
    updateProfile,
    awardBadge,
    updateReputation,
    
    // Permissions
    hasRole,
    hasPermission
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext)
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  
  return context
}

export default UserContext
