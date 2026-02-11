import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles } from '../../articles'
import { SiteInfo } from '../../data'
import { tags } from '../../tags'

export async function generateMetadata({ params }) {
  const { tag: tagSlug } = params
  const decodedSlug = decodeURIComponent(tagSlug)
  const tag = tags.find((t) => t.slug === decodedSlug)

  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: `${tag.title} | ${SiteInfo.title}`,
    description: `تصفح جميع المقالات المتعلقة بـ ${tag.title}. ${SiteInfo.description}`,
  }
}

export default function TagPage({ params }) {
  const { tag: tagSlug } = params
  const decodedSlug = decodeURIComponent(tagSlug)
  const tag = tags.find((t) => t.slug === decodedSlug)

  if (!tag) {
    notFound()
  }

  // Filter articles based on keywords
  const tagArticles = articles.filter((article) => {
    const content = (article.title + ' ' + article.excerpt + ' ' + article.content).toLowerCase()
    return tag.keywords.some((keyword) => content.includes(keyword.toLowerCase()))
  })

  // Sort by date (newest first)
  const parseDate = (dateStr) => {
    if (!dateStr) return 0
    if (dateStr.includes('T')) {
       const standard = dateStr.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, '$1-$2-$3T$4:$5:$6.$7Z')
       const ts = Date.parse(standard)
       if (!isNaN(ts)) return ts
       return Date.parse(dateStr) || 0
    }
    const dmy = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/)
    if (dmy) {
      return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}`).getTime()
    }
    const ymd = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (ymd) {
      return new Date(dateStr).getTime()
    }
    return 0
  }

  const sortedArticles = tagArticles.sort((a, b) => {
    return parseDate(b.created_at) - parseDate(a.created_at)
  })

  return (
    <main className='font-sans' dir='rtl'>
      <section className='py-16 bg-gray-50 px-4 md:px-12'>
        <h1 className='text-center text-3xl md:text-4xl font-bold text-[#00524e] mb-16 relative'>
          {tag.title}
          <span className='block w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full'></span>
        </h1>

        {sortedArticles.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-10">
            لا توجد مقالات مرتبطة بهذا الهاشتاج حالياً.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {sortedArticles.map((article) => (
              <div
                key={article.id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100'
              >
                {/* Card Header */}
                <div className='bg-[#00524e] text-white font-bold text-center py-2 px-2 text-sm md:text-base flex justify-between items-center dir-ltr'>
                  <span className='bg-amber-500 text-xs px-2 py-1 rounded text-white'>
                    {SiteInfo.mobileNumber}
                  </span>
                  <span className='flex-1 text-center truncate px-1'>
                    {article.title}
                  </span>
                </div>

                {/* Image */}
                <div className='relative h-[450px] w-full overflow-hidden bg-gray-50'>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-700'
                  />
                  {/* Overlay on hover */}
                  <div className='absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300' />
                </div>

                {/* Content */}
                <div className='p-5 text-center'>
                  <h3 className='font-bold text-[#00524e] text-lg mb-2 line-clamp-1'>
                    {article.title}
                  </h3>
                  <div
                    className='flex justify-center items-center gap-2 text-xs text-gray-400 mb-3'
                    dir='ltr'
                  >
                    <span>
                      {article.created_at
                        ? article.created_at.split('T')[0]
                        : ''}
                    </span>
                  </div>
                  <p className='text-gray-500 text-sm leading-relaxed mb-4 line-clamp-5 min-h-[4.5rem]'>
                    {article.excerpt} {SiteInfo.mobileNumber}
                  </p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className='inline-block text-[#00524e] border border-[#00524e] px-4 py-1 rounded-full text-sm font-semibold hover:bg-[#00524e] hover:text-white transition-colors'
                  >
                    التفاصيل
                  </Link>
                </div>

                {/* Card Footer */}
                <div className='bg-[#00524e] py-3 flex justify-center items-center gap-8 text-white'>
                  <a
                    href={`tel:${SiteInfo.mobileNumber}`}
                    className='flex items-center gap-2 hover:text-amber-400 transition-colors'
                  >
                    <FontAwesomeIcon icon={faPhone} className='h-5 w-5' />
                    <span className='text-sm font-bold'>اتصال</span>
                  </a>
                  <div className='w-[1px] h-6 bg-gray-500'></div>
                  <a
                    href={`https://wa.me/${SiteInfo.whatsappNumber}`}
                    className='flex items-center gap-2 hover:text-green-400 transition-colors'
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className='h-5 w-5' />
                    <span className='text-sm font-bold'>واتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}