import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import ArticleForm from '@/components/articles/ArticleForm'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const supabase = createServerClient()

  const { data: categories, error } = await (supabase
    .from('article_categories') as any)
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return categories || []
}

export default async function NewArticlePage() {
  const categories = await getCategories()

  return (
    <>
      <Header
        title="New Article"
        description="Create a new blog article"
      />

      <div className="p-8 max-w-5xl">
        <ArticleForm categories={categories} />
      </div>
    </>
  )
}
