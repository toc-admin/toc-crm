'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import SuccessModal from '@/components/ui/SuccessModal'
import { User } from '@supabase/supabase-js'

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileSectionProps {
  user: User
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.user_metadata?.avatar_url || null
  )
  const [uploading, setUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.user_metadata?.full_name || '',
    },
  })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: data.url,
        },
      })

      if (error) throw error

      setAvatarUrl(data.url)
      setSuccessMessage('Avatar uploaded successfully')
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const removeAvatar = async () => {
    try {
      // Update user metadata to remove avatar_url
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      })

      if (error) throw error

      setAvatarUrl(null)
      setSuccessMessage('Avatar removed successfully')
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error removing avatar:', error)
      alert('Failed to remove avatar')
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true)

    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
        },
      })

      if (error) throw error

      setSuccessMessage('Profile updated successfully')
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      alert(error.message || 'Failed to update profile')
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

      <div className="card p-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
          Profile Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Profile Picture
            </label>
            {avatarUrl ? (
              <div className="relative inline-block">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                  <Image
                    src={avatarUrl}
                    alt="Profile Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="avatar"
                  className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-full cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 bg-slate-100"
                >
                  <div className="flex flex-col items-center justify-center">
                    {uploading ? (
                      <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
                    ) : (
                      <>
                        <UserIcon className="h-8 w-8 text-slate-400 mb-1" />
                        <p className="text-xs text-slate-500 text-center px-2">
                          Upload
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="avatar"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            )}
            {uploading && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading avatar...
              </div>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              {...register('fullName')}
              className="input-field"
              placeholder="e.g., John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email || ''}
              className="input-field bg-slate-100 cursor-not-allowed"
              readOnly
              disabled
            />
            <p className="mt-1 text-xs text-slate-500">
              Email cannot be changed here. Contact support to update your
              email.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
