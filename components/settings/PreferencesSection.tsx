'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Settings } from 'lucide-react'
import SuccessModal from '@/components/ui/SuccessModal'

interface PreferencesFormData {
  defaultViewMode: 'grid' | 'list'
  emailNotificationsEnabled: boolean
  notifyNewQuotes: boolean
  notifyQuoteUpdates: boolean
}

interface PreferencesSectionProps {
  userId: string
  initialPreferences: any
}

export default function PreferencesSection({
  userId,
  initialPreferences,
}: PreferencesSectionProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { register, handleSubmit, watch } = useForm<PreferencesFormData>({
    defaultValues: {
      defaultViewMode: initialPreferences?.default_view_mode || 'grid',
      emailNotificationsEnabled:
        initialPreferences?.email_notifications_enabled ?? true,
      notifyNewQuotes: initialPreferences?.notify_new_quotes ?? true,
      notifyQuoteUpdates: initialPreferences?.notify_quote_updates ?? true,
    },
  })

  const emailNotificationsEnabled = watch('emailNotificationsEnabled')

  const onSubmit = async (data: PreferencesFormData) => {
    setLoading(true)

    try {
      // Upsert user preferences
      const { error } = await (supabase.from('user_preferences') as any).upsert(
        {
          user_id: userId,
          default_view_mode: data.defaultViewMode,
          email_notifications_enabled: data.emailNotificationsEnabled,
          notify_new_quotes: data.notifyNewQuotes,
          notify_quote_updates: data.notifyQuoteUpdates,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      )

      if (error) throw error

      setSuccessMessage('Preferences updated successfully')
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error updating preferences:', error)
      alert(error.message || 'Failed to update preferences')
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
            <Settings className="h-6 w-6 text-slate-700" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              Preferences
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Customize your experience and notifications
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Default View Mode */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Default View Mode
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  value="grid"
                  {...register('defaultViewMode')}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="font-medium text-slate-900">Grid View</div>
                  <div className="text-sm text-slate-600">
                    Display items in a grid layout with large thumbnails
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  value="list"
                  {...register('defaultViewMode')}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="font-medium text-slate-900">List View</div>
                  <div className="text-sm text-slate-600">
                    Display items in a compact list with small thumbnails
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="pt-6 border-t border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-4">
              Email Notifications
            </label>

            {/* Master Toggle */}
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <div className="font-medium text-slate-900">
                  Enable Email Notifications
                </div>
                <div className="text-sm text-slate-600">
                  Receive email updates about quotes and system activity
                </div>
              </div>
              <input
                type="checkbox"
                {...register('emailNotificationsEnabled')}
                className="w-5 h-5 text-slate-900 rounded focus:ring-slate-900"
              />
            </label>

            {/* Individual notification settings */}
            <div className="mt-4 space-y-3 ml-4">
              <label
                className={`flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer ${
                  !emailNotificationsEnabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-slate-50'
                } transition-colors`}
              >
                <div>
                  <div className="font-medium text-slate-900">New Quotes</div>
                  <div className="text-sm text-slate-600">
                    Get notified when a new quote request is submitted
                  </div>
                </div>
                <input
                  type="checkbox"
                  {...register('notifyNewQuotes')}
                  disabled={!emailNotificationsEnabled}
                  className="w-5 h-5 text-slate-900 rounded focus:ring-slate-900 disabled:cursor-not-allowed"
                />
              </label>

              <label
                className={`flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer ${
                  !emailNotificationsEnabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-slate-50'
                } transition-colors`}
              >
                <div>
                  <div className="font-medium text-slate-900">
                    Quote Updates
                  </div>
                  <div className="text-sm text-slate-600">
                    Get notified when quote status changes
                  </div>
                </div>
                <input
                  type="checkbox"
                  {...register('notifyQuoteUpdates')}
                  disabled={!emailNotificationsEnabled}
                  className="w-5 h-5 text-slate-900 rounded focus:ring-slate-900 disabled:cursor-not-allowed"
                />
              </label>
            </div>
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
                'Save Preferences'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
