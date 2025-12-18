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
    const categoryId = formData.get('categoryId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'No category ID provided' }, { status: 400 })
    }

    // Get existing category to check for old image
    const { data: category } = await supabase
      .from('categories')
      .select('image_url')
      .eq('id', categoryId)
      .single()

    // Delete old image from storage if it exists
    if (category?.image_url) {
      try {
        const url = new URL(category.image_url)
        const pathParts = url.pathname.split('/category-images/')
        if (pathParts.length >= 2) {
          const oldFilePath = pathParts[1]
          await supabase.storage
            .from('category-images')
            .remove([oldFilePath])
        }
      } catch (error) {
        console.error('Error deleting old image:', error)
        // Continue with upload even if deletion fails
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Resize image (we'll just use the medium size for categories)
    const sizes = await resizeImage(buffer, file.name)

    // Upload medium size to Supabase Storage
    const fileName = getImageFileName(file.name, 'medium')
    const filePath = `${categoryId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('category-images')
      .upload(filePath, sizes.medium, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('category-images')
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
