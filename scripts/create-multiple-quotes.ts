import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

const testQuotes = [
  {
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@techstartup.io',
    customer_phone: '+1 (555) 234-5678',
    customer_company: 'TechStartup Inc.',
    quantity: 15,
    additional_requirements: 'Looking for ergonomic office chairs for our new office space. Need delivery within 2 weeks.',
    status: 'new' as const,
  },
  {
    customer_name: 'Michael Chen',
    customer_email: 'mchen@designstudio.com',
    customer_phone: '+1 (555) 345-6789',
    customer_company: 'Creative Design Studio',
    quantity: 8,
    additional_requirements: 'Interested in modern design chairs for our creative studio. White or light grey preferred.',
    status: 'contacted' as const,
  },
  {
    customer_name: 'Emily Rodriguez',
    customer_email: 'e.rodriguez@lawfirm.com',
    customer_phone: '+1 (555) 456-7890',
    customer_company: 'Rodriguez & Partners Law Firm',
    quantity: 40,
    additional_requirements: 'Need executive chairs for conference rooms and private offices. Leather preferred, dark colors.',
    status: 'quoted' as const,
  },
  {
    customer_name: 'David Thompson',
    customer_email: 'dthompson@mediacorp.com',
    customer_phone: null,
    customer_company: 'Media Corp International',
    quantity: 100,
    additional_requirements: 'Large order for office renovation. Need various styles - executive, task chairs, and meeting room chairs. Interested in volume discount.',
    status: 'new' as const,
  },
  {
    customer_name: 'Lisa Anderson',
    customer_email: 'lisa@coworking.space',
    customer_phone: '+1 (555) 678-9012',
    customer_company: 'Downtown Coworking Space',
    quantity: 50,
    additional_requirements: 'Looking for durable, comfortable chairs for coworking environment. Multiple color options needed.',
    status: 'closed' as const,
  },
]

async function createMultipleQuotes() {
  console.log('Creating multiple test quote requests...\n')

  // Get all products
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .limit(5)

  if (!products || products.length === 0) {
    console.log('⚠️  No products found. Creating quotes without product references.')
  }

  for (let i = 0; i < testQuotes.length; i++) {
    const quote = testQuotes[i]
    const product = products && products.length > 0 ? products[i % products.length] : null

    const { data, error } = await supabase
      .from('quote_requests')
      .insert({
        ...quote,
        product_id: product?.id || null,
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Error creating quote for ${quote.customer_name}:`, error.message)
    } else {
      console.log(`✅ Created quote for ${quote.customer_name} (${quote.customer_company})`)
      console.log(`   Status: ${quote.status} | Quantity: ${quote.quantity}`)
      if (product) {
        console.log(`   Product: ${product.name}`)
      }
      console.log('')
    }
  }

  console.log('🎉 All test quotes created successfully!')
  console.log('\nYou can now view these quotes in your dashboard at /dashboard/quotes')

  process.exit(0)
}

createMultipleQuotes()
