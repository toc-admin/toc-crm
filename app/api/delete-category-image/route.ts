import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

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

    const { categoryId, imageUrl } = await request.json()

    if (!categoryId || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/category-images/')
    if (pathParts.length < 2) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
    }
    const filePath = pathParts[1]

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('category-images')
      .remove([filePath])

    if (storageError) throw storageError

    // Update database to remove image_url
    const { error: dbError } = await (supabase
      .from('categories') as any)
      .update({ image_url: null })
      .eq('id', categoryId)

    if (dbError) throw dbError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Delete failed' },
      { status: 500 }
    )
  }
}
