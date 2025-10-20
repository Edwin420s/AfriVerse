// Enhanced API utilities for AfriVerse frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Request interceptor for adding auth tokens
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('afriverse_token') : null
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const api = {
  // Auth endpoints
  async login(walletAddress, signature) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ walletAddress, signature })
    })
    return handleResponse(response)
  },

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  // Submission endpoints
  async submitEntry(formData) {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    })
    return handleResponse(response)
  },

  async uploadToIPFS(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/ipfs/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    })
    return handleResponse(response)
  },

  // Entry endpoints
  async getEntries(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const response = await fetch(`${API_BASE_URL}/entries?${queryParams}`)
    return handleResponse(response)
  },

  async getEntry(id) {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`)
    return handleResponse(response)
  },

  async updateEntry(id, updates) {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates)
    })
    return handleResponse(response)
  },

  // Validation endpoints
  async getPendingValidations(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const response = await fetch(`${API_BASE_URL}/validations/pending?${queryParams}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async submitValidation(entryId, decision, notes) {
    const response = await fetch(`${API_BASE_URL}/validations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ entryId, decision, notes }),
    })
    return handleResponse(response)
  },

  async getValidationHistory() {
    const response = await fetch(`${API_BASE_URL}/validations/history`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // User endpoints
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async getUserContributions() {
    const response = await fetch(`${API_BASE_URL}/user/contributions`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  async updateUserProfile(updates) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates)
    })
    return handleResponse(response)
  },

  // Search endpoint
  async searchKnowledge(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters }).toString()
    const response = await fetch(`${API_BASE_URL}/search?${params}`)
    return handleResponse(response)
  },

  // Analytics endpoints
  async getPlatformStats() {
    const response = await fetch(`${API_BASE_URL}/analytics/stats`)
    return handleResponse(response)
  },

  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/analytics/user-stats`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

// Web3 integration utilities
export const web3Utils = {
  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        return accounts[0]
      } catch (error) {
        console.error('Error connecting wallet:', error)
        throw error
      }
    } else {
      throw new Error('MetaMask is not installed')
    }
  },

  async signMessage(message, address) {
    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })
      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      throw error
    }
  },

  async getChainId() {
    if (typeof window.ethereum !== 'undefined') {
      return await window.ethereum.request({ method: 'eth_chainId' })
    }
    return null
  },

  async switchNetwork(chainId) {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (error) {
        console.error('Error switching network:', error)
        throw error
      }
    }
  }
}

// IPFS utilities
export const ipfsUtils = {
  async uploadToIPFS(file) {
    try {
      // Using Web3.Storage for IPFS uploads
      if (!process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN) {
        throw new Error('Web3.Storage token not configured')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('https://api.web3.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        cid: data.cid,
        url: `https://${data.cid}.ipfs.dweb.link`
      }
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      throw error
    }
  },

  getIPFSGatewayUrl(cid) {
    const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs'
    return `${gateway}/${cid}`
  }
}

// Local storage utilities
export const storage = {
  setItem(key, value) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },

  getItem(key) {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  },

  removeItem(key) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  },

  clear() {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Request retry utility
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
}