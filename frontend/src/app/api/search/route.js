import { NextResponse } from 'next/server'

// Mock databases - in production, use proper database with full-text search
const entries = new Map()
const communities = new Map()

// Mock search index (in production, use Elasticsearch, Algolia, or similar)
function searchEntries(query, filters = {}) {
  const { type, community, language, status } = filters
  const searchQuery = query.toLowerCase()
  
  let results = Array.from(entries.values())

  // Text search across multiple fields
  if (searchQuery) {
    results = results.filter(entry => {
      const searchableText = [
        entry.title,
        entry.description,
        entry.community,
        entry.language,
        entry.transcript,
        ...(entry.tags || [])
      ].join(' ').toLowerCase()

      return searchableText.includes(searchQuery)
    })
  }

  // Apply filters
  if (type) {
    results = results.filter(entry => entry.type === type)
  }
  if (community) {
    results = results.filter(entry => entry.community === community)
  }
  if (language) {
    results = results.filter(entry => entry.language === language)
  }
  if (status) {
    results = results.filter(entry => entry.status === status)
  }

  return results
}

function searchCommunities(query) {
  const searchQuery = query.toLowerCase()
  
  return Array.from(communities.values()).filter(community => {
    const searchableText = [
      community.name,
      community.description,
      community.region,
      community.country,
      community.language,
      ...(community.tags || [])
    ].join(' ').toLowerCase()

    return searchableText.includes(searchQuery)
  })
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || searchParams.get('query') || ''
    const type = searchParams.get('type') // 'entries', 'communities', 'all'
    const entryType = searchParams.get('entryType')
    const community = searchParams.get('community')
    const language = searchParams.get('language')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20

    if (!query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    let results = {
      entries: [],
      communities: [],
      total: 0
    }

    // Search entries
    if (!type || type === 'all' || type === 'entries') {
      const entryResults = searchEntries(query, {
        type: entryType,
        community,
        language,
        status
      })
      results.entries = entryResults
    }

    // Search communities
    if (!type || type === 'all' || type === 'communities') {
      results.communities = searchCommunities(query)
    }

    // Calculate totals
    results.total = results.entries.length + results.communities.length

    // Apply pagination to entries (most common search)
    if (type === 'entries' || !type) {
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      results.entries = results.entries.slice(startIndex, endIndex)
    }

    // Sort results by relevance (simple scoring based on title match)
    results.entries.sort((a, b) => {
      const aScore = a.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
      const bScore = b.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
      return bScore - aScore
    })

    results.communities.sort((a, b) => {
      const aScore = a.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
      const bScore = b.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
      return bScore - aScore
    })

    // Highlight matched terms (simple implementation)
    const highlightText = (text, query) => {
      if (!text || !query) return text
      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<mark>$1</mark>')
    }

    // Add highlights to results
    results.entries = results.entries.map(entry => ({
      ...entry,
      highlightedTitle: highlightText(entry.title, query),
      highlightedDescription: highlightText(entry.description, query)
    }))

    results.communities = results.communities.map(community => ({
      ...community,
      highlightedName: highlightText(community.name, query),
      highlightedDescription: highlightText(community.description, query)
    }))

    return NextResponse.json({
      success: true,
      data: {
        query,
        results,
        pagination: {
          page,
          limit,
          total: results.entries.length,
          pages: Math.ceil(results.entries.length / limit)
        },
        filters: {
          type: entryType,
          community,
          language,
          status
        }
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}

// Advanced search with multiple parameters
export async function POST(request) {
  try {
    const body = await request.json()
    
    const {
      query,
      filters = {},
      facets = [],
      sort = 'relevance',
      page = 1,
      limit = 20
    } = body

    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Perform advanced search with filters
    let results = searchEntries(query, filters)

    // Apply sorting
    switch (sort) {
      case 'relevance':
        // Already sorted by relevance in searchEntries
        break
      case 'recent':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'popular':
        results.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'validated':
        results.sort((a, b) => {
          const aScore = a.status === 'validated' ? 1 : 0
          const bScore = b.status === 'validated' ? 1 : 0
          return bScore - aScore
        })
        break
    }

    // Calculate facets (for filter UI)
    const calculatedFacets = {}
    if (facets.includes('type')) {
      calculatedFacets.types = {}
      results.forEach(entry => {
        calculatedFacets.types[entry.type] = (calculatedFacets.types[entry.type] || 0) + 1
      })
    }
    if (facets.includes('community')) {
      calculatedFacets.communities = {}
      results.forEach(entry => {
        calculatedFacets.communities[entry.community] = (calculatedFacets.communities[entry.community] || 0) + 1
      })
    }
    if (facets.includes('language')) {
      calculatedFacets.languages = {}
      results.forEach(entry => {
        calculatedFacets.languages[entry.language] = (calculatedFacets.languages[entry.language] || 0) + 1
      })
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const totalResults = results.length
    results = results.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        query,
        results,
        facets: calculatedFacets,
        pagination: {
          page,
          limit,
          total: totalResults,
          pages: Math.ceil(totalResults / limit)
        },
        appliedFilters: filters,
        sort
      }
    })

  } catch (error) {
    console.error('Advanced search error:', error)
    return NextResponse.json(
      { success: false, error: 'Advanced search failed' },
      { status: 500 }
    )
  }
}

// Autocomplete/suggestions endpoint
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit')) || 5

    if (!query.trim() || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { suggestions: [] }
      })
    }

    const searchQuery = query.toLowerCase()
    
    // Get suggestions from entries and communities
    const entrySuggestions = Array.from(entries.values())
      .filter(entry => entry.title.toLowerCase().includes(searchQuery))
      .slice(0, limit)
      .map(entry => ({
        text: entry.title,
        type: 'entry',
        id: entry.id
      }))

    const communitySuggestions = Array.from(communities.values())
      .filter(community => community.name.toLowerCase().includes(searchQuery))
      .slice(0, limit)
      .map(community => ({
        text: community.name,
        type: 'community',
        id: community.id
      }))

    const suggestions = [...entrySuggestions, ...communitySuggestions].slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        query,
        suggestions
      }
    })

  } catch (error) {
    console.error('Autocomplete error:', error)
    return NextResponse.json(
      { success: false, error: 'Autocomplete failed' },
      { status: 500 }
    )
  }
}
