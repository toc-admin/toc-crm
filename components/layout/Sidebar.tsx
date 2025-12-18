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
    <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
          <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.0935 3.58066C15.5986 2.98926 13.982 2.73905 12.3624 2.84839C10.7428 2.95772 9.16133 3.42383 7.73409 4.21249C6.30685 5.00116 5.07008 6.09235 4.11456 7.40596C3.15905 8.71957 2.50905 10.2222 2.2123 11.8037L5.60694 12.3616C5.80933 11.283 6.25263 10.2582 6.9043 9.36229C7.55596 8.46639 8.39945 7.72219 9.37284 7.18432C10.3462 6.64645 11.4248 6.32856 12.5294 6.25399C13.6339 6.17942 14.7365 6.35007 15.756 6.7534L17.0935 3.58066Z" fill="white"/>
<path d="M8.89425 24.0806C10.3951 24.6686 12.0193 24.9144 13.6476 24.8001C15.2759 24.6857 16.8669 24.2141 18.3039 23.4198C19.7409 22.6255 20.9873 21.5287 21.9517 20.21C22.9161 18.8913 23.5739 17.3841 23.8769 15.799L20.4664 15.2503C20.2597 16.3313 19.8111 17.3592 19.1534 18.2586C18.4957 19.158 17.6456 19.906 16.6656 20.4477C15.6855 20.9894 14.6004 21.3111 13.4899 21.3891C12.3794 21.4671 11.2717 21.2994 10.2481 20.8984L8.89425 24.0806Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.2646 15.9146C15.4315 15.2409 15.8314 13.7488 15.1576 12.5818C14.4839 11.4149 12.9917 11.0151 11.8248 11.6888C10.6579 12.3625 10.258 13.8547 10.9318 15.0216C11.6055 16.1886 13.0977 16.5884 14.2646 15.9146ZM16.1221 19.1319C19.0659 17.4323 20.0745 13.6681 18.3749 10.7243C16.6753 7.78052 12.9111 6.7719 9.9673 8.4715C7.0235 10.1711 6.01488 13.9353 7.71448 16.8791C9.41408 19.8229 13.1783 20.8315 16.1221 19.1319Z" fill="white"/>
</svg>
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
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-gray-100 hover:text-slate-900'
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
      <div className="p-3 border-t border-gray-200 space-y-1">
        {/* <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100/60 hover:text-slate-900 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link> */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-gray-100 hover:text-slate-900 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
