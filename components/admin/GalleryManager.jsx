'use client'

import { useState, useRef } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function GalleryManager({ initialImages }) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  async function handleUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    setSuccess('')

    const supabase = createClient()
    const uploaded = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(name, file)

      if (uploadError) {
        setError('فشل رفع: ' + file.name)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(name)

      uploaded.push({ name, url: publicUrl, size: file.size })
    }

    setImages((prev) => [...uploaded, ...prev])
    setSuccess(`تم رفع ${uploaded.length} صورة بنجاح`)
    setUploading(false)
    inputRef.current.value = ''
  }

  async function handleDelete(image) {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return
    setDeleting(image.name)
    const supabase = createClient()
    await supabase.storage.from('gallery').remove([image.name])
    setImages((prev) => prev.filter((i) => i.name !== image.name))
    setDeleting(null)
  }

  function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div>
      {/* Upload area */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#00524e] transition-colors cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 font-medium mb-1">اضغط لرفع صور أو اسحب وأفلت</p>
          <p className="text-gray-400 text-sm">PNG, JPG, WEBP — حتى 10MB لكل صورة — يمكن رفع أكثر من صورة</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-[#00524e] text-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            جاري الرفع...
          </div>
        )}
        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        {success && <p className="mt-3 text-green-600 text-sm">{success}</p>}
      </div>

      {/* Stats */}
      <p className="text-gray-500 text-sm mb-4">{images.length} صورة في المعرض</p>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          لا توجد صور في المعرض بعد
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {images.map((image) => (
            <div key={image.name} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Image */}
              <div
                className="relative aspect-square cursor-pointer"
                onClick={() => setPreview(image)}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Footer */}
              <div className="p-2 flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate">{formatSize(image.size)}</span>
                <button
                  onClick={() => handleDelete(image)}
                  disabled={deleting === image.name}
                  className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                  title="حذف"
                >
                  {deleting === image.name ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 left-0 text-white hover:text-gray-300 transition"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={preview.url} alt={preview.name} className="w-full rounded-xl max-h-[80vh] object-contain" />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-white/70 text-sm truncate">{preview.name}</p>
              <button
                onClick={() => { navigator.clipboard.writeText(preview.url); setSuccess('تم نسخ الرابط!') }}
                className="text-white/70 hover:text-white text-sm flex items-center gap-1.5 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                نسخ الرابط
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
