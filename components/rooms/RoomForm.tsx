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

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  slug: z.string().min(1, 'Slug is required'),
  emoji: z.string().optional(),
  description: z.string().optional(),
})

type RoomFormData = z.infer<typeof roomSchema>

interface RoomFormProps {
  initialData?: any
  roomId?: string
}

export default function RoomForm({
  initialData,
  roomId,
}: RoomFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.hero_image_url || null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      emoji: '',
      description: '',
    },
  })

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('name', name)
    if (!roomId) {
      setValue('slug', slugify(name))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // If editing existing room, upload immediately
    if (roomId) {
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('roomId', roomId)

        const response = await fetch('/api/upload-room', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()

        // Update database
        const { error } = await (supabase
          .from('rooms') as any)
          .update({ hero_image_url: data.url })
          .eq('id', roomId)

        if (error) throw error

        setImageUrl(data.url)
        setSuccessMessage('Image uploaded successfully')
        setShowSuccessModal(true)
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image')
      } finally {
        setUploading(false)
      }
    } else {
      // Store for upload after creation
      setPendingFile(file)
      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadPendingImage = async (roomId: string) => {
    if (!pendingFile) return null

    const formData = new FormData()
    formData.append('file', pendingFile)
    formData.append('roomId', roomId)

    const response = await fetch('/api/upload-room', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')

    const data = await response.json()
    return data.url
  }

  const removeImage = () => {
    setImageUrl(null)
    setPendingFile(null)
  }

  const onSubmit = async (data: RoomFormData) => {
    setLoading(true)

    try {
      // Convert empty strings to null
      const payload = {
        name: data.name || null,
        slug: data.slug || null,
        emoji: data.emoji || null,
        description: data.description || null,
      }

      if (roomId) {
        // Update existing room
        const { error } = await (supabase
          .from('rooms') as any)
          .update(payload)
          .eq('id', roomId)

        if (error) throw error

        setSuccessMessage('Room updated successfully')
        setShowSuccessModal(true)
        setTimeout(() => {
          router.push('/dashboard/rooms')
          router.refresh()
        }, 1500)
      } else {
        // Create new room
        const { data: newRoom, error } = await (supabase
          .from('rooms') as any)
          .insert(payload)
          .select()
          .single()

        if (error) throw error

        // Upload pending image if exists
        if (pendingFile && newRoom) {
          const imageUrl = await uploadPendingImage(newRoom.id)

          await (supabase
            .from('rooms') as any)
            .update({ hero_image_url: imageUrl })
            .eq('id', newRoom.id)
        }

        setSuccessMessage('Room created successfully')
        setShowSuccessModal(true)
        setTimeout(() => {
          router.push('/dashboard/rooms')
          router.refresh()
        }, 1500)
      }
    } catch (error: any) {
      console.error('Error saving room:', error)
      alert(error.message || 'Failed to save room')
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
              Room Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              onChange={handleNameChange}
              className="input-field"
              placeholder="e.g., Living Room"
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
              placeholder="living-room"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Emoji */}
          <div>
            <label htmlFor="emoji" className="block text-sm font-medium text-slate-700 mb-2">
              Emoji (Optional)
            </label>
            <input
              type="text"
              id="emoji"
              {...register('emoji')}
              className="input-field"
              placeholder="e.g., 🛋️"
              maxLength={2}
            />
            <p className="mt-1 text-xs text-slate-500">
              Add a single emoji to represent this room type
            </p>
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
              placeholder="Brief description of the room type..."
            />
          </div>
        </div>
      </div>

      {/* Hero Image Upload */}
      <div className="card p-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
          Hero Image
        </h2>

        {imageUrl ? (
          <div className="relative inline-block">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden max-w-2xl">
              <Image
                src={imageUrl}
                alt="Room"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div>
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-12 w-12 text-slate-400 mb-4" />
                <p className="mb-2 text-sm text-slate-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PNG, JPG, WebP (MAX. 5MB)</p>
              </div>
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
        )}

        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading image...
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard/rooms')}
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
            <>{roomId ? 'Update Room' : 'Create Room'}</>
          )}
        </button>
      </div>
    </form>
    </>
  )
}
