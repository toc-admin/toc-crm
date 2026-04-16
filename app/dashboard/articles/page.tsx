import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ArticlesGrid from '@/components/articles/ArticlesGrid'

export const dynamic = 'force-dynamic'

async function getArticles() {
  const supabase = createServerClient()

  const { data: articles, error } = await (supabase
    .from('articles') as any)
    .select(`
      *,
      category:article_categories(*),
      tags:article_tags(tag:tags(*))
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  // Transform the nested tags structure
  return (articles || []).map((article: any) => ({
    ...article,
    tags: article.tags?.map((at: any) => at.tag).filter(Boolean) || [],
  }))
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <>
      <Header
        title="Articles"
        description={`Manage blog articles (${articles.length} articles)`}
        action={
          <Link href="/dashboard/articles/new" className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Link>
        }
      />

      <div className="p-8">
        <ArticlesGrid articles={articles} />
      </div>
    </>
  )
}
