import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import { ArrowLeft, Mail, Phone, Building2, Package, Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import QuoteStatusForm from '@/components/quotes/QuoteStatusForm'
import DeleteQuoteButton from '@/components/quotes/DeleteQuoteButton'

export const dynamic = 'force-dynamic'

async function getQuote(id: string) {
  const supabase = createServerClient()

  const { data: quote, error } = await supabase
    .from('quote_requests')
    .select(`
      *,
      product:products(
        id,
        name,
        slug,
        sku,
        short_description,
        brand:brands(name),
        category:categories(name)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !quote) {
    return null
  }

  return quote
}

export default async function QuoteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const quote = await getQuote(params.id)

  if (!quote) {
    notFound()
  }

  return (
    <>
      <Header
        title={`Quote Request from ${quote.customer_name}`}
        description={`ID: ${quote.id.substring(0, 8)}...`}
        action={
          <Link href="/dashboard/quotes" className="btn-secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="card p-6">
              <h2 className="text-lg font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <p className="text-slate-900 font-medium">{quote.customer_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <a
                    href={`mailto:${quote.customer_email}`}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    {quote.customer_email}
                  </a>
                </div>

                {quote.customer_phone && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <a
                      href={`tel:${quote.customer_phone}`}
                      className="text-slate-900 font-medium flex items-center gap-2 hover:text-primary-600"
                    >
                      <Phone className="h-4 w-4" />
                      {quote.customer_phone}
                    </a>
                  </div>
                )}

                {quote.customer_company && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company
                    </label>
                    <p className="text-slate-900 font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {quote.customer_company}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            {quote.product && (
              <div className="card p-6">
                <h2 className="text-lg font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary-600" />
                  Requested Product
                </h2>
                <Link
                  href={`/dashboard/products/${quote.product.id}`}
                  className="group block p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-display font-semibold text-slate-900 group-hover:text-primary-600 transition-colors duration-200">
                        {quote.product.name}
                      </h3>
                      {quote.product.short_description && (
                        <p className="mt-1 text-sm text-slate-600">
                          {quote.product.short_description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {quote.product.category && (
                        <span>{quote.product.category.name}</span>
                      )}
                      {quote.product.brand && (
                        <>
                          <span>•</span>
                          <span>{quote.product.brand.name}</span>
                        </>
                      )}
                      {quote.product.sku && (
                        <>
                          <span>•</span>
                          <span className="font-mono">SKU: {quote.product.sku}</span>
                        </>
                      )}
                    </div>

                    {quote.quantity && (
                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-sm text-slate-700">
                          Requested Quantity: <span className="font-semibold text-slate-900">{quote.quantity}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            )}

            {/* Additional Requirements */}
            {quote.additional_requirements && (
              <div className="card p-6">
                <h2 className="text-lg font-display font-semibold text-slate-900 mb-4">
                  Additional Requirements
                </h2>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {quote.additional_requirements}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="card p-6">
              <h2 className="text-lg font-display font-semibold text-slate-900 mb-4">
                Status Management
              </h2>
              <QuoteStatusForm quoteId={quote.id} currentStatus={quote.status} />
            </div>

            {/* Metadata */}
            <div className="card p-6">
              <h2 className="text-lg font-display font-semibold text-slate-900 mb-4">
                Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-500">Created</p>
                    <p className="text-slate-900 font-medium">
                      {formatDate(quote.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-500">Last Updated</p>
                    <p className="text-slate-900 font-medium">
                      {formatDate(quote.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card p-6 border-red-200">
              <h2 className="text-lg font-display font-semibold text-red-900 mb-4">
                Danger Zone
              </h2>
              <DeleteQuoteButton quoteId={quote.id} customerName={quote.customer_name} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
