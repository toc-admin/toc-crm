'use client'

import Link from 'next/link'
import { Package, Mail, Bell, Star, MoreVertical, ChevronUp, ChevronRight, User, FolderOpen, Tag, Building, Plus } from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  totalQuotes: number
  newQuotes: number
  activeProducts: number
  totalCategories: number
  totalBrands: number
}

interface Quote {
  id: string
  customer_name: string
  customer_email: string
  status: string
  created_at: string
  products?: {
    name: string
  }
}

interface DashboardContentProps {
  stats: DashboardStats
  recentQuotes: Quote[]
  greeting: string
}

export default function DashboardContent({ stats, recentQuotes, greeting }: DashboardContentProps) {
  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      change: '+12%',
      trend: 'up',
      icon: 'box',
    },
    {
      name: 'Quote Requests',
      value: stats.totalQuotes,
      change: '+8%',
      trend: 'up',
      icon: 'mail',
    },
    {
      name: 'New Requests',
      value: stats.newQuotes,
      change: 'Active',
      trend: 'neutral',
      icon: 'bell',
    },
    {
      name: 'Featured Items',
      value: stats.activeProducts,
      change: '+3%',
      trend: 'up',
      icon: 'star',
    },
  ]

  const quickActions = [
    {
      name: 'Add Product',
      href: '/dashboard/products/new',
      icon: 'plus',
      color: 'bg-slate-900',
    },
    {
      name: 'View Quotes',
      href: '/dashboard/quotes',
      icon: 'mail',
      color: 'bg-white border-2 border-gray-200',
      textColor: 'text-slate-900',
    },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header with Greeting */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          {greeting}
        </h1>
        <p className="text-slate-600 text-lg">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className={`${action.color} ${action.textColor || 'text-white'} px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-200 flex items-center gap-2 shadow-lg`}
          >
            {action.icon === 'plus' && <Plus size={20} />}
            {action.icon === 'mail' && <Mail size={20} />}
            {action.name}
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                {stat.icon === 'box' && <Package size={24} className="text-slate-900" />}
                {stat.icon === 'mail' && <Mail size={24} className="text-slate-900" />}
                {stat.icon === 'bell' && <Bell size={24} className="text-slate-900" />}
                {stat.icon === 'star' && <Star size={24} className="text-slate-900" />}
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-slate-400" />
              </button>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">{stat.name}</h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              {stat.trend === 'up' && (
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <ChevronUp size={16} />
                  {stat.change}
                </span>
              )}
              {stat.trend === 'neutral' && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quote Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Requests</h2>
            <Link
              href="/dashboard/quotes"
              className="text-sm font-medium text-slate-900 hover:text-slate-700 flex items-center gap-1"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          {recentQuotes.length > 0 ? (
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/dashboard/quotes/${quote.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                    <User size={20} className="text-slate-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {quote.customer_name}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {quote.products?.name || 'General Inquiry'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full
                        ${quote.status === 'new' ? 'bg-green-100 text-green-700' : ''}
                        ${quote.status === 'contacted' ? 'bg-blue-100 text-blue-700' : ''}
                        ${quote.status === 'quoted' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${quote.status === 'closed' ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {quote.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(quote.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">No quote requests yet</h3>
              <p className="text-sm text-slate-500">
                New requests will appear here
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Quick Overview</h2>
          </div>

          <div className="space-y-4">
            <Link
              href="/dashboard/products"
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Package size={24} className="text-slate-900" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Products</p>
                  <p className="text-sm text-slate-500">Manage inventory</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{stats.totalProducts}</span>
                <ChevronRight size={20} className="text-slate-400" />
              </div>
            </Link>

            <Link
              href="/dashboard/categories"
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <FolderOpen size={24} className="text-slate-900" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Categories</p>
                  <p className="text-sm text-slate-500">Product groups</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{stats.totalCategories}</span>
                <ChevronRight size={20} className="text-slate-400" />
              </div>
            </Link>

            <Link
              href="/dashboard/brands"
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Tag size={24} className="text-slate-900" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Brands</p>
                  <p className="text-sm text-slate-500">Brand partners</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{stats.totalBrands}</span>
                <ChevronRight size={20} className="text-slate-400" />
              </div>
            </Link>

            <Link
              href="/dashboard/rooms"
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Building size={24} className="text-slate-900" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Rooms</p>
                  <p className="text-sm text-slate-500">Space categories</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={20} className="text-slate-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
