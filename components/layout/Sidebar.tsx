'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Tag,
  Building2,
  Mail,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Categories', href: '/dashboard/categories', icon: FolderOpen },
  { name: 'Brands', href: '/dashboard/brands', icon: Tag },
  { name: 'Rooms', href: '/dashboard/rooms', icon: Building2 },
  { name: 'Quote Requests', href: '/dashboard/quotes', icon: Mail },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-slate-900">The Office Co.</h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">Furniture CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-soft'
                    : 'text-slate-700 hover:bg-slate-100/60 hover:text-slate-900'
                }
              `}
            >
              <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-200/60 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100/60 hover:text-slate-900 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
