import { createClient } from '../../lib/supabase/server'
import { articles as staticArticles } from '../articles.js'
import AdminShell from '../../components/admin/AdminShell'
import { redirect } from 'next/navigation'
import DeletePostButton from '../../components/admin/DeletePostButton'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: dbPosts } = await supabase
    .from('posts')
    .select('id, title, slug, image_url, post_date, created_at')
    .order('created_at', { ascending: false })

  // Map Supabase posts
  const dbRows = (dbPosts || []).map((p) => ({
    key: p.id,
    title: p.title,
    slug: p.slug || p.id,
    image: p.image_url || null,
    date: p.post_date || p.created_at,
    source: 'db',
    editHref: `/admin/posts/${p.id}/edit`,
    deleteId: p.id,
  }))

  // Map static articles
  const staticRows = staticArticles.map((a) => ({
    key: `static-${a.slug}`,
    title: a.title,
    slug: a.slug,
    image: a.image || null,
    date: a.created_at,
    source: 'static',
    editHref: null,
    deleteId: null,
  }))

  const allPosts = [...dbRows, ...staticRows]
  const totalCount = allPosts.length

  return (
    <AdminShell userEmail={user.email}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">مرحباً بك!</h2>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">إجمالي المقالات</p>
          <p className="text-4xl font-bold text-[#00524e]">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">المقالات الجديدة</p>
          <p className="text-4xl font-bold text-[#00524e]">{dbRows.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500 mb-1">المقالات الثابتة</p>
          <p className="text-4xl font-bold text-[#00524e]">{staticRows.length}</p>
        </div>
      </div>

      {/* All posts table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">جميع المقالات</h3>
          <a href="/admin/posts/new" className="text-sm text-[#00524e] hover:underline font-medium whitespace-nowrap">
            + إضافة مقال
          </a>
        </div>

        {allPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">الصورة</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">العنوان</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium hidden md:table-cell">التاريخ</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">المصدر</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allPosts.map((post) => (
                  <tr key={post.key} className="hover:bg-gray-50 transition">
                    {/* Image */}
                    <td className="px-5 py-3">
                      <a
                        href={`/articles/${encodeURIComponent(post.slug)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-12 h-12 rounded-lg overflow-hidden border border-gray-100 hover:opacity-80 transition-opacity flex-shrink-0"
                      >
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </a>
                    </td>

                    {/* Title */}
                    <td className="px-5 py-3 max-w-[200px]">
                      <a
                        href={`/articles/${encodeURIComponent(post.slug)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 font-medium line-clamp-1 hover:text-[#00524e] hover:underline transition-colors"
                      >
                        {post.title}
                      </a>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap hidden md:table-cell">
                      {post.date ? new Date(post.date).toLocaleDateString('ar-KW') : '—'}
                    </td>

                    {/* Source badge */}
                    <td className="px-5 py-3">
                      {post.source === 'db' ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          جديد
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          ثابت
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      {post.source === 'db' ? (
                        <div className="flex items-center gap-3">
                          <a href={post.editHref} className="text-[#00524e] hover:underline font-medium">
                            تعديل
                          </a>
                          <DeletePostButton postId={post.deleteId} />
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-gray-400">
            <p className="mb-3">لا توجد مقالات بعد</p>
            <a href="/admin/posts/new" className="text-[#00524e] font-medium hover:underline">
              أضف مقالك الأول
            </a>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
