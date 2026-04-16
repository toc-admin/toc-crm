import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import ArticleForm from '@/components/articles/ArticleForm'

export const dynamic = 'force-dynamic'

async function getArticle(id: string) {
  const supabase = createServerClient()

  const { data: article, error } = await (supabase
    .from('articles') as any)
    .select(`
      *,
      category:article_categories(*),
      tags:article_tags(tag:tags(*))
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !article) {
    return null
  }

  // Transform the nested tags structure
  return {
    ...article,
    tags: article.tags?.map((at: any) => at.tag).filter(Boolean) || [],
  }
}

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

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const resolvedParams = await params
  const [article, categories] = await Promise.all([
    getArticle(resolvedParams.id),
    getCategories(),
  ])

  if (!article) {
    notFound()
  }

  return (
    <>
      <Header
        title="Edit Article"
        description={`Editing: ${article.title}`}
      />

      <div className="p-8 max-w-5xl">
        <ArticleForm
          categories={categories}
          initialData={article}
          articleId={resolvedParams.id}
        />
      </div>
    </>
  )
}
