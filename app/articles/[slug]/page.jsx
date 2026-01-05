import Image from 'next/image'
import { notFound } from 'next/navigation'

// رقم الهاتف (تعدله من مكان واحد فقط)
const PHONE = '96650623'

// دالة توليد عنوان SEO
const getSeoTitle = (article) =>
  article.id >= 66 ? `${article.title} | ${PHONE}` : article.title

// Server Component
export default async function ArticlePage({ params }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)

  try {
    // تحميل المقالات
    const { articles } = await import('../../articles.js')

    // البحث عن المقال
    const article = articles.find((a) => a.slug === decodedSlug)

    if (!article) {
      notFound()
    }

    return (
      <div className='mt-40'>
        {/* العنوان والتاريخ */}
        <div className='md:flex items-start justify-between gap-6 mb-8'>
          {/* H1 بدون رقم الهاتف (أفضل SEO) */}
          <h1 className='text-3xl font-bold text-center md:text-right'>
            {article.title}
          </h1>

          <div className='flex items-center gap-2 justify-center text-gray-500 text-sm'>
            <span>{article.created_at}</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
          </div>
        </div>

        {/* صورة المقال */}
        <div className='w-full md:w-3/4 mx-auto'>
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={600}
            priority
            className='w-full h-auto object-cover rounded-lg'
          />
        </div>

        {/* محتوى المقال */}
        <div
          className='mt-8 px-2 md:px-8 text-lg md:text-xl leading-8'
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading article:', error)
    return <div>Article could not be loaded.</div>
  }
}

// توليد Meta Data (العنصر الأهم لـ Google)
export async function generateMetadata({ params }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)

  try {
    const { articles } = await import('../../articles.js')
    const article = articles.find((a) => a.slug === decodedSlug)

    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The article you are looking for does not exist.',
      }
    }

    const seoTitle = getSeoTitle(article)

    return {
      title: seoTitle,
      description: article.excerpt,
      openGraph: {
        title: seoTitle,
        description: article.excerpt,
        images: [
          {
            url: article.image,
            width: 800,
            height: 600,
            alt: article.title,
          },
        ],
      },
    }
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while loading the article.',
    }
  }
}
