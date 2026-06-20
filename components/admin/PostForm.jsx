'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import GalleryPicker from './GalleryPicker'

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false, loading: () => (
  <div className="border border-gray-300 rounded-lg h-[450px] flex items-center justify-center text-gray-400 text-sm">جاري تحميل المحرر...</div>
) })

function generateSlug(title) {
  return title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^؀-ۿa-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function PostForm({ post }) {
  const router = useRouter()
  const isEdit = !!post

  const [title, setTitle] = useState(post?.title ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [postDate, setPostDate] = useState(
    post?.post_date ? post.post_date.split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [categoryId, setCategoryId] = useState(post?.category_id ?? '')
  const [categories, setCategories] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState(post?.post_tags?.map(pt => pt.tag_id) ?? [])
  const [tags, setTags] = useState([])
  const [imagePreview, setImagePreview] = useState(post?.image_url ?? null)
  const [galleryImageUrl, setGalleryImageUrl] = useState(post?.image_url ?? null)
  const [showPicker, setShowPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('categories').select('id, name').order('name')
      .then(({ data }) => setCategories(data || []))
    supabase.from('tags').select('id, name').order('name')
      .then(({ data }) => setTags(data || []))
  }, [])

  function toggleTag(id) {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const payload = {
      title,
      slug: generateSlug(title),
      excerpt,
      content,
      post_date: postDate,
      image_url: galleryImageUrl,
      category_id: categoryId || null,
    }

    let postId = post?.id

    if (isEdit) {
      const { error: updateError } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', post.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('posts')
        .insert([payload])
        .select('id')
        .single()

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
      postId = inserted.id
    }

    // Sync post_tags: delete old then insert new
    await supabase.from('post_tags').delete().eq('post_id', postId)
    if (selectedTagIds.length > 0) {
      await supabase.from('post_tags').insert(
        selectedTagIds.map(tag_id => ({ post_id: postId, tag_id }))
      )
    }

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">العنوان <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00524e] text-right"
          placeholder="عنوان المقال"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00524e] text-right bg-white"
        >
          <option value="">— بدون تصنيف —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوسوم
          {selectedTagIds.length > 0 && (
            <span className="mr-2 text-xs text-[#00524e] font-normal">({selectedTagIds.length} محدد)</span>
          )}
        </label>
        {tags.length === 0 ? (
          <p className="text-sm text-gray-400">جاري التحميل...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => {
              const active = selectedTagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    active
                      ? 'bg-[#00524e] text-white border-[#00524e]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#00524e] hover:text-[#00524e]'
                  }`}
                >
                  #{tag.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">المقتطف <span className="text-red-500">*</span></label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          required
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00524e] text-right resize-none"
          placeholder="وصف قصير للمقال يظهر في قائمة المقالات"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">محتوى المقال <span className="text-red-500">*</span></label>
        <RichEditor value={content} onChange={setContent} />
      </div>

      {/* Post Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النشر <span className="text-red-500">*</span></label>
        <input
          type="date"
          value={postDate}
          onChange={e => setPostDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00524e]"
        />
      </div>

      {/* Image — gallery only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">صورة المقال</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <img src={imagePreview} alt="معاينة الصورة" className="max-h-56 w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
            <div className="absolute top-2 left-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="bg-white text-[#00524e] text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-50 transition flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                تغيير
              </button>
              <button
                type="button"
                onClick={() => { setImagePreview(null); setGalleryImageUrl(null) }}
                className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition"
              >
                حذف
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#00524e] hover:bg-[#00524e]/5 transition-all group"
          >
            <svg className="w-10 h-10 mx-auto text-gray-300 group-hover:text-[#00524e] mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-semibold text-[#00524e]">اختر صورة من المعرض</p>
            <p className="text-xs text-gray-400 mt-1">اضغط لفتح معرض الصور</p>
          </button>
        )}
      </div>

      {showPicker && (
        <GalleryPicker
          onSelect={(url) => {
            setGalleryImageUrl(url)
            setImageFile(null)
            setImagePreview(url)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="themeBgColor text-white px-8 py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'نشر المقال'}
        </button>
        <a href="/admin/posts" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
          إلغاء
        </a>
      </div>
    </form>
  )
}
