import { NextResponse } from 'next/server'
import { ethers } from 'ethers'

// Mock database - replace with real database in production
const users = new Map()

export async function POST(request) {
  try {
    const { walletAddress, signature, message } = await request.json()

    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature)
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Check if user exists
    let user = users.get(walletAddress.toLowerCase())
    
    if (!user) {
      // Create new user
      user = {
        walletAddress: walletAddress.toLowerCase(),
        createdAt: new Date().toISOString(),
        role: 'contributor',
        reputation: 0,
        contributions: 0,
        validations: 0
      }
      users.set(walletAddress.toLowerCase(), user)
    }

    // Generate JWT token (in production, use proper JWT implementation)
    const token = generateMockToken(user)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          ...user,
          token
        }
      }
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const user = users.get(walletAddress.toLowerCase())
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { user }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

function generateMockToken(user) {
  // In production, use proper JWT implementation
  return Buffer.from(JSON.stringify({
    ...user,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  })).toString('base64')
}