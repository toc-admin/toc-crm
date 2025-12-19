'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Building2 } from 'lucide-react'
import Image from 'next/image'
import SuccessModal from '@/components/ui/SuccessModal'

const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanySectionProps {
  initialData: any
}

export default function CompanySection({ initialData }: CompanySectionProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(
    initialData?.company_logo_url || null
  )
  const [uploading, setUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: initialData?.company_name || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
    },
  })

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-company-logo', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()

      // Update company settings if record exists
      if (initialData?.id) {
        const { error } = await (supabase
          .from('company_settings') as any)
          .update({ company_logo_url: data.url })
          .eq('id', initialData.id)

        if (error) throw error
      }

      setLogoUrl(data.url)
      setSuccessMessage('Logo uploaded successfully')
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

  const removeLogo = async () => {
    try {
      if (initialData?.id) {
        const { error } = await (supabase
          .from('company_settings') as any)
          .update({ company_logo_url: null })
          .eq('id', initialData.id)

        if (error) throw error
      }

      setLogoUrl(null)
      setSuccessMessage('Logo removed successfully')
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error removing logo:', error)
      alert('Failed to remove logo')
    }
  }

  const onSubmit = async (data: CompanyFormData) => {
    setLoading(true)

    try {
      const payload = {
        company_name: data.companyName || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        updated_at: new Date().toISOString(),
      }

      if (initialData?.id) {
        // Update existing company settings
        const { error } = await (supabase
          .from('company_settings') as any)
          .update(payload)
          .eq('id', initialData.id)

        if (error) throw error
      } else {
        // Insert new company settings
        const { error } = await (supabase
          .from('company_settings') as any)
          .insert({
            ...payload,
            company_logo_url: logoUrl,
          })

        if (error) throw error
      }

      setSuccessMessage('Company information updated successfully')
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error updating company settings:', error)
      alert(error.message || 'Failed to update company information')
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
        {/* Company Logo */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Building2 className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Company Logo
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Upload your company logo for quotes and invoices
              </p>
            </div>
          </div>

          {logoUrl ? (
            <div className="relative inline-block">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-white p-4 flex items-center justify-center border-4 border-slate-100 shadow-lg">
                <Image
                  src={logoUrl}
                  alt="Company Logo"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div>
              <label
                htmlFor="logo"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <Loader2 className="h-12 w-12 text-slate-400 mb-4 animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12 text-slate-400 mb-4" />
                  )}
                  <p className="mb-2 text-sm text-slate-600">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, SVG (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="logo"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          {uploading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading logo...
            </div>
          )}
        </div>

        {/* Company Information */}
        <div className="card p-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
            Company Information
          </h2>

          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                {...register('companyName')}
                className="input-field"
                placeholder="e.g., The Office Company"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Address
              </label>
              <textarea
                id="address"
                {...register('address')}
                rows={3}
                className="input-field resize-none"
                placeholder="Street address, city, state, ZIP"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="input-field"
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="input-field"
                placeholder="e.g., contact@theofficecompany.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Company Information'
            )}
          </button>
        </div>
      </form>
    </>
  )
}
