'use client'
import Image from 'next/image'
import Link from 'next/link'

function Card({ item, imageStyle, isService = false }) {
  return (
    <div className='group flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      {/* <div className='relative overflow-hidden bg-gray-50'>
        <Image
          src={item.image}
          alt={item.title}
          width={500}
          height={500}
          className={`${imageStyle} transition-transform duration-500 group-hover:scale-105`}
        />
      </div> */}

      {/* Image */}
      <div className={`relative w-full overflow-hidden bg-gray-50 ${isService ? 'h-[340px]' : 'h-[280px]'}`}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-105'
        />
        <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent' />
      </div>

      {/* Content Body */}
      <div className='flex flex-1 flex-col p-6 text-right'>
        {/* Title */}
        <h3 className='mb-3 line-clamp-2 text-xl font-bold leading-8 text-[#00524e] transition-colors group-hover:text-[#b8860b]'>
          {item.title}
        </h3>

        {/* Meta Data */}
        {(item.date || item.commentsCount !== undefined) && (
          <div className='mb-4 flex items-center gap-3 text-xs font-medium text-gray-400'>
            {item.date && <span>{item.date}</span>}
            {item.commentsCount !== undefined && (
              <>
                <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                <span>{item.commentsCount} Comments</span>
              </>
            )}
          </div>
        )}

        {/* Description */}
        <p className={`mb-6 text-sm leading-7 text-gray-500 ${isService ? 'line-clamp-3' : 'line-clamp-4'}`}>
          {item.description}
        </p>
        <div className='mt-auto'>
          <Link
            href={item.link}
            className='inline-flex items-center justify-center rounded-full border border-[#00524e] px-6 py-2.5 text-sm font-bold text-[#00524e] transition-all duration-300 hover:bg-[#00524e] hover:text-white'
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Card
