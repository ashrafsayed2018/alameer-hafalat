'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function DeletePostButton({ postId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    setLoading(true)
    const supabase = createClient()

    // Delete image from storage if exists
    const { data: post } = await supabase
      .from('posts')
      .select('image_url')
      .eq('id', postId)
      .single()

    if (post?.image_url) {
      const path = post.image_url.split('/storage/v1/object/public/post-images/')[1]
      if (path) await supabase.storage.from('post-images').remove([path])
    }

    await supabase.from('posts').delete().eq('id', postId)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:underline font-medium disabled:opacity-50"
    >
      {loading ? '...' : 'حذف'}
    </button>
  )
}
