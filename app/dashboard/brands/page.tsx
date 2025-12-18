import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import BrandsGrid from '@/components/brands/BrandsGrid'

export const dynamic = 'force-dynamic'

async function getBrands() {
  const supabase = createServerClient()

  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return brands || []
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <>
      <Header
        title="Brands"
        description={`Manage furniture brands (${brands.length} brands)`}
        action={
          <Link href="/dashboard/brands/new" className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Link>
        }
      />

      <div className="p-8">
        <BrandsGrid brands={brands} />
      </div>
    </>
  )
}
