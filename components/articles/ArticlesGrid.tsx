'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Edit,
  Trash2,
  Search,
  Grid3x3,
  List,
  FileText,
  Eye,
  Archive,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import type { ArticleWithRelations } from '@/types/database.types'

interface ArticlesGridProps {
  articles: ArticleWithRelations[]
}

const statusStyles = {
  draft: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    label: 'Draft',
    icon: FileText,
  },
  published: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Published',
    icon: Eye,
  },
  archived: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    label: 'Archived',
    icon: Archive,
  },
}

export default function ArticlesGrid({ articles }: ArticlesGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()
  const supabase = createClient()

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || article.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [articles, searchTerm, statusFilter])

  const handleDelete = async (
    e: React.MouseEvent,
    id: string,
    title: string
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      // Soft delete
      const { error } = await (supabase
        .from('articles') as any)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      alert('Article deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article')
    }
  }

  const StatusBadge = ({ status }: { status: keyof typeof statusStyles }) => {
    const style = statusStyles[status]
    const Icon = style.icon
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
      >
        <Icon className="h-3 w-3" />
        {style.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles by title, slug, or excerpt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Showing {filteredArticles.length} of {articles.length} articles
          </span>
        </div>
      </div>

      {/* Grid/List View */}
      {filteredArticles.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
            No articles found
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first article'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/dashboard/articles/${article.id}`}
              className="group card overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                {article.cover_image_thumbnail_url || article.cover_image_url ? (
                  <Image
                    src={article.cover_image_thumbnail_url || article.cover_image_url!}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-16 w-16 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={article.status} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>
                    {article.published_at
                      ? `Published ${formatDate(article.published_at)}`
                      : `Created ${formatDate(article.created_at)}`}
                  </span>
                  {article.category && (
                    <span className="bg-slate-100 px-2 py-1 rounded">
                      {article.category.name}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      router.push(`/dashboard/articles/${article.id}`)
                    }}
                    className="flex-1 py-2 px-3 bg-gray-100 text-slate-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, article.id, article.title)}
                    className="py-2 px-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/articles/${article.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {article.cover_image_thumbnail_url ||
                          article.cover_image_url ? (
                            <Image
                              src={
                                article.cover_image_thumbnail_url ||
                                article.cover_image_url!
                              }
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 line-clamp-1">
                            {article.title}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {article.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {article.category ? (
                        <span className="text-sm text-slate-600">
                          {article.category.name}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {article.published_at
                        ? formatDate(article.published_at)
                        : formatDate(article.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/articles/${article.id}`)
                          }}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) =>
                            handleDelete(e, article.id, article.title)
                          }
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
