'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Grid3x3, List, Mail, Building2, Phone, User, Package, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Quote {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_company: string | null
  quantity: number | null
  additional_requirements: string | null
  status: 'new' | 'contacted' | 'quoted' | 'closed'
  created_at: string
  updated_at: string
  product: {
    id: string
    name: string
    sku: string | null
  } | null
}

interface QuotesTableProps {
  quotes: Quote[]
}

const statusConfig = {
  new: {
    label: 'New',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Mail,
  },
  contacted: {
    label: 'Contacted',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: MessageSquare,
  },
  quoted: {
    label: 'Quoted',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: CheckCircle,
  },
  closed: {
    label: 'Closed',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: XCircle,
  },
}

export default function QuotesTable({ quotes }: QuotesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch =
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.product?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || quote.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [quotes, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by customer name, email, company, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-soft'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-soft'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="closed">Closed</option>
          </select>

          <div className="ml-auto text-sm text-slate-600 font-medium">
            {filteredQuotes.length} of {quotes.length} requests
          </div>
        </div>
      </div>

      {/* Quotes Grid/List */}
      {filteredQuotes.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map((quote) => {
              const StatusIcon = statusConfig[quote.status].icon
              return (
                <Link
                  key={quote.id}
                  href={`/dashboard/quotes/${quote.id}`}
                  className="group card p-6 hover:shadow-large hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                          {quote.customer_name}
                        </h3>
                        {quote.customer_company && (
                          <p className="mt-1 text-sm text-slate-600 truncate flex items-center gap-1">
                            <Building2 className="h-3 w-3 flex-shrink-0" />
                            {quote.customer_company}
                          </p>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 border ${statusConfig[quote.status].color} text-xs font-semibold rounded-lg flex-shrink-0`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[quote.status].label}
                      </span>
                    </div>

                    {quote.product && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Package className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 line-clamp-2">
                              {quote.product.name}
                            </p>
                            {quote.product.sku && (
                              <p className="mt-1 text-xs text-slate-500 font-mono">
                                SKU: {quote.product.sku}
                              </p>
                            )}
                          </div>
                        </div>
                        {quote.quantity && (
                          <p className="mt-2 text-xs text-slate-600">
                            Quantity: <span className="font-semibold">{quote.quantity}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 truncate">
                        <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{quote.customer_email}</span>
                      </div>
                      {quote.customer_phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                          <span>{quote.customer_phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(quote.created_at)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="card divide-y divide-slate-100">
            {filteredQuotes.map((quote) => {
              const StatusIcon = statusConfig[quote.status].icon
              return (
                <Link
                  key={quote.id}
                  href={`/dashboard/quotes/${quote.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors duration-200 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                          {quote.customer_name}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            {quote.customer_email}
                          </span>
                          {quote.customer_company && (
                            <>
                              <span className="text-slate-400">•</span>
                              <span className="flex items-center gap-1 truncate">
                                <Building2 className="h-3 w-3 flex-shrink-0" />
                                {quote.customer_company}
                              </span>
                            </>
                          )}
                          {quote.customer_phone && (
                            <>
                              <span className="text-slate-400">•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                {quote.customer_phone}
                              </span>
                            </>
                          )}
                        </div>
                        {quote.product && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <Package className="h-3 w-3" />
                            <span className="truncate">{quote.product.name}</span>
                            {quote.quantity && (
                              <>
                                <span>•</span>
                                <span>Qty: {quote.quantity}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 border ${statusConfig[quote.status].color} text-xs font-semibold rounded-lg`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[quote.status].label}
                        </span>
                        <div className="text-xs text-slate-500 text-right">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDate(quote.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )
      ) : (
        <div className="card p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto">
              <Mail className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-slate-900">
                No quote requests found
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Quote requests will appear here'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
