import { NextResponse } from 'next/server'
import { Web3Storage } from 'web3.storage'

function getAccessToken() {
  return process.env.WEB3_STORAGE_TOKEN
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() })
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 100MB allowed.' },
        { status: 400 }
      )
    }

    const client = makeStorageClient()
    const cid = await client.put([file])

    return NextResponse.json({
      success: true,
      data: {
        cid,
        url: `https://${cid}.ipfs.dweb.link`,
        gatewayUrl: `https://ipfs.io/ipfs/${cid}`
      }
    })

  } catch (error) {
    console.error('IPFS upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file to IPFS' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const cid = searchParams.get('cid')

    if (!cid) {
      return NextResponse.json(
        { success: false, error: 'CID required' },
        { status: 400 }
      )
    }

    const client = makeStorageClient()
    const res = await client.get(cid)

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to get file from IPFS' },
        { status: 404 }
      )
    }

    const files = await res.files()
    
    return NextResponse.json({
      success: true,
      data: {
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          cid: file.cid,
          url: `https://${file.cid}.ipfs.dweb.link`
        }))
      }
    })

  } catch (error) {
    console.error('IPFS get error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch file from IPFS' },
      { status: 500 }
    )
  }
}