'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import GalleryPicker from './GalleryPicker'

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
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(post?.image_url ?? null)
  const [galleryImageUrl, setGalleryImageUrl] = useState(null)
  const [showPicker, setShowPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    let imageUrl = galleryImageUrl ?? post?.image_url ?? null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`

      // Remove old image if editing
      if (isEdit && post?.image_url) {
        const oldPath = post.image_url.split('/storage/v1/object/public/post-images/')[1]
        if (oldPath) await supabase.storage.from('post-images').remove([oldPath])
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile, { upsert: false })

      if (uploadError) {
        setError('فشل رفع الصورة: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(uploadData.path)

      imageUrl = publicUrl
    }

    const payload = {
      title,
      slug: generateSlug(title),
      excerpt,
      content,
      post_date: postDate,
      image_url: imageUrl,
    }

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
      const { error: insertError } = await supabase
        .from('posts')
        .insert([payload])

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
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
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={12}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00524e] text-right resize-y font-mono text-sm"
          placeholder="اكتب محتوى المقال هنا... يمكنك استخدام HTML"
        />
        <p className="text-xs text-gray-400 mt-1">يمكنك استخدام HTML لتنسيق المحتوى</p>
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

      {/* Image Upload */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">صورة المقال</label>
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 text-sm text-[#00524e] font-medium hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            اختر من المعرض
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#00524e] transition-colors">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="max-h-48 mx-auto rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); setGalleryImageUrl(null) }}
                className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="py-4">
              <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">انقر لرفع صورة جديدة أو اختر من المعرض</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP حتى 5MB</p>
            </div>
          )}
          {!imagePreview && (
            <label className="cursor-pointer mt-2 inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              <span className="text-[#00524e] text-sm font-medium hover:underline">رفع صورة</span>
            </label>
          )}
        </div>
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
