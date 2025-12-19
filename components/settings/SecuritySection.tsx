'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Lock } from 'lucide-react'
import SuccessModal from '@/components/ui/SuccessModal'

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SecurityFormData = z.infer<typeof securitySchema>

export default function SecuritySection() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SecurityFormData) => {
    setLoading(true)

    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (error) throw error

      // Clear form
      reset()

      setSuccessMessage('Password updated successfully')
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error updating password:', error)
      alert(error.message || 'Failed to update password')
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
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-slate-100 rounded-xl">
            <Lock className="h-6 w-6 text-slate-700" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              Change Password
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Current Password *
            </label>
            <input
              type="password"
              id="currentPassword"
              {...register('currentPassword')}
              className="input-field"
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              New Password *
            </label>
            <input
              type="password"
              id="newPassword"
              {...register('newPassword')}
              className="input-field"
              placeholder="Enter your new password (min. 8 characters)"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Confirm New Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              className="input-field"
              placeholder="Re-enter your new password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Password requirements:</strong> Minimum 8 characters.
              Choose a strong password that you don't use elsewhere.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => reset()}
              className="btn-secondary"
              disabled={loading}
            >
              Clear
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
