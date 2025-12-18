import { createServerClient } from '@/lib/supabase/server'
import { getRandomGreeting, getUsernameFromEmail } from '@/lib/greetings'
import DashboardContent from '@/components/dashboard/DashboardContent'

async function getDashboardStats() {
  const supabase = createServerClient()

  const [
    { count: totalProducts },
    { count: totalQuotes },
    { count: newQuotes },
    { count: activeProducts },
    { count: totalCategories },
    { count: totalBrands },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('quote_requests').select('*', { count: 'exact', head: true }),
    supabase
      .from('quote_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)
      .is('deleted_at', null),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalProducts: totalProducts || 0,
    totalQuotes: totalQuotes || 0,
    newQuotes: newQuotes || 0,
    activeProducts: activeProducts || 0,
    totalCategories: totalCategories || 0,
    totalBrands: totalBrands || 0,
  }
}

async function getRecentQuotes() {
  const supabase = createServerClient()

  const { data: quotes } = await (supabase
    .from('quote_requests') as any)
    .select('*, products(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return quotes || []
}

async function getUserEmail() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email || ''
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentQuotes = await getRecentQuotes()
  const userEmail = await getUserEmail()
  const username = getUsernameFromEmail(userEmail)
  const greeting = getRandomGreeting(username)

  return (
    <DashboardContent
      stats={stats}
      recentQuotes={recentQuotes}
      greeting={greeting}
    />
  )
}
