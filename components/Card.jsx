'use client'
import Image from 'next/image'
import Link from 'next/link'

function Card({ item, imageStyle, isService = false }) {
  return (
    <div className='flex flex-col bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 h-full border border-gray-100'>
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
      <div className='relative h-[500px] w-full overflow-hidden bg-gray-50'>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className='object-cover group-hover:scale-110 transition-transform duration-700'
        />
        {/* Overlay on hover */}
        <div className='absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300' />
      </div>

      {/* Content Body */}
      <div className='p-6 flex flex-col items-center text-center flex-1'>
        {/* Title */}
        <h3 className='text-xl font-bold text-[#00524e] mb-3 group-hover:text-[#b8860b] transition-colors'>
          {item.title}
        </h3>

        {/* Meta Data */}
        {(item.date || item.commentsCount !== undefined) && (
          <div className='text-gray-400 text-xs mb-4 flex items-center gap-3 font-medium'>
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
        <p className='text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed'>
          {item.description}
        </p>

        {/* Details Button */}
        <div className='mt-auto'>
          <Link
            href={item.link}
            className='inline-block border border-[#00524e] text-[#00524e] px-8 py-2 rounded-full hover:bg-[#00524e] hover:text-white transition-all duration-300 font-bold text-sm'
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Card
