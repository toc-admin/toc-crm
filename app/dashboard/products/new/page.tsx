import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import ProductForm from '@/components/products/ProductForm'

async function getData() {
  const supabase = createServerClient()

  const [{ data: brands }, { data: categories }, { data: rooms }] = await Promise.all([
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('rooms').select('id, name').order('name'),
  ])

  return {
    brands: brands || [],
    categories: categories || [],
    rooms: rooms || [],
  }
}

export default async function NewProductPage() {
  const { brands, categories, rooms } = await getData()

  return (
    <>
      <Header title="Add New Product" description="Create a new product in your catalog" />
      <div className="p-8">
        <ProductForm brands={brands} categories={categories} rooms={rooms} />
      </div>
    </>
  )
}
