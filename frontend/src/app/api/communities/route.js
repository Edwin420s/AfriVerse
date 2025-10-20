import { NextResponse } from 'next/server'

// Mock database - replace with real database in production
const communities = new Map()
let communityId = 1

// Initialize with sample data
const initializeCommunities = () => {
  if (communities.size === 0) {
    const sampleCommunities = [
      {
        id: communityId++,
        name: 'Kikuyu Wisdom Keepers',
        region: 'East Africa',
        country: 'Kenya',
        language: 'Kikuyu',
        memberCount: 247,
        entriesCount: 892,
        validatorCount: 34,
        description: 'Preserving Kikuyu traditional knowledge, proverbs, and medicinal practices from Central Kenya highlands.',
        tags: ['Traditional Medicine', 'Oral Stories', 'Proverbs'],
        verificationRate: 94,
        trending: true,
        image: '/communities/kikuyu.jpg',
        createdAt: new Date('2025-01-15').toISOString(),
        updatedAt: new Date('2025-10-20').toISOString()
      },
      {
        id: communityId++,
        name: 'Yoruba Cultural Heritage',
        region: 'West Africa',
        country: 'Nigeria',
        language: 'Yoruba',
        memberCount: 583,
        entriesCount: 1547,
        validatorCount: 67,
        description: 'Documenting Yoruba orisha traditions, Ifa divination knowledge, and artistic expressions.',
        tags: ['Spirituality', 'Art', 'Music'],
        verificationRate: 91,
        trending: true,
        image: '/communities/yoruba.jpg',
        createdAt: new Date('2025-01-20').toISOString(),
        updatedAt: new Date('2025-10-20').toISOString()
      },
      {
        id: communityId++,
        name: 'Maasai Oral Traditions',
        region: 'East Africa',
        country: 'Kenya & Tanzania',
        language: 'Maa',
        memberCount: 156,
        entriesCount: 423,
        validatorCount: 21,
        description: 'Recording Maasai age-set knowledge, warrior traditions, and pastoralist wisdom.',
        tags: ['Oral Traditions', 'Pastoralism', 'Cultural Practices'],
        verificationRate: 96,
        trending: false,
        image: '/communities/maasai.jpg',
        createdAt: new Date('2025-02-01').toISOString(),
        updatedAt: new Date('2025-10-18').toISOString()
      },
      {
        id: communityId++,
        name: 'Zulu Ancestral Knowledge',
        region: 'Southern Africa',
        country: 'South Africa',
        language: 'Zulu',
        memberCount: 394,
        entriesCount: 1103,
        validatorCount: 48,
        description: 'Preserving Zulu traditional healing, beadwork symbolism, and warrior history.',
        tags: ['Traditional Medicine', 'Crafts', 'History'],
        verificationRate: 89,
        trending: false,
        image: '/communities/zulu.jpg',
        createdAt: new Date('2025-02-10').toISOString(),
        updatedAt: new Date('2025-10-19').toISOString()
      },
      {
        id: communityId++,
        name: 'Swahili Coastal Wisdom',
        region: 'East Africa',
        country: 'Kenya & Tanzania',
        language: 'Swahili',
        memberCount: 421,
        entriesCount: 967,
        validatorCount: 52,
        description: 'Documenting Swahili maritime knowledge, trade history, and Islamic traditions.',
        tags: ['Maritime', 'Trade', 'History'],
        verificationRate: 92,
        trending: true,
        image: '/communities/swahili.jpg',
        createdAt: new Date('2025-02-15').toISOString(),
        updatedAt: new Date('2025-10-20').toISOString()
      },
      {
        id: communityId++,
        name: 'Igbo Traditional Systems',
        region: 'West Africa',
        country: 'Nigeria',
        language: 'Igbo',
        memberCount: 312,
        entriesCount: 754,
        validatorCount: 39,
        description: 'Recording Igbo traditional governance, market systems, and folk wisdom.',
        tags: ['Governance', 'Economics', 'Proverbs'],
        verificationRate: 88,
        trending: false,
        image: '/communities/igbo.jpg',
        createdAt: new Date('2025-03-01').toISOString(),
        updatedAt: new Date('2025-10-17').toISOString()
      }
    ]

    sampleCommunities.forEach(community => {
      communities.set(community.id, community)
    })
  }
}

export async function GET(request) {
  try {
    initializeCommunities()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const region = searchParams.get('region')
    const language = searchParams.get('language')
    const sort = searchParams.get('sort') || 'popular'
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20

    // Get single community by ID
    if (id) {
      const community = communities.get(parseInt(id))
      if (!community) {
        return NextResponse.json(
          { success: false, error: 'Community not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: { community }
      })
    }

    // Get all communities with filters
    let filteredCommunities = Array.from(communities.values())

    // Apply filters
    if (region && region !== 'all') {
      filteredCommunities = filteredCommunities.filter(c => c.region === region)
    }
    if (language) {
      filteredCommunities = filteredCommunities.filter(c => c.language === language)
    }
    if (search) {
      const query = search.toLowerCase()
      filteredCommunities = filteredCommunities.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.language.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        filteredCommunities.sort((a, b) => b.memberCount - a.memberCount)
        break
      case 'active':
        filteredCommunities.sort((a, b) => b.entriesCount - a.entriesCount)
        break
      case 'recent':
        filteredCommunities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'entries':
        filteredCommunities.sort((a, b) => b.entriesCount - a.entriesCount)
        break
      default:
        break
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCommunities = filteredCommunities.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        communities: paginatedCommunities,
        pagination: {
          page,
          limit,
          total: filteredCommunities.length,
          pages: Math.ceil(filteredCommunities.length / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get communities error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch communities' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const {
      name,
      region,
      country,
      language,
      description,
      tags,
      creator
    } = body

    // Validate required fields
    if (!name || !region || !country || !language || !description || !creator) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new community
    const community = {
      id: communityId++,
      name,
      region,
      country,
      language,
      description,
      tags: tags || [],
      memberCount: 1, // Creator is first member
      entriesCount: 0,
      validatorCount: 0,
      verificationRate: 0,
      trending: false,
      creator,
      members: [creator],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    communities.set(community.id, community)

    return NextResponse.json({
      success: true,
      data: { community }
    }, { status: 201 })

  } catch (error) {
    console.error('Create community error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create community' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, action, userId } = body

    if (!id || !action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const community = communities.get(parseInt(id))
    if (!community) {
      return NextResponse.json(
        { success: false, error: 'Community not found' },
        { status: 404 }
      )
    }

    // Handle join/leave actions
    if (action === 'join') {
      if (!community.members) community.members = []
      if (!community.members.includes(userId)) {
        community.members.push(userId)
        community.memberCount++
      }
    } else if (action === 'leave') {
      if (community.members) {
        community.members = community.members.filter(m => m !== userId)
        community.memberCount = Math.max(0, community.memberCount - 1)
      }
    }

    community.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      data: { community }
    })

  } catch (error) {
    console.error('Update community error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update community' },
      { status: 500 }
    )
  }
}
