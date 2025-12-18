import Header from '@/components/layout/Header'
import CategoryForm from '@/components/categories/CategoryForm'

export default function NewCategoryPage() {
  return (
    <>
      <Header
        title="Add Category"
        description="Create a new product category"
      />

      <div className="p-8 max-w-4xl">
        <CategoryForm />
      </div>
    </>
  )
}
