import Header from '@/components/layout/Header'
import BrandForm from '@/components/brands/BrandForm'

export default function NewBrandPage() {
  return (
    <>
      <Header
        title="Add Brand"
        description="Create a new furniture brand"
      />

      <div className="p-8 max-w-4xl">
        <BrandForm />
      </div>
    </>
  )
}
