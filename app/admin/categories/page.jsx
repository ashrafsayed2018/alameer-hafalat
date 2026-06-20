import { createClient } from '../../../lib/supabase/server'
import AdminShell from '../../../components/admin/AdminShell'
import { redirect } from 'next/navigation'
import CategoriesManager from '../../../components/admin/CategoriesManager'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, created_at')
    .order('name')

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">التصنيفات</h2>
        <p className="text-gray-500 text-sm mt-0.5">إضافة وإدارة تصنيفات المقالات</p>
      </div>
      <CategoriesManager initialCategories={categories || []} />
    </AdminShell>
  )
}
