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
    const productId = formData.get('productId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!productId) {
      return NextResponse.json({ error: 'No product ID provided' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Resize images
    const sizes = await resizeImage(buffer, file.name)

    // Upload all sizes to Supabase Storage
    const uploadPromises = Object.entries(sizes).map(async ([size, imageBuffer]) => {
      const fileName = getImageFileName(file.name, size as 'thumbnail' | 'medium' | 'original')
      const filePath = `${productId}/${fileName}`

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return { size, url: publicUrl }
    })

    const uploadResults = await Promise.all(uploadPromises)

    // Extract URLs
    const urls = uploadResults.reduce((acc, { size, url }) => {
      acc[size] = url
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      success: true,
      urls: {
        original: urls.original,
        medium: urls.medium,
        thumbnail: urls.thumbnail,
      },
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
