import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProductsTable from '@/components/products/ProductsTable'

export const dynamic = 'force-dynamic'

async function getProducts() {
  const supabase = createServerClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(name),
      category:categories(name)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return products || []
}

async function getBrandsAndCategories() {
  const supabase = createServerClient()

  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ])

  return {
    brands: brands || [],
    categories: categories || [],
  }
}

export default async function ProductsPage() {
  const [products, { brands, categories }] = await Promise.all([
    getProducts(),
    getBrandsAndCategories(),
  ])

  return (
    <>
      <Header
        title="Products"
        description={`Manage your product catalog (${products.length} products)`}
        action={
          <Link href="/dashboard/products/new" className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        }
      />

      <div className="p-8">
        <ProductsTable
          products={products}
          brands={brands}
          categories={categories}
        />
      </div>
    </>
  )
}
