import { articles as staticArticles } from '../articles'
import { createClient } from '../../lib/supabase/server'
import BlogClient from './BlogClient'

export const revalidate = 60

export default async function BlogPage() {
  // Fetch Supabase posts
  let dbPosts = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, image_url, post_date, created_at')
      .order('created_at', { ascending: false })
    dbPosts = data || []
  } catch {}

  // Map DB posts to same shape as static articles
  const dbArticles = dbPosts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug || p.id,
    excerpt: p.excerpt || '',
    image: p.image_url || '/images/001.jpeg',
    created_at: p.post_date || p.created_at,
    service: null,
  }))

  // Merge: DB posts first, then static
  const allArticles = [...dbArticles, ...staticArticles].filter(
    (a) => a && a.title
  )

  return <BlogClient articles={allArticles} />
}
