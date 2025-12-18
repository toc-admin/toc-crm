'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

interface DeleteQuoteButtonProps {
  quoteId: string
  customerName: string
}

export default function DeleteQuoteButton({
  quoteId,
  customerName,
}: DeleteQuoteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the quote request from "${customerName}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', quoteId)

      if (error) throw error

      router.push('/dashboard/quotes')
      router.refresh()
    } catch (error) {
      console.error('Error deleting quote:', error)
      alert('Failed to delete quote request')
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? 'Deleting...' : 'Delete Quote Request'}
    </button>
  )
}
