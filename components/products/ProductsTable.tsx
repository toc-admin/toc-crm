'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Star, Package, Search, Grid3x3, List, Sparkles, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  sku: string | null
  is_featured: boolean
  is_new: boolean
  created_at: string
  short_description: string | null
  brand: { name: string } | null
  category: { name: string } | null
}

interface ProductsTableProps {
  products: Product[]
  brands: { id: string; name: string }[]
  categories: { id: string; name: string }[]
}

export default function ProductsTable({
  products,
  brands,
  categories,
}: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()
  const supabase = createClient()

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBrand =
        brandFilter === 'all' || product.brand?.name === brandFilter

      const matchesCategory =
        categoryFilter === 'all' || product.category?.name === categoryFilter

      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'featured' && product.is_featured) ||
        (featuredFilter === 'regular' && !product.is_featured)

      return matchesSearch && matchesBrand && matchesCategory && matchesFeatured
    })
  }, [products, searchTerm, brandFilter, categoryFilter, featuredFilter])

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const { error } = await (supabase
        .from('products') as any)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      alert('Product deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card p-6 space-y-4">
        {/* Search bar with view toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* View mode toggle */}
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

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          >
            <option value="all">All Products</option>
            <option value="featured">Featured Only</option>
            <option value="regular">Regular Only</option>
          </select>

          <div className="ml-auto text-sm text-slate-600 font-medium">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="group card p-0 overflow-hidden hover:shadow-large hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                {/* Product Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                  <Package className="h-16 w-16 text-slate-400 group-hover:scale-110 transition-transform duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-lg shadow-soft">
                        <Star className="h-3 w-3 fill-white" />
                        Featured
                      </span>
                    )}
                    {product.is_new && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg shadow-soft">
                        <Sparkles className="h-3 w-3" />
                        New
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <button
                      onClick={(e) => handleDelete(e, product.id, product.name)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-medium hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="space-y-1">
                      {product.category && (
                        <p className="text-xs text-slate-500">
                          {product.category.name}
                        </p>
                      )}
                      {product.brand && (
                        <p className="text-xs font-medium text-slate-700">
                          {product.brand.name}
                        </p>
                      )}
                    </div>
                    {product.sku && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded">
                        {product.sku}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // List View
          <div className="card divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors duration-200 group"
              >
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                        {product.name}
                      </h3>
                      {product.short_description && (
                        <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                          {product.short_description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        {product.category && <span>{product.category.name}</span>}
                        {product.brand && <span>• {product.brand.name}</span>}
                        {product.sku && <span>• SKU: {product.sku}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg">
                          <Star className="h-3 w-3 fill-yellow-700" />
                          Featured
                        </span>
                      )}
                      {product.is_new && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                          New
                        </span>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, product.id, product.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="card p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto">
              <Package className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-slate-900">
                No products found
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {searchTerm || brandFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first product'}
              </p>
            </div>
            {!searchTerm && brandFilter === 'all' && categoryFilter === 'all' && (
              <Link href="/dashboard/products/new" className="btn-primary inline-flex">
                <Package className="mr-2 h-4 w-4" />
                Create First Product
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
