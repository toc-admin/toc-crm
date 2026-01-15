'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Search, Grid3x3, List, Home } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Room {
  id: string
  name: string
  slug: string
  emoji: string | null
  description: string | null
  hero_image_url: string | null
  created_at: string
}

interface RoomsGridProps {
  rooms: Room[]
}

export default function RoomsGrid({ rooms }: RoomsGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const supabase = createClient()

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.slug.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [rooms, searchTerm])

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Room deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and View Toggle */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search rooms by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200"
            />
          </div>

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
            Showing {filteredRooms.length} of {rooms.length} rooms
          </span>
        </div>
      </div>

      {/* Grid/List View */}
      {filteredRooms.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
            <Home className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
            No rooms found
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first room'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <Link
              key={room.id}
              href={`/dashboard/rooms/${room.id}`}
              className="group card overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                {room.hero_image_url && !imageErrors[room.id] ? (
                  <Image
                    src={room.hero_image_url}
                    alt={room.name}
                    fill
                    className="object-cover"
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [room.id]: true }))
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {room.emoji ? (
                      <span className="text-6xl">{room.emoji}</span>
                    ) : (
                      <Home className="h-12 w-12 text-slate-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2 transition-colors flex items-center gap-2">
                  {room.emoji && <span>{room.emoji}</span>}
                  {room.name}
                </h3>

                {room.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {room.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{formatDate(room.created_at)}</span>
                  <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                    {room.slug}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      router.push(`/dashboard/rooms/${room.id}`)
                    }}
                    className="flex-1 py-2 px-3 bg-gray-100 text-slate-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, room.id, room.name)}
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
                    Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/rooms/${room.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {room.hero_image_url && !imageErrors[room.id] ? (
                            <Image
                              src={room.hero_image_url}
                              alt={room.name}
                              fill
                              className="object-cover"
                              onError={() => {
                                setImageErrors(prev => ({ ...prev, [room.id]: true }))
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              {room.emoji ? (
                                <span className="text-2xl">{room.emoji}</span>
                              ) : (
                                <Home className="h-6 w-6 text-slate-400" />
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            {room.emoji && <span>{room.emoji}</span>}
                            {room.name}
                          </div>
                          {room.description && (
                            <div className="text-sm text-slate-500 line-clamp-1 max-w-md">
                              {room.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {room.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(room.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/rooms/${room.id}`)
                          }}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, room.id, room.name)}
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
