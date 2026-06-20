import { createClient } from '../../../lib/supabase/server'
import AdminShell from '../../../components/admin/AdminShell'
import { redirect } from 'next/navigation'
import TagsManager from '../../../components/admin/TagsManager'

export default async function TagsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: tags } = await supabase
    .from('tags')
    .select('id, name, slug, created_at')
    .order('name')

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">الوسوم</h2>
        <p className="text-gray-500 text-sm mt-0.5">إضافة وإدارة وسوم المقالات</p>
      </div>
      <TagsManager initialTags={tags || []} />
    </AdminShell>
  )
}
