import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import { Package, Mail, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const supabase = createServerClient()

  const [
    { count: totalProducts },
    { count: totalQuotes },
    { count: newQuotes },
    { count: featuredProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('quote_requests').select('*', { count: 'exact', head: true }),
    supabase
      .from('quote_requests')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)
      .is('deleted_at', null),
  ])

  return {
    totalProducts: totalProducts || 0,
    totalQuotes: totalQuotes || 0,
    newQuotes: newQuotes || 0,
    featuredProducts: featuredProducts || 0,
  }
}

async function getRecentQuotes() {
  const supabase = createServerClient()

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('*, products(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  return quotes || []
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentQuotes = await getRecentQuotes()

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Quotes',
      value: stats.totalQuotes,
      icon: Mail,
      color: 'bg-green-500',
    },
    {
      name: 'New Quotes (7 days)',
      value: stats.newQuotes,
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
    {
      name: 'Featured Products',
      value: stats.featuredProducts,
      icon: Star,
      color: 'bg-purple-500',
    },
  ]

  return (
    <>
      <Header
        title="Dashboard"
        description="Overview of your CRM system"
      />

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/products/new"
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 hover:bg-primary-50 transition-colors duration-150 text-center"
            >
              <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Add New Product</span>
            </Link>
            <Link
              href="/dashboard/quotes"
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 hover:bg-primary-50 transition-colors duration-150 text-center"
            >
              <Mail className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">View Quotes</span>
            </Link>
            <Link
              href="/dashboard/categories"
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 hover:bg-primary-50 transition-colors duration-150 text-center"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Manage Categories</span>
            </Link>
          </div>
        </div>

        {/* Recent Quotes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Quote Requests</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            {recentQuotes.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {quote.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quote.customer_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.products?.name || 'General Inquiry'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${quote.status === 'new' ? 'bg-green-100 text-green-800' : ''}
                            ${quote.status === 'contacted' ? 'bg-blue-100 text-blue-800' : ''}
                            ${quote.status === 'quoted' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${quote.status === 'closed' ? 'bg-gray-100 text-gray-800' : ''}
                          `}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Quote requests will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
