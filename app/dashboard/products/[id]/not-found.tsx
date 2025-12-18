import Link from 'next/link'
import { Package } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been deleted.</p>
        <Link
          href="/dashboard/products"
          className="mt-6 inline-block px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800"
        >
          Back to Products
        </Link>
      </div>
    </div>
  )
}
