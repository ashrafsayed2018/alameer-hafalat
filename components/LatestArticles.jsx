import Image from 'next/image'
import { articles } from '../app/articles.js'

function LatestArticles() {
  return (
    <div className='mt-28 px-4 md:px-6 lg:px-8 xl:px-10'>
      <h2 className='text-3xl font-bold text-blue-800 mb-8 text-center'>
        احدث المقالات
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {articles.map((article) => (
          <div
            key={article.id}
            className='bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300'
          >
            <Image
              src={article.image}
              alt={article.title}
              width={500}
              height={500}
              className='w-full h-48 object-cover'
            />
            <div className='p-4'>
              <h3 className='text-base md:text-xl md:leading-6 font-semibold text-gray-800 mb-2'>
                {article.title}
              </h3>
              <p className='text-gray-600 text-sm line-clamp-3'>
                {article.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
              </p>
              <a
                href={`/articles/${article.slug}`}
                className='w-full inline-flex items-center justify-around mt-4 bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded font-medium hover:animate-bounce transition-all duration-500'
              >
                <span> اقرأ المزيد </span>
                <span>&larr;</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestArticles
