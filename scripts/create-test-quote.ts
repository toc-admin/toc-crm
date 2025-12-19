import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function createTestQuote() {
  console.log('Creating test quote request...')

  // First, get a product (any product)
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .limit(1)
    .single()

  // Create a test quote request
  const { data: quote, error } = await supabase
    .from('quote_requests')
    .insert({
      product_id: products?.id || null,
      customer_name: 'John Smith',
      customer_email: 'john.smith@example.com',
      customer_phone: '+1 (555) 123-4567',
      customer_company: 'Acme Corporation',
      quantity: 25,
      additional_requirements: 'Need delivery by end of month. Would like to see color options in black and grey. Also interested in bulk discount pricing.',
      status: 'new',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating quote:', error)
    process.exit(1)
  }

  console.log('✅ Test quote created successfully!')
  console.log('Quote ID:', quote.id)
  console.log('Customer:', quote.customer_name)
  console.log('Product ID:', quote.product_id)
  console.log('Status:', quote.status)
  console.log('\nYou can now view this quote in your dashboard at /dashboard/quotes')

  process.exit(0)
}

createTestQuote()
