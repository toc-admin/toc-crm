'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import SuccessModal from '@/components/ui/SuccessModal'
import TiptapEditor from './TiptapEditor'
import TagsInput from './TagsInput'
import type { ArticleCategory, Tag } from '@/types/database.types'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  category_id: z.string().nullable(),
  status: z.enum(['draft', 'published', 'archived']),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  title_hr: z.string().optional(),
  excerpt_hr: z.string().optional(),
  meta_title_hr: z.string().optional(),
  meta_description_hr: z.string().optional(),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleFormProps {
  categories: ArticleCategory[]
  initialData?: any
  articleId?: string
}

export default function ArticleForm({
  categories,
  initialData,
  articleId,
}: ArticleFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Cover image state
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialData?.cover_image_url || null
  )
  const [coverThumbnailUrl, setCoverThumbnailUrl] = useState<string | null>(
    initialData?.cover_image_thumbnail_url || null
  )
  const [uploading, setUploading] = useState(false)

  // Content state (for Tiptap) — one per language, both editors stay mounted
  const [content, setContent] = useState<string>(initialData?.content || '')
  const [contentHr, setContentHr] = useState<string>(
    initialData?.content_hr || ''
  )

  // Language tab state (EN fields vs HR fields)
  const [activeLang, setActiveLang] = useState<'en' | 'hr'>('en')

  // Tags state
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialData?.tags || []
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          excerpt: initialData.excerpt || '',
          category_id: initialData.category_id || null,
          status: initialData.status,
          meta_title: initialData.meta_title || '',
          meta_description: initialData.meta_description || '',
          title_hr: initialData.title_hr || '',
          excerpt_hr: initialData.excerpt_hr || '',
          meta_title_hr: initialData.meta_title_hr || '',
          meta_description_hr: initialData.meta_description_hr || '',
        }
      : {
          title: '',
          slug: '',
          excerpt: '',
          category_id: null,
          status: 'draft',
          meta_title: '',
          meta_description: '',
          title_hr: '',
          excerpt_hr: '',
          meta_title_hr: '',
          meta_description_hr: '',
        },
  })

  const statusValue = watch('status')

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setValue('title', title)
    if (!articleId) {
      setValue('slug', slugify(title))
    }
  }

  // Handle cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!articleId) {
      alert('Please save the article first before uploading a cover image')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('articleId', articleId)

      const response = await fetch('/api/upload-article-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()

      // Update article with image URLs
      const { error } = await (supabase
        .from('articles') as any)
        .update({
          cover_image_url: data.coverUrl,
          cover_image_thumbnail_url: data.thumbnailUrl,
        })
        .eq('id', articleId)

      if (error) throw error

      setCoverImageUrl(data.coverUrl)
      setCoverThumbnailUrl(data.thumbnailUrl)
      setSuccessMessage('Cover image uploaded successfully')
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error uploading cover image:', error)
      alert('Failed to upload cover image')
    } finally {
      setUploading(false)
    }
  }

  // Remove cover image
  const removeCoverImage = async () => {
    if (!articleId || !confirm('Are you sure you want to remove the cover image?')) return

    try {
      const { error } = await (supabase
        .from('articles') as any)
        .update({
          cover_image_url: null,
          cover_image_thumbnail_url: null,
        })
        .eq('id', articleId)

      if (error) throw error

      setCoverImageUrl(null)
      setCoverThumbnailUrl(null)
    } catch (error) {
      console.error('Error removing cover image:', error)
      alert('Failed to remove cover image')
    }
  }

  // Validation errors only occur on English fields (HR fields are optional),
  // so switch to the English tab to make them visible
  const onInvalid = () => {
    setActiveLang('en')
  }

  const onSubmit = async (data: ArticleFormData) => {
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // Prepare article data
      const articleData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt?.trim() || null,
        content: content || null,
        category_id: data.category_id || null,
        status: data.status,
        meta_title: data.meta_title?.trim() || null,
        meta_description: data.meta_description?.trim() || null,
        title_hr: data.title_hr?.trim() || null,
        excerpt_hr: data.excerpt_hr?.trim() || null,
        content_hr: contentHr || null,
        meta_title_hr: data.meta_title_hr?.trim() || null,
        meta_description_hr: data.meta_description_hr?.trim() || null,
        // Set published_at when publishing for the first time
        published_at:
          data.status === 'published' && !initialData?.published_at
            ? new Date().toISOString()
            : initialData?.published_at || null,
        updated_at: new Date().toISOString(),
      }

      let newArticleId = articleId

      if (articleId) {
        // Update existing article
        const { error } = await (supabase
          .from('articles') as any)
          .update(articleData)
          .eq('id', articleId)

        if (error) throw error
      } else {
        // Create new article
        const { data: newArticle, error } = await (supabase
          .from('articles') as any)
          .insert({
            ...articleData,
            author_id: user?.id || null,
          })
          .select()
          .single()

        if (error) throw error
        newArticleId = newArticle.id
      }

      // Handle tags
      if (articleId) {
        // Remove existing tag associations
        await (supabase.from('article_tags') as any)
          .delete()
          .eq('article_id', articleId)
      }

      // Add new tag associations
      if (selectedTags.length > 0 && newArticleId) {
        await (supabase.from('article_tags') as any).insert(
          selectedTags.map((tag) => ({
            article_id: newArticleId,
            tag_id: tag.id,
          }))
        )
      }

      setSuccessMessage(
        articleId ? 'Article updated successfully' : 'Article created successfully'
      )
      setShowSuccessModal(true)
      setTimeout(() => {
        router.push('/dashboard/articles')
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error('Error saving article:', error)
      alert(error.message || 'Failed to save article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        {/* Language switcher */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full shadow border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeLang === 'en'
                ? 'bg-slate-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('hr')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeLang === 'hr'
                ? 'bg-slate-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Hrvatski
          </button>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={activeLang === 'en' ? 'md:col-span-2' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                {...register('title')}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className={activeLang === 'hr' ? 'md:col-span-2' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naslov (HR)
              </label>
              <input
                type="text"
                {...register('title_hr')}
                placeholder="Naslov članka na hrvatskom..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                {...register('slug')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register('category_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              {statusValue === 'published' && !initialData?.published_at && (
                <p className="mt-1 text-xs text-green-600">
                  Publishing will set the published date to now
                </p>
              )}
            </div>

            <div className={activeLang === 'en' ? 'md:col-span-2' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                placeholder="A brief summary of the article..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className={activeLang === 'hr' ? 'md:col-span-2' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sažetak (HR)
              </label>
              <textarea
                {...register('excerpt_hr')}
                rows={3}
                placeholder="Kratki sažetak članka..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <TagsInput
                selectedTags={selectedTags}
                onChange={setSelectedTags}
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Image</h3>
          <div className="space-y-4">
            {coverImageUrl ? (
              <div className="relative">
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={coverImageUrl}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-sm text-slate-500 mb-4">
                  {articleId
                    ? 'Upload a cover image for your article'
                    : 'Save the article first to upload a cover image'}
                </p>
                <label
                  className={`inline-flex items-center px-4 py-2 ${
                    articleId
                      ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  } rounded-md transition-colors`}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={!articleId || uploading}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Content Editor — both editors stay mounted so unsaved changes
            survive tab switches; only visibility is toggled */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {activeLang === 'en' ? 'Content' : 'Sadržaj (HR)'}
          </h3>
          <div className={activeLang === 'en' ? '' : 'hidden'}>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your article..."
              articleId={articleId}
            />
          </div>
          <div className={activeLang === 'hr' ? '' : 'hidden'}>
            <TiptapEditor
              content={contentHr}
              onChange={setContentHr}
              placeholder="Počnite pisati članak na hrvatskom..."
              articleId={articleId}
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            SEO Settings
          </h3>
          <div className="space-y-6">
            <div className={activeLang === 'en' ? '' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                {...register('meta_title')}
                placeholder="Leave empty to use article title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className={activeLang === 'en' ? '' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                {...register('meta_description')}
                rows={3}
                placeholder="Leave empty to use excerpt"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className={activeLang === 'hr' ? '' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta naslov (HR)
              </label>
              <input
                type="text"
                {...register('meta_title_hr')}
                placeholder="Ostavite prazno za korištenje naslova"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className={activeLang === 'hr' ? '' : 'hidden'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta opis (HR)
              </label>
              <textarea
                {...register('meta_description_hr')}
                rows={3}
                placeholder="Ostavite prazno za korištenje sažetka"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </span>
            ) : articleId ? (
              'Update Article'
            ) : (
              'Create Article'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
