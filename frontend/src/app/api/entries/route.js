import { NextResponse } from 'next/server'

// Mock database - replace with real database in production
const entries = new Map()
let entryId = 1

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const type = searchParams.get('type')
    const community = searchParams.get('community')
    const language = searchParams.get('language')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredEntries = Array.from(entries.values())

    // Apply filters
    if (type) {
      filteredEntries = filteredEntries.filter(entry => entry.type === type)
    }
    if (community) {
      filteredEntries = filteredEntries.filter(entry => entry.community === community)
    }
    if (language) {
      filteredEntries = filteredEntries.filter(entry => entry.language === language)
    }
    if (status) {
      filteredEntries = filteredEntries.filter(entry => entry.status === status)
    }
    if (search) {
      const query = search.toLowerCase()
      filteredEntries = filteredEntries.filter(entry =>
        entry.title.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.community.toLowerCase().includes(query)
      )
    }

    // Sort by creation date (newest first)
    filteredEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEntries = filteredEntries.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        entries: paginatedEntries,
        pagination: {
          page,
          limit,
          total: filteredEntries.length,
          pages: Math.ceil(filteredEntries.length / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get entries error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      type,
      community,
      language,
      license,
      fileCid,
      fileType,
      transcript,
      atoms,
      contributor
    } = body

    // Validate required fields
    if (!title || !description || !type || !community || !language || !license || !contributor) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new entry
    const entry = {
      id: entryId++,
      title,
      description,
      type,
      community,
      language,
      license,
      fileCid,
      fileType,
      transcript,
      atoms: atoms || [],
      contributor,
      status: 'pending',
      validations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    entries.set(entry.id, entry)

    return NextResponse.json({
      success: true,
      data: { entry }
    }, { status: 201 })

  } catch (error) {
    console.error('Create entry error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}