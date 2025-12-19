'use client'

import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { User as UserIcon, Settings } from 'lucide-react'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <Link
      href="/dashboard/settings"
      className="flex items-center gap-3 px-4 py-3 hover:bg-white/60 transition-colors rounded-xl group"
    >
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex-shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-500 to-purple-600">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {/* Name and Settings hint */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">
          {fullName}
        </p>
        <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors flex items-center gap-1">
          <Settings className="h-3 w-3" />
          Settings
        </p>
      </div>
    </Link>
  )
}
