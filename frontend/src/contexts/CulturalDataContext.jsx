'use client'
/**
 * CulturalDataContext
 * Global state management for cultural data across AfriVerse
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

const CulturalDataContext = createContext(undefined)

export function CulturalDataProvider({ children }) {
  // Entries State
  const [entries, setEntries] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [entriesError, setEntriesError] = useState(null)

  // Communities State
  const [communities, setCommunities] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [communitiesLoading, setCommunitiesLoading] = useState(false)
  const [communitiesError, setCommunitiesError] = useState(null)

  // Filters State
  const [filters, setFilters] = useState({
    type: null,
    community: null,
    language: null,
    status: 'all',
    search: ''
  })

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  // Statistics State
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalCommunities: 0,
    totalContributors: 0,
    totalValidators: 0
  })

  // Fetch Entries
  const fetchEntries = useCallback(async (params = {}) => {
    try {
      setEntriesLoading(true)
      setEntriesError(null)

      const queryParams = {
        ...filters,
        ...params,
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit
      }

      const response = await api.getEntries(queryParams)

      if (response.success) {
        setEntries(response.data.entries || [])
        setPagination(response.data.pagination || pagination)
      } else {
        setEntriesError(response.error || 'Failed to fetch entries')
      }
    } catch (error) {
      console.error('Fetch entries error:', error)
      setEntriesError(error.message)
    } finally {
      setEntriesLoading(false)
    }
  }, [filters, pagination])

  // Fetch Communities
  const fetchCommunities = useCallback(async (params = {}) => {
    try {
      setCommunitiesLoading(true)
      setCommunitiesError(null)

      const response = await api.getCommunities(params)

      if (response.success) {
        setCommunities(response.data.communities || [])
      } else {
        setCommunitiesError(response.error || 'Failed to fetch communities')
      }
    } catch (error) {
      console.error('Fetch communities error:', error)
      setCommunitiesError(error.message)
    } finally {
      setCommunitiesLoading(false)
    }
  }, [])

  // Fetch Single Entry
  const fetchEntry = useCallback(async (id) => {
    try {
      setEntriesLoading(true)
      setEntriesError(null)

      const response = await api.getEntry(id)

      if (response.success) {
        setSelectedEntry(response.data.entry)
        return response.data.entry
      } else {
        setEntriesError(response.error || 'Failed to fetch entry')
        return null
      }
    } catch (error) {
      console.error('Fetch entry error:', error)
      setEntriesError(error.message)
      return null
    } finally {
      setEntriesLoading(false)
    }
  }, [])

  // Fetch Single Community
  const fetchCommunity = useCallback(async (id) => {
    try {
      setCommunitiesLoading(true)
      setCommunitiesError(null)

      const response = await api.getCommunity(id)

      if (response.success) {
        setSelectedCommunity(response.data.community)
        return response.data.community
      } else {
        setCommunitiesError(response.error || 'Failed to fetch community')
        return null
      }
    } catch (error) {
      console.error('Fetch community error:', error)
      setCommunitiesError(error.message)
      return null
    } finally {
      setCommunitiesLoading(false)
    }
  }, [])

  // Submit New Entry
  const submitEntry = useCallback(async (entryData) => {
    try {
      setEntriesError(null)

      const response = await api.submitEntry(entryData)

      if (response.success) {
        // Refresh entries list
        await fetchEntries()
        return response.data.entry
      } else {
        setEntriesError(response.error || 'Failed to submit entry')
        return null
      }
    } catch (error) {
      console.error('Submit entry error:', error)
      setEntriesError(error.message)
      return null
    }
  }, [fetchEntries])

  // Update Entry
  const updateEntry = useCallback(async (id, updates) => {
    try {
      setEntriesError(null)

      const response = await api.updateEntry(id, updates)

      if (response.success) {
        // Update local state
        setEntries(prev => 
          prev.map(entry => entry.id === id ? { ...entry, ...updates } : entry)
        )
        if (selectedEntry?.id === id) {
          setSelectedEntry(prev => ({ ...prev, ...updates }))
        }
        return response.data.entry
      } else {
        setEntriesError(response.error || 'Failed to update entry')
        return null
      }
    } catch (error) {
      console.error('Update entry error:', error)
      setEntriesError(error.message)
      return null
    }
  }, [selectedEntry])

  // Search Entries
  const searchEntries = useCallback(async (query, searchFilters = {}) => {
    try {
      setEntriesLoading(true)
      setEntriesError(null)

      const response = await api.searchKnowledge({
        query,
        ...searchFilters
      })

      if (response.success) {
        setEntries(response.data.results.entries || [])
        return response.data.results
      } else {
        setEntriesError(response.error || 'Search failed')
        return null
      }
    } catch (error) {
      console.error('Search error:', error)
      setEntriesError(error.message)
      return null
    } finally {
      setEntriesLoading(false)
    }
  }, [])

  // Update Filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [])

  // Clear Filters
  const clearFilters = useCallback(() => {
    setFilters({
      type: null,
      community: null,
      language: null,
      status: 'all',
      search: ''
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  // Fetch Statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.getPlatformStats()

      if (response.success) {
        setStats(response.data.stats || stats)
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
    }
  }, [stats])

  // Join Community
  const joinCommunity = useCallback(async (communityId, userId) => {
    try {
      setCommunitiesError(null)

      const response = await api.joinCommunity(communityId, userId)

      if (response.success) {
        // Update local state
        setCommunities(prev =>
          prev.map(community =>
            community.id === communityId
              ? { ...community, memberCount: (community.memberCount || 0) + 1 }
              : community
          )
        )
        if (selectedCommunity?.id === communityId) {
          setSelectedCommunity(prev => ({
            ...prev,
            memberCount: (prev.memberCount || 0) + 1
          }))
        }
        return true
      } else {
        setCommunitiesError(response.error || 'Failed to join community')
        return false
      }
    } catch (error) {
      console.error('Join community error:', error)
      setCommunitiesError(error.message)
      return false
    }
  }, [selectedCommunity])

  // Initial data fetch
  useEffect(() => {
    fetchEntries()
    fetchCommunities()
    fetchStats()
  }, []) // Only run once on mount

  // Refetch when filters change
  useEffect(() => {
    fetchEntries()
  }, [filters])

  const value = {
    // Entries
    entries,
    selectedEntry,
    entriesLoading,
    entriesError,
    fetchEntries,
    fetchEntry,
    submitEntry,
    updateEntry,
    searchEntries,

    // Communities
    communities,
    selectedCommunity,
    communitiesLoading,
    communitiesError,
    fetchCommunities,
    fetchCommunity,
    joinCommunity,

    // Filters
    filters,
    updateFilters,
    clearFilters,

    // Pagination
    pagination,
    setPagination,

    // Statistics
    stats,
    fetchStats
  }

  return (
    <CulturalDataContext.Provider value={value}>
      {children}
    </CulturalDataContext.Provider>
  )
}

// Custom hook to use the context
export function useCulturalData() {
  const context = useContext(CulturalDataContext)
  
  if (context === undefined) {
    throw new Error('useCulturalData must be used within a CulturalDataProvider')
  }
  
  return context
}

export default CulturalDataContext
