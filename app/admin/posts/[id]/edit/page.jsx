import { createClient } from '../../../../../lib/supabase/server'
import AdminShell from '../../../../../components/admin/AdminShell'
import PostForm from '../../../../../components/admin/PostForm'
import { redirect, notFound } from 'next/navigation'

export default async function EditPostPage({ params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { id } = await params
  const { data: post } = await supabase
    .from('posts')
    .select('*, post_tags(tag_id)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/admin/posts" className="hover:text-[#00524e]">المقالات</a>
          <span>/</span>
          <span className="text-gray-800">تعديل المقال</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">تعديل المقال</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-8 max-w-3xl">
        <PostForm post={post} />
      </div>
    </AdminShell>
  )
}
