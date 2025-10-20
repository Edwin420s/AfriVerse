// API utilities for AfriVerse frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const api = {
  // Submission endpoints
  async submitEntry(formData) {
    const response = await fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      body: formData,
    })
    return response.json()
  },

  // Entry endpoints
  async getEntries(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    const response = await fetch(`${API_BASE_URL}/entries?${queryParams}`)
    return response.json()
  },

  async getEntry(id) {
    const response = await fetch(`${API_BASE_URL}/entries/${id}`)
    return response.json()
  },

  // Validation endpoints
  async getPendingValidations() {
    const response = await fetch(`${API_BASE_URL}/validations/pending`)
    return response.json()
  },

  async submitValidation(entryId, decision, notes) {
    const response = await fetch(`${API_BASE_URL}/validations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryId, decision, notes }),
    })
    return response.json()
  },

  // User endpoints
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`)
    return response.json()
  },

  async getUserContributions() {
    const response = await fetch(`${API_BASE_URL}/user/contributions`)
    return response.json()
  },

  // Search endpoint
  async searchKnowledge(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters }).toString()
    const response = await fetch(`${API_BASE_URL}/search?${params}`)
    return response.json()
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
  }
}

// IPFS utilities
export const ipfsUtils = {
  async uploadToIPFS(file) {
    // This would integrate with your preferred IPFS service
    // For now, returning a mock CID
    return {
      cid: 'Qm' + Math.random().toString(36).substr(2, 44),
      url: `https://ipfs.io/ipfs/Qm${Math.random().toString(36).substr(2, 44)}`
    }
  }
}