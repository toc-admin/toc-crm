'use client'

import { useEffect } from 'react'
import { X, CheckCircle2 } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  autoDismiss?: boolean
  autoDismissDelay?: number
}

export default function SuccessModal({
  isOpen,
  onClose,
  message,
  autoDismiss = true,
  autoDismissDelay = 3000
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoDismiss) {
      const timer = setTimeout(() => {
        onClose()
      }, autoDismissDelay)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoDismiss, autoDismissDelay, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-1">Success!</h3>
            <p className="text-white/80">{message}</p>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-purple-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
