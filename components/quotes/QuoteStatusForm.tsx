'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import SuccessModal from '@/components/ui/SuccessModal'

interface QuoteStatusFormProps {
  quoteId: string
  currentStatus: 'new' | 'contacted' | 'quoted' | 'closed'
}

const statusOptions = [
  { value: 'new', label: 'New', icon: Mail, color: 'text-blue-600' },
  { value: 'contacted', label: 'Contacted', icon: MessageSquare, color: 'text-yellow-600' },
  { value: 'quoted', label: 'Quoted', icon: CheckCircle, color: 'text-purple-600' },
  { value: 'closed', label: 'Closed', icon: XCircle, color: 'text-slate-600' },
]

export default function QuoteStatusForm({
  quoteId,
  currentStatus,
}: QuoteStatusFormProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === currentStatus) return

    setIsSubmitting(true)

    try {
      const { error } = await (supabase
        .from('quote_requests') as any)
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quoteId)

      if (error) throw error

      setShowSuccess(true)
      router.refresh()
    } catch (error) {
      console.error('Error updating quote status:', error)
      alert('Failed to update quote status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentIcon = statusOptions.find(opt => opt.value === status)?.icon || Mail

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Status
          </label>
          <div className="space-y-2">
            {statusOptions.map((option) => {
              const Icon = option.icon
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    status === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(e.target.value as typeof status)}
                    className="sr-only"
                  />
                  <Icon className={`h-5 w-5 ${status === option.value ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className={`font-medium ${status === option.value ? 'text-primary-900' : 'text-slate-700'}`}>
                    {option.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || status === currentStatus}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </button>
      </form>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Quote status updated successfully"
      />
    </>
  )
}
