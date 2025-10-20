import { NextResponse } from 'next/server'

// Mock database - replace with real database in production
const validations = new Map()
const entries = new Map() // Reference to entries

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const validator = searchParams.get('validator')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20

    let filteredValidations = Array.from(validations.values())

    if (status) {
      filteredValidations = filteredValidations.filter(v => v.status === status)
    }
    if (validator) {
      filteredValidations = filteredValidations.filter(v => v.validator === validator)
    }

    // Sort by creation date (oldest first for pending validations)
    filteredValidations.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedValidations = filteredValidations.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        validations: paginatedValidations,
        pagination: {
          page,
          limit,
          total: filteredValidations.length,
          pages: Math.ceil(filteredValidations.length / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get validations error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch validations' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const {
      entryId,
      validator,
      decision,
      notes
    } = body

    if (!entryId || !validator || !decision) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create validation record
    const validation = {
      id: Date.now(),
      entryId: parseInt(entryId),
      validator,
      decision,
      notes: notes || '',
      createdAt: new Date().toISOString()
    }

    validations.set(validation.id, validation)

    // Update entry status based on validation
    const entry = entries.get(validation.entryId)
    if (entry) {
      if (!entry.validations) {
        entry.validations = []
      }
      entry.validations.push(validation)
      
      // Update entry status if enough validations
      const approvalCount = entry.validations.filter(v => v.decision === 'approved').length
      if (approvalCount >= 2) { // Require 2 approvals
        entry.status = 'validated'
      } else if (entry.validations.filter(v => v.decision === 'rejected').length >= 2) {
        entry.status = 'rejected'
      }
      
      entry.updatedAt = new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: { validation }
    }, { status: 201 })

  } catch (error) {
    console.error('Create validation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create validation' },
      { status: 500 }
    )
  }
}