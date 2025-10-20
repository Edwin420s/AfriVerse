'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

export function useCulturalData() {
  const [data, setData] = useState({
    entries: [],
    communities: [],
    languages: [],
    statistics: {},
    loading: true,
    error: null
  })

  const [filters, setFilters] = useState({
    type: '',
    community: '',
    language: '',
    status: '',
    dateRange: '',
    searchQuery: ''
  })

  // Fetch all cultural data
  const fetchCulturalData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }))

    try {
      const [entries, communities, languages, stats] = await Promise.all([
        api.getEntries(filters),
        api.getCommunities(),
        api.getLanguages(),
        api.getPlatformStats()
      ])

      setData({
        entries: entries.data || [],
        communities: communities.data || [],
        languages: languages.data || [],
        statistics: stats.data || {},
        loading: false,
        error: null
      })
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }, [filters])

  // Search cultural knowledge
  const searchKnowledge = useCallback(async (query, searchFilters = {}) => {
    setData(prev => ({ ...prev, loading: true, error: null }))

    try {
      const results = await api.searchKnowledge(query, {
        ...filters,
        ...searchFilters
      })

      setData(prev => ({
        ...prev,
        entries: results.data?.results || [],
        loading: false
      }))
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }, [filters])

  // Get entries by community
  const getCommunityEntries = useCallback(async (communityId) => {
    setData(prev => ({ ...prev, loading: true, error: null }))

    try {
      const results = await api.getEntries({ community: communityId })
      setData(prev => ({
        ...prev,
        entries: results.data || [],
        loading: false
      }))
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }, [])

  // Get trending knowledge
  const getTrendingKnowledge = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }))

    try {
      const results = await api.getEntries({ sort: 'trending', limit: 10 })
      setData(prev => ({
        ...prev,
        entries: results.data || [],
        loading: false
      }))
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }, [])

  // Get recent contributions
  const getRecentContributions = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }))

    try {
      const results = await api.getEntries({ sort: 'recent', limit: 20 })
      setData(prev => ({
        ...prev,
        entries: results.data || [],
        loading: false
      }))
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }, [])

  // Get cultural insights
  const getCulturalInsights = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }))

    try {
      const insights = await api.getCulturalInsights()
      return insights.data
    } catch (error) {
      setData(prev => ({
        ...prev,
        error: error.message
      }))
      return null
    }
  }, [])

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      type: '',
      community: '',
      language: '',
      status: '',
      dateRange: '',
      searchQuery: ''
    })
  }, [])

  // Get filtered entries
  const getFilteredEntries = useCallback(() => {
    let filtered = data.entries

    if (filters.type) {
      filtered = filtered.filter(entry => entry.type === filters.type)
    }

    if (filters.community) {
      filtered = filtered.filter(entry => entry.community === filters.community)
    }

    if (filters.language) {
      filtered = filtered.filter(entry => entry.language === filters.language)
    }

    if (filters.status) {
      filtered = filtered.filter(entry => entry.status === filters.status)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.community.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [data.entries, filters])

  // Get statistics by community
  const getCommunityStats = useCallback(() => {
    const communityStats = {}

    data.entries.forEach(entry => {
      if (!communityStats[entry.community]) {
        communityStats[entry.community] = {
          count: 0,
          validated: 0,
          languages: new Set(),
          types: new Set()
        }
      }

      communityStats[entry.community].count++
      if (entry.status === 'validated') {
        communityStats[entry.community].validated++
      }
      communityStats[entry.community].languages.add(entry.language)
      communityStats[entry.community].types.add(entry.type)
    })

    return Object.entries(communityStats).map(([community, stats]) => ({
      community,
      count: stats.count,
      validated: stats.validated,
      languageCount: stats.languages.size,
      typeCount: stats.types.size,
      validationRate: (stats.validated / stats.count) * 100
    }))
  }, [data.entries])

  // Get knowledge distribution by type
  const getTypeDistribution = useCallback(() => {
    const typeCounts = {}

    data.entries.forEach(entry => {
      typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1
    })

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: (count / data.entries.length) * 100
    })).sort((a, b) => b.count - a.count)
  }, [data.entries])

  // Get language distribution
  const getLanguageDistribution = useCallback(() => {
    const languageCounts = {}

    data.entries.forEach(entry => {
      languageCounts[entry.language] = (languageCounts[entry.language] || 0) + 1
    })

    return Object.entries(languageCounts).map(([language, count]) => ({
      language,
      count,
      percentage: (count / data.entries.length) * 100
    })).sort((a, b) => b.count - a.count)
  }, [data.entries])

  // Refresh data
  const refreshData = useCallback(() => {
    fetchCulturalData()
  }, [fetchCulturalData])

  // Initial data fetch
  useEffect(() => {
    fetchCulturalData()
  }, [fetchCulturalData])

  return {
    // Data
    entries: data.entries,
    communities: data.communities,
    languages: data.languages,
    statistics: data.statistics,
    loading: data.loading,
    error: data.error,

    // Filters
    filters,
    updateFilters,
    clearFilters,

    // Filtered data
    filteredEntries: getFilteredEntries(),
    communityStats: getCommunityStats(),
    typeDistribution: getTypeDistribution(),
    languageDistribution: getLanguageDistribution(),

    // Actions
    searchKnowledge,
    getCommunityEntries,
    getTrendingKnowledge,
    getRecentContributions,
    getCulturalInsights,
    refreshData
  }
}