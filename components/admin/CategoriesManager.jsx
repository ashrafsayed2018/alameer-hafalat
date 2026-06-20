'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'

function generateSlug(name) {
  return name.trim().replace(/\s+/g, '-').replace(/[^؀-ۿa-zA-Z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export default function CategoriesManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories)
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
    const slug = generateSlug(name)
    const { data, error: err } = await supabase
      .from('categories')
      .insert([{ name: name.trim(), slug }])
      .select()
      .single()

    if (err) { setError(err.message); setLoading(false); return }
    setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name, 'ar')))
    setName('')
    setLoading(false)
  }

  async function handleEdit(cat) {
    setEditId(cat.id)
    setEditName(cat.name)
  }

  async function handleEditSave(id) {
    if (!editName.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const slug = generateSlug(editName)
    const { data, error: err } = await supabase
      .from('categories')
      .update({ name: editName.trim(), slug })
      .eq('id', id)
      .select()
      .single()

    if (err) { setError(err.message); setLoading(false); return }
    setCategories((prev) => prev.map((c) => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name, 'ar')))
    setEditId(null)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟ ستفقد ارتباطه بالمقالات.')) return
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">إضافة تصنيف جديد</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم التصنيف"
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

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-5 py-14 text-center text-gray-400">لا توجد تصنيفات بعد</div>
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
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    {editId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-[#00524e] rounded-lg px-3 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-[#00524e] w-full max-w-xs"
                        autoFocus
                      />
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#00524e]/10 px-3 py-1 text-xs font-semibold text-[#00524e]">
                        {cat.name}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs hidden sm:table-cell" dir="ltr">{cat.slug}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {editId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleEditSave(cat.id)}
                            disabled={loading}
                            className="text-[#00524e] hover:underline font-medium disabled:opacity-50"
                          >
                            حفظ
                          </button>
                          <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600">
                            إلغاء
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(cat)} className="text-[#00524e] hover:underline font-medium">
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={deleting === cat.id}
                            className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                          >
                            {deleting === cat.id ? '...' : 'حذف'}
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
