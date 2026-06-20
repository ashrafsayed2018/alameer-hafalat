'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'

function generateSlug(name) {
  return name.trim().replace(/\s+/g, '-').replace(/[^؀-ۿa-zA-Z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export default function TagsManager({ initialTags }) {
  const [tags, setTags] = useState(initialTags)
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('tags')
      .insert([{ name: name.trim(), slug: generateSlug(name) }])
      .select()
      .single()

    if (err) { setError(err.message); setLoading(false); return }
    setTags(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name, 'ar')))
    setName('')
    setLoading(false)
  }

  async function handleEditSave(id) {
    if (!editName.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('tags')
      .update({ name: editName.trim(), slug: generateSlug(editName) })
      .eq('id', id)
      .select()
      .single()

    if (err) { setError(err.message); setLoading(false); return }
    setTags(prev => prev.map(t => t.id === id ? data : t).sort((a, b) => a.name.localeCompare(b.name, 'ar')))
    setEditId(null)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الوسم؟')) return
    setDeleting(id)
    await createClient().from('tags').delete().eq('id', id)
    setTags(prev => prev.filter(t => t.id !== id))
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">إضافة وسم جديد</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="اسم الوسم"
            required
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-[#00524e]"
          />
          <button
            type="submit"
            disabled={loading}
            className="themeBgColor text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? '...' : 'إضافة'}
          </button>
        </form>
        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-medium text-gray-500 mb-3">معاينة الوسوم ({tags.length})</p>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag.id} className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#00524e]/10 text-[#00524e] border border-[#00524e]/20">
              #{tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {tags.length === 0 ? (
          <div className="px-5 py-14 text-center text-gray-400">لا توجد وسوم بعد</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-5 py-3 text-gray-500 font-medium">الاسم</th>
                <th className="text-right px-5 py-3 text-gray-500 font-medium hidden sm:table-cell">الـ Slug</th>
                <th className="text-right px-5 py-3 text-gray-500 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tags.map(tag => (
                <tr key={tag.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    {editId === tag.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="border border-[#00524e] rounded-lg px-3 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-[#00524e] w-full max-w-xs"
                        autoFocus
                      />
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#00524e]/10 px-3 py-1 text-xs font-semibold text-[#00524e]">
                        #{tag.name}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs hidden sm:table-cell" dir="ltr">{tag.slug}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {editId === tag.id ? (
                        <>
                          <button onClick={() => handleEditSave(tag.id)} disabled={loading} className="text-[#00524e] hover:underline font-medium disabled:opacity-50">حفظ</button>
                          <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600">إلغاء</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditId(tag.id); setEditName(tag.name) }} className="text-[#00524e] hover:underline font-medium">تعديل</button>
                          <button onClick={() => handleDelete(tag.id)} disabled={deleting === tag.id} className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                            {deleting === tag.id ? '...' : 'حذف'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
