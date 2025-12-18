import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import BrandForm from '@/components/brands/BrandForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getBrand(id: string) {
  const supabase = createServerClient()

  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !brand) {
    return null
  }

  return brand
}

export default async function EditBrandPage({
  params,
}: {
  params: { id: string }
}) {
  const brand = await getBrand(params.id)

  if (!brand) {
    notFound()
  }

  return (
    <>
      <Header
        title="Edit Brand"
        description={`Update ${brand.name}`}
      />

      <div className="p-8 max-w-4xl">
        <BrandForm
          initialData={brand}
          brandId={brand.id}
        />
      </div>
    </>
  )
}
