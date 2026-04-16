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

    if (!articleId) {
      return NextResponse.json({ error: 'No article ID provided' }, { status: 400 })
    }

    // Get existing article to check for old cover image
    const { data: article } = await (supabase
      .from('articles') as any)
      .select('cover_image_url, cover_image_thumbnail_url')
      .eq('id', articleId)
      .single()

    // Delete old images from storage if they exist
    if (article?.cover_image_url) {
      try {
        const url = new URL(article.cover_image_url)
        const pathParts = url.pathname.split('/article-images/')
        if (pathParts.length >= 2) {
          const oldFilePath = pathParts[1]
          await supabase.storage
            .from('article-images')
            .remove([oldFilePath])
        }
      } catch (error) {
        console.error('Error deleting old cover image:', error)
      }
    }

    if (article?.cover_image_thumbnail_url) {
      try {
        const url = new URL(article.cover_image_thumbnail_url)
        const pathParts = url.pathname.split('/article-images/')
        if (pathParts.length >= 2) {
          const oldFilePath = pathParts[1]
          await supabase.storage
            .from('article-images')
            .remove([oldFilePath])
        }
      } catch (error) {
        console.error('Error deleting old thumbnail:', error)
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Resize image to get thumbnail and medium sizes
    const sizes = await resizeImage(buffer, file.name)

    // Upload medium size (cover image)
    const mediumFileName = getImageFileName(file.name, 'medium')
    const mediumFilePath = `${articleId}/${mediumFileName}`

    const { error: mediumError } = await supabase.storage
      .from('article-images')
      .upload(mediumFilePath, sizes.medium, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (mediumError) throw mediumError

    // Upload thumbnail
    const thumbnailFileName = getImageFileName(file.name, 'thumbnail')
    const thumbnailFilePath = `${articleId}/${thumbnailFileName}`

    const { error: thumbnailError } = await supabase.storage
      .from('article-images')
      .upload(thumbnailFilePath, sizes.thumbnail, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (thumbnailError) throw thumbnailError

    // Get public URLs
    const { data: { publicUrl: coverUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(mediumFilePath)

    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(thumbnailFilePath)

    return NextResponse.json({
      success: true,
      coverUrl,
      thumbnailUrl,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
