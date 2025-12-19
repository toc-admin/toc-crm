import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import ProductForm from '@/components/products/ProductForm'
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  const supabase = createServerClient()

  const { data: product, error } = await (supabase
    .from('products') as any)
    .select(`
      *,
      images:product_images(*),
      features:product_features(*),
      certifications:product_certifications(*),
      colors:product_colors(*),
      specifications:product_specifications(*),
      rooms:product_rooms(room_id)
    `)
    .eq('id', id)
    .single()

  if (error || !product) {
    return null
  }

  return product
}

async function getData() {
  const supabase = createServerClient()

  const [{ data: brands }, { data: categories }, { data: rooms }] = await Promise.all([
    (supabase.from('brands') as any).select('id, name').order('name'),
    (supabase.from('categories') as any).select('id, name').order('name'),
    (supabase.from('rooms') as any).select('id, name').order('name'),
  ])

  return {
    brands: brands || [],
    categories: categories || [],
    rooms: rooms || [],
  }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, { brands, categories, rooms }] = await Promise.all([
    getProduct(params.id),
    getData(),
  ])

  if (!product) {
    notFound()
  }

  // Transform data for form
  const initialData = {
    ...product,
    images: product.images?.map((img: any) => ({
      url: img.image_url,
      thumbnail: img.thumbnail_url,
      medium: img.medium_url,
      is_primary: img.is_primary,
      id: img.id,
    })) || [],
    rooms: product.rooms?.map((r: any) => ({ id: r.room_id })) || [],
  }

  return (
    <>
      <Header title="Edit Product" description={`Update ${product.name}`} />
      <div className="p-8">
        <ProductForm
          brands={brands}
          categories={categories}
          rooms={rooms}
          initialData={initialData}
          productId={params.id}
        />
      </div>
    </>
  )
}
