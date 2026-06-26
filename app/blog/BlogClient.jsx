'use client'

import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useState } from 'react'
import { ServicesList, SiteInfo } from '../data'

const PER_PAGE = 30

const parseDate = (dateStr) => {
  if (!dateStr) return 0
  if (dateStr.includes('T')) {
    const standard = dateStr.replace(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/,
      '$1-$2-$3T$4:$5:$6.$7Z'
    )
    const ts = Date.parse(standard)
    if (!isNaN(ts)) return ts
    return Date.parse(dateStr) || 0
  }
  const dmy = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (dmy) return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}`).getTime()
  const ymd = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (ymd) return new Date(dateStr).getTime()
  return 0
}

export default function BlogClient({ articles }) {
  const [page, setPage] = useState(1)

  const serviceLinksByTitle = new Map(
    ServicesList.map((service) => [service.title, service.link])
  )

  const sortedArticles = [...articles].sort(
    (a, b) => parseDate(b.created_at) - parseDate(a.created_at)
  )

  const totalPages = Math.ceil(sortedArticles.length / PER_PAGE)
  const pageArticles = sortedArticles.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function goTo(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className='font-sans overflow-x-hidden w-full' dir='rtl'>
      <section className='py-16 bg-gray-50 px-4 md:px-8'>
        <h1 className='text-center text-3xl md:text-4xl font-bold text-[#00524e] mb-16 relative'>
          المدونة
          <span className='block w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full'></span>
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {pageArticles.map((article) => (
            <div
              key={article.id || article.slug}
              className='flex flex-col rounded-lg border border-gray-100 bg-white shadow-md overflow-hidden'
            >
              {/* Card Header */}
              <div className='bg-[#00524e] text-white py-2 px-3 flex justify-between items-center gap-2'>
                <span className='bg-amber-500 text-xs px-2 py-1 rounded text-white whitespace-nowrap'>
                  {SiteInfo.mobileNumber}
                </span>
                <span className='text-sm font-bold text-center flex-1 leading-snug'>
                  {article.title}
                </span>
              </div>

              {/* Image — native img so full image shows at natural ratio */}
              <img
                src={article.image}
                alt={article.title}
                className='w-full'
                style={{ display: 'block' }}
                onError={(e) => { e.currentTarget.src = '/images/001.jpeg' }}
              />

              {/* Content */}
              <div className='flex flex-1 flex-col p-4 text-center'>
                <h3 className='font-bold text-[#00524e] text-base mb-2 leading-snug'>
                  {article.title}
                </h3>
                <div className='text-xs text-gray-400 mb-3' dir='ltr'>
                  {article.created_at ? article.created_at.split('T')[0] : ''}
                </div>
                {article.service ? (
                  <div className='mb-3'>
                    <Link
                      href={serviceLinksByTitle.get(article.service) || '#'}
                      className='inline-flex items-center rounded-full bg-[#00524e]/10 px-3 py-1 text-xs font-semibold text-[#00524e] hover:bg-[#00524e] hover:text-white transition-colors'
                    >
                      {article.service}
                    </Link>
                  </div>
                ) : null}
                <p className='text-gray-500 text-sm leading-relaxed mb-4'>
                  {article.excerpt} {SiteInfo.mobileNumber}
                </p>
                <Link
                  href={`/articles/${encodeURIComponent(article.slug)}`}
                  className='mt-auto inline-block rounded-full border border-[#00524e] px-4 py-1 text-sm font-semibold text-[#00524e] transition-colors hover:bg-[#00524e] hover:text-white'
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
                <div className='w-px h-6 bg-gray-500'></div>
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

        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-2 mt-12 flex-wrap'>
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className='px-4 py-2 rounded-lg border border-[#00524e] text-[#00524e] font-semibold disabled:opacity-30 hover:bg-[#00524e] hover:text-white transition-colors'
            >
              السابق
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`w-10 h-10 rounded-lg border font-semibold transition-colors ${
                  p === page
                    ? 'bg-[#00524e] text-white border-[#00524e]'
                    : 'border-gray-300 text-gray-600 hover:border-[#00524e] hover:text-[#00524e]'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className='px-4 py-2 rounded-lg border border-[#00524e] text-[#00524e] font-semibold disabled:opacity-30 hover:bg-[#00524e] hover:text-white transition-colors'
            >
              التالي
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
