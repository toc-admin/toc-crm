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
    const brandId = formData.get('brandId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!brandId) {
      return NextResponse.json({ error: 'No brand ID provided' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Resize image (we'll use thumbnail size for brand logos)
    const sizes = await resizeImage(buffer, file.name)

    // Upload thumbnail size to Supabase Storage
    const fileName = getImageFileName(file.name, 'thumbnail')
    const filePath = `${brandId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('brand-logos')
      .upload(filePath, sizes.thumbnail, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('brand-logos')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
