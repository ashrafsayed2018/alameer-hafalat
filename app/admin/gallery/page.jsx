import { createClient } from '../../../lib/supabase/server'
import AdminShell from '../../../components/admin/AdminShell'
import { redirect } from 'next/navigation'
import GalleryManager from '../../../components/admin/GalleryManager'

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: files } = await supabase.storage
    .from('gallery')
    .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })

  const images = (files || [])
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => {
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(f.name)
      return { name: f.name, url: publicUrl, size: f.metadata?.size || 0 }
    })

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">معرض الصور</h2>
        <p className="text-gray-500 text-sm mt-1">رفع وإدارة صور المعرض</p>
      </div>
      <GalleryManager initialImages={images} />
    </AdminShell>
  )
}
