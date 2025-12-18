import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import { Mail } from 'lucide-react'
import QuotesTable from '@/components/quotes/QuotesTable'

export const dynamic = 'force-dynamic'

async function getQuotes() {
  const supabase = createServerClient()

  const { data: quotes, error } = await supabase
    .from('quote_requests')
    .select(`
      *,
      product:products(id, name, sku)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching quotes:', error)
    return []
  }

  return quotes || []
}

export default async function QuotesPage() {
  const quotes = await getQuotes()

  return (
    <>
      <Header
        title="Quote Requests"
        description={`Manage customer quote requests (${quotes.length} requests)`}
      />

      <div className="p-8">
        <QuotesTable quotes={quotes} />
      </div>
    </>
  )
}
