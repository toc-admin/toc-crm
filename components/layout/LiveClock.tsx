'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

export default function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-sky-50 to-purple-50 rounded-xl border border-sky-100/50">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Clock className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-600">
          {formatDate(time)}
        </span>
        <span className="text-sm font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
          {formatTime(time)}
        </span>
      </div>
    </div>
  )
}
