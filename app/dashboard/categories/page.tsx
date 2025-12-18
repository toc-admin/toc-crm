import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import CategoriesGrid from '@/components/categories/CategoriesGrid'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const supabase = createServerClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return categories || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <>
      <Header
        title="Categories"
        description={`Manage product categories (${categories.length} categories)`}
        action={
          <Link href="/dashboard/categories/new" className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        }
      />

      <div className="p-8">
        <CategoriesGrid categories={categories} />
      </div>
    </>
  )
}
