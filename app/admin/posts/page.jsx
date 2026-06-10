import { createClient } from '../../../lib/supabase/server'
import AdminShell from '../../../components/admin/AdminShell'
import { redirect } from 'next/navigation'
import DeletePostButton from '../../../components/admin/DeletePostButton'

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, image_url, excerpt, post_date, created_at')
    .order('created_at', { ascending: false })

  return (
    <AdminShell userEmail={user.email}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">المقالات</h2>
          <p className="text-gray-500 text-sm mt-0.5">إدارة جميع المقالات</p>
        </div>
        <a
          href="/admin/posts/new"
          className="themeBgColor text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">مقال جديد</span>
          <span className="sm:hidden">جديد</span>
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {posts && posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">الصورة</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">العنوان</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium hidden md:table-cell">المقتطف</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">التاريخ</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <a
                        href={`/articles/${encodeURIComponent(post.slug || post.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-14 h-14 rounded-lg overflow-hidden border border-gray-100 hover:opacity-80 transition-opacity"
                      >
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-gray-800 font-medium max-w-[180px]">
                      {post.slug ? (
                        <a
                          href={`/articles/${encodeURIComponent(post.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-1 hover:text-[#00524e] hover:underline transition-colors"
                        >
                          {post.title}
                        </a>
                      ) : (
                        <span className="line-clamp-1">{post.title}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell max-w-[220px]">
                      <span className="line-clamp-1">{post.excerpt}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {post.post_date
                        ? new Date(post.post_date).toLocaleDateString('ar-KW')
                        : new Date(post.created_at).toLocaleDateString('ar-KW')}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <a
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-[#00524e] hover:underline font-medium"
                        >
                          تعديل
                        </a>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-16 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mb-3 text-base">لا توجد مقالات بعد</p>
            <a href="/admin/posts/new" className="text-[#00524e] font-medium hover:underline">
              أضف مقالك الأول
            </a>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
