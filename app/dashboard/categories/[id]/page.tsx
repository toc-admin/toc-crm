import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import CategoryForm from '@/components/categories/CategoryForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getCategory(id: string) {
  const supabase = createServerClient()

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    return null
  }

  return category
}

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const category = await getCategory(params.id)

  if (!category) {
    notFound()
  }

  return (
    <>
      <Header
        title="Edit Category"
        description={`Update ${category.name}`}
      />

      <div className="p-8 max-w-4xl">
        <CategoryForm
          initialData={category}
          categoryId={category.id}
        />
      </div>
    </>
  )
}
