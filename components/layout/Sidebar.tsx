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
          <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.4899 2.82584C12.3101 2.35912 11.0343 2.16166 9.75618 2.24794C8.47803 2.33423 7.22997 2.70207 6.10362 3.32447C4.97727 3.94687 4.00123 4.80802 3.24716 5.84469C2.49309 6.88137 1.98012 8.06725 1.74593 9.31528L4.42492 9.75556C4.58464 8.90439 4.93448 8.09561 5.44876 7.38859C5.96305 6.68157 6.62871 6.09426 7.39689 5.66978C8.16507 5.2453 9.01626 4.99443 9.88796 4.93558C10.7597 4.87674 11.6298 5.01141 12.4344 5.32971L13.4899 2.82584Z" fill="white"/>
<path d="M7.01913 19.0041C8.20359 19.4681 9.48538 19.6621 10.7704 19.5719C12.0554 19.4816 13.311 19.1094 14.4451 18.4826C15.5791 17.8557 16.5628 16.9902 17.3238 15.9495C18.0849 14.9088 18.6041 13.7193 18.8432 12.4684L16.1517 12.0354C15.9886 12.8885 15.6345 13.6997 15.1154 14.4095C14.5964 15.1193 13.9255 15.7096 13.1521 16.1371C12.3787 16.5646 11.5223 16.8184 10.646 16.88C9.76957 16.9415 8.89538 16.8092 8.08757 16.4928L7.01913 19.0041Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.2574 12.5599C12.1783 12.0282 12.4938 10.8506 11.9622 9.92966C11.4305 9.00873 10.2529 8.6932 9.33195 9.2249C8.41103 9.75659 8.09549 10.9342 8.62719 11.8551C9.15889 12.776 10.3365 13.0916 11.2574 12.5599ZM12.7233 15.0989C15.0465 13.7576 15.8425 10.7869 14.5012 8.46375C13.1599 6.14057 10.1892 5.34458 7.86605 6.68588C5.54286 8.02717 4.74688 10.9978 6.08817 13.321C7.42946 15.6442 10.4001 16.4402 12.7233 15.0989Z" fill="white"/>
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
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100/60 hover:text-slate-900 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
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
