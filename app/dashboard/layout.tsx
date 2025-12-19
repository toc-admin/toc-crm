import Sidebar from '@/components/layout/Sidebar'
import UserProfile from '@/components/layout/UserProfile'
import LiveClock from '@/components/layout/LiveClock'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function getUser() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Right: User Profile & Clock */}
        <div className="absolute top-4 right-8 z-10 flex items-center gap-4">
          <LiveClock />
          <UserProfile user={user} />
        </div>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
