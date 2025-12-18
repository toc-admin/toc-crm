'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import SuccessModal from '@/components/ui/SuccessModal'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  brand_id: z.string().nullable(),
  category_id: z.string().nullable(),
  subcategory: z.string().optional(),
  sku: z.string().optional(),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  is_new: z.boolean(),
  is_featured: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  brands: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  rooms: { id: string; name: string }[]
  initialData?: any
  productId?: string
}

export default function ProductForm({
  brands,
  categories,
  rooms,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Array<{ url: string; thumbnail: string; medium: string; is_primary: boolean }>>(
    initialData?.images || []
  )
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [features, setFeatures] = useState<string[]>(
    initialData?.features?.map((f: any) => f.feature_name) || []
  )
  const [colors, setColors] = useState<Array<{ name: string; hex: string }>>(
    initialData?.colors?.map((c: any) => ({ name: c.color_name, hex: c.hex_code || '' })) || []
  )
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>(
    initialData?.specifications?.map((s: any) => ({ key: s.spec_key, value: s.spec_value })) || []
  )
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    initialData?.rooms?.map((r: any) => r.id) || []
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      brand_id: null,
      category_id: null,
      subcategory: '',
      sku: '',
      short_description: '',
      long_description: '',
      is_new: false,
      is_featured: false,
    },
  })

  const nameValue = watch('name')

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('name', name)
    if (!productId) {
      setValue('slug', slugify(name))
    }
  }

  // Generate SKU from product name
  const generateSKU = () => {
    const name = watch('name')
    if (!name) {
      alert('Please enter a product name first')
      return
    }

    // Create SKU: Take first 3 letters of each word, uppercase, add random 4 digits
    const words = name.split(' ').filter(w => w.length > 0)
    const prefix = words
      .map(w => w.substring(0, 3).toUpperCase())
      .join('-')
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const sku = `${prefix}-${randomNum}`

    setValue('sku', sku)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // If editing existing product, upload immediately
    if (productId) {
      setUploading(true)

      try {
        for (const file of Array.from(files)) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('productId', productId)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) throw new Error('Upload failed')

          const data = await response.json()

          // Save to database
          const { error } = await (supabase.from('product_images') as any).insert({
            product_id: productId,
            image_url: data.urls.original,
            thumbnail_url: data.urls.thumbnail,
            medium_url: data.urls.medium,
            is_primary: images.length === 0,
            display_order: images.length,
          })

          if (error) throw error

          setImages((prev) => [
            ...prev,
            {
              url: data.urls.original,
              thumbnail: data.urls.thumbnail,
              medium: data.urls.medium,
              is_primary: images.length === 0,
            },
          ])
        }

        setSuccessMessage('Images uploaded successfully')
        setShowSuccessModal(true)
      } catch (error) {
        console.error('Error uploading images:', error)
        alert('Failed to upload images')
      } finally {
        setUploading(false)
      }
    } else {
      // If creating new product, just store files for later upload
      setPendingFiles((prev) => [...prev, ...Array.from(files)])
    }
  }

  const uploadPendingImages = async (newProductId: string) => {
    if (pendingFiles.length === 0) return

    for (const file of pendingFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('productId', newProductId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()

      // Save to database
      await (supabase.from('product_images') as any).insert({
        product_id: newProductId,
        image_url: data.urls.original,
        thumbnail_url: data.urls.thumbnail,
        medium_url: data.urls.medium,
        is_primary: pendingFiles.indexOf(file) === 0,
        display_order: pendingFiles.indexOf(file),
      })
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)

    try {
      // Prepare product data - convert empty strings to null
      const productData = {
        ...data,
        brand_id: data.brand_id || null,
        category_id: data.category_id || null,
        sku: data.sku?.trim() || null,
        subcategory: data.subcategory?.trim() || null,
        short_description: data.short_description?.trim() || null,
        long_description: data.long_description?.trim() || null,
      }

      // Insert or update product
      let newProductId = productId

      if (productId) {
        // Update existing product
        const { error } = await (supabase
          .from('products') as any)
          .update(productData)
          .eq('id', productId)

        if (error) throw error
      } else {
        // Create new product
        const { data: newProduct, error } = await (supabase
          .from('products') as any)
          .insert(productData)
          .select()
          .single()

        if (error) throw error
        newProductId = newProduct.id
      }

      // Handle features
      if (productId) {
        await (supabase.from('product_features') as any).delete().eq('product_id', productId)
      }
      if (features.length > 0 && newProductId) {
        await (supabase
          .from('product_features') as any)
          .insert(features.map((f) => ({ product_id: newProductId, feature_name: f })))
      }

      // Handle colors
      if (productId) {
        await (supabase.from('product_colors') as any).delete().eq('product_id', productId)
      }
      if (colors.length > 0 && newProductId) {
        await (supabase
          .from('product_colors') as any)
          .insert(
            colors.map((c) => ({
              product_id: newProductId,
              color_name: c.name,
              hex_code: c.hex || null,
            }))
          )
      }

      // Handle specifications
      if (productId) {
        await (supabase.from('product_specifications') as any).delete().eq('product_id', productId)
      }
      if (specifications.length > 0 && newProductId) {
        await (supabase
          .from('product_specifications') as any)
          .insert(
            specifications.map((s) => ({
              product_id: newProductId,
              spec_key: s.key,
              spec_value: s.value,
            }))
          )
      }

      // Handle rooms
      if (productId) {
        await (supabase.from('product_rooms') as any).delete().eq('product_id', productId)
      }
      if (selectedRooms.length > 0 && newProductId) {
        await (supabase
          .from('product_rooms') as any)
          .insert(selectedRooms.map((roomId) => ({ product_id: newProductId, room_id: roomId })))
      }

      // Upload pending images (only for new products)
      if (!productId && newProductId && pendingFiles.length > 0) {
        await uploadPendingImages(newProductId)
      }

      setSuccessMessage(productId ? 'Product updated successfully' : 'Product created successfully')
      setShowSuccessModal(true)
      setTimeout(() => {
        router.push('/dashboard/products')
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              {...register('name')}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              {...register('category_id')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              {...register('brand_id')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <input
              type="text"
              {...register('subcategory')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
              <button
                type="button"
                onClick={generateSKU}
                className="ml-2 text-xs text-primary-600 hover:text-primary-700 underline"
              >
                Generate
              </button>
            </label>
            <input
              type="text"
              {...register('sku')}
              placeholder="Leave empty or click Generate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Example: Executive Office Chair → EXE-OFF-CHA-4523
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              {...register('short_description')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Description
            </label>
            <textarea
              {...register('long_description')}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input type="checkbox" {...register('is_new')} className="mr-2" />
              <span className="text-sm font-medium text-gray-700">Mark as New</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register('is_featured')} className="mr-2" />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {productId ? 'Upload More Images' : 'Select Images'}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {!productId && pendingFiles.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {pendingFiles.length} image{pendingFiles.length > 1 ? 's' : ''} selected. They will be uploaded when you create the product.
              </p>
            )}
            {uploading && (
              <p className="mt-2 text-sm text-gray-500 flex items-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Uploading...
              </p>
            )}
          </div>

          {/* Show pending files for new products */}
          {!productId && pendingFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Selected Files:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {pendingFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setPendingFiles(pendingFiles.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Show uploaded images for existing products */}
          {productId && images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <Image
                    src={img.thumbnail}
                    alt={`Product image ${idx + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg border border-gray-200"
                  />
                  {img.is_primary && (
                    <span className="absolute top-2 left-2 bg-primary-700 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rooms */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Suitable Rooms</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <label key={room.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRooms.includes(room.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRooms([...selectedRooms, room.id])
                  } else {
                    setSelectedRooms(selectedRooms.filter((id) => id !== room.id))
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{room.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features - Simple list */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
        <div className="space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...features]
                  newFeatures[idx] = e.target.value
                  setFeatures(newFeatures)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Feature description"
              />
              <button
                type="button"
                onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFeatures([...features, ''])}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add Feature
          </button>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Colors</h3>
        <div className="space-y-2">
          {colors.map((color, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={color.name}
                onChange={(e) => {
                  const newColors = [...colors]
                  newColors[idx].name = e.target.value
                  setColors(newColors)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Color name"
              />
              <input
                type="text"
                value={color.hex}
                onChange={(e) => {
                  const newColors = [...colors]
                  newColors[idx].hex = e.target.value
                  setColors(newColors)
                }}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#000000"
              />
              <button
                type="button"
                onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setColors([...colors, { name: '', hex: '' }])}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add Color
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
        <div className="space-y-2">
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => {
                  const newSpecs = [...specifications]
                  newSpecs[idx].key = e.target.value
                  setSpecifications(newSpecs)
                }}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Spec name (e.g., Width)"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => {
                  const newSpecs = [...specifications]
                  newSpecs[idx].value = e.target.value
                  setSpecifications(newSpecs)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Value (e.g., 60cm)"
              />
              <button
                type="button"
                onClick={() => setSpecifications(specifications.filter((_, i) => i !== idx))}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecifications([...specifications, { key: '', value: '' }])}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add Specification
          </button>
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
    </>
  )
}
