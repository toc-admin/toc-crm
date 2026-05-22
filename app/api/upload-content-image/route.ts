import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { resizeImage, getImageFileName } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const articleId = formData.get('articleId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Resize image - use original size for content images (up to 1600px)
    const sizes = await resizeImage(buffer, file.name)

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const originalFileName = getImageFileName(file.name, 'original')
    const uniqueFileName = `${timestamp}-${originalFileName}`

    // Store in content subfolder, optionally grouped by article
    const folder = articleId ? `${articleId}/content` : 'content'
    const filePath = `${folder}/${uniqueFileName}`

    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(filePath, sizes.original, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
    })
  } catch (error: any) {
    console.error('Content image upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
