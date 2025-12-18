'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import SuccessModal from '@/components/ui/SuccessModal'

const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  website: z.string().optional(),
})

type BrandFormData = z.infer<typeof brandSchema>

interface BrandFormProps {
  initialData?: any
  brandId?: string
}

export default function BrandForm({
  initialData,
  brandId,
}: BrandFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(initialData?.logo_url || null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      website: '',
    },
  })

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('name', name)
    if (!brandId) {
      setValue('slug', slugify(name))
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // If editing existing brand, upload immediately
    if (brandId) {
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('brandId', brandId)

        const response = await fetch('/api/upload-brand', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()

        // Update database
        const { error } = await (supabase
          .from('brands') as any)
          .update({ logo_url: data.url })
          .eq('id', brandId)

        if (error) throw error

        setLogoUrl(data.url)
        setSuccessMessage('Logo uploaded successfully')
        setShowSuccessModal(true)
      } catch (error) {
        console.error('Error uploading logo:', error)
        alert('Failed to upload logo')
      } finally {
        setUploading(false)
      }
    } else {
      // Store for upload after creation
      setPendingFile(file)
      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadPendingLogo = async (brandId: string) => {
    if (!pendingFile) return null

    const formData = new FormData()
    formData.append('file', pendingFile)
    formData.append('brandId', brandId)

    const response = await fetch('/api/upload-brand', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')

    const data = await response.json()
    return data.url
  }

  const removeLogo = () => {
    setLogoUrl(null)
    setPendingFile(null)
  }

  const onSubmit = async (data: BrandFormData) => {
    setLoading(true)

    try {
      // Convert empty strings to null
      const payload = {
        name: data.name || null,
        slug: data.slug || null,
        description: data.description || null,
        website: data.website || null,
      }

      if (brandId) {
        // Update existing brand
        const { error } = await (supabase
          .from('brands') as any)
          .update(payload)
          .eq('id', brandId)

        if (error) throw error

        setSuccessMessage('Brand updated successfully')
        setShowSuccessModal(true)
        setTimeout(() => {
          router.push('/dashboard/brands')
          router.refresh()
        }, 1500)
      } else {
        // Create new brand
        const { data: newBrand, error } = await (supabase
          .from('brands') as any)
          .insert(payload)
          .select()
          .single()

        if (error) throw error

        // Upload pending logo if exists
        if (pendingFile && newBrand) {
          const logoUrl = await uploadPendingLogo(newBrand.id)

          await (supabase
            .from('brands') as any)
            .update({ logo_url: logoUrl })
            .eq('id', newBrand.id)
        }

        setSuccessMessage('Brand created successfully')
        setShowSuccessModal(true)
        setTimeout(() => {
          router.push('/dashboard/brands')
          router.refresh()
        }, 1500)
      }
    } catch (error: any) {
      console.error('Error saving brand:', error)
      alert(error.message || 'Failed to save brand')
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="card p-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
          Basic Information
        </h2>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              onChange={handleNameChange}
              className="input-field"
              placeholder="e.g., Herman Miller"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              id="slug"
              {...register('slug')}
              className="input-field"
              placeholder="herman-miller"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="input-field resize-none"
              placeholder="Brief description of the brand..."
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              {...register('website')}
              className="input-field"
              placeholder="https://www.example.com"
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="card p-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
          Brand Logo
        </h2>

        {logoUrl ? (
          <div className="relative inline-block">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-white p-4 flex items-center justify-center">
              <Image
                src={logoUrl}
                alt="Brand Logo"
                fill
                className="object-contain p-4"
              />
            </div>
            <button
              type="button"
              onClick={removeLogo}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div>
            <label
              htmlFor="logo"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-12 w-12 text-slate-400 mb-4" />
                <p className="mb-2 text-sm text-slate-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PNG, JPG, SVG (MAX. 5MB)</p>
              </div>
              <input
                id="logo"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
            </label>
          </div>
        )}

        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading logo...
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard/brands')}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{brandId ? 'Update Brand' : 'Create Brand'}</>
          )}
        </button>
      </div>
    </form>
    </>
  )
}
