// app/articles/[slug]/page.jsx
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Server Component to fetch and display the article
export default async function ArticlePage({ params }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  console.log('Decoded slug:', decodedSlug)

  try {
    // Dynamically import the articles.js file to get the articles
    const { articles } = await import('../../articles.js')

    // Find the article with the matching slug
    const article = articles.find((a) => a.slug === decodedSlug)

    if (!article) {
      console.log('Article not found')
      notFound() // Use Next.js notFound helper for 404
    }

    return (
      <div className='mt-40'>
        <div className='md:flex items-start justify-around gap-6'>
          <h1 className='text-3xl font-bold text-center mb-8'>
            {article.title}
          </h1>
          <div className='flex items-center gap-4 justify-center'>
            <p className='text-sm text-gray-500'>{article.created_at}</p>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
          </div>
        </div>
        <div className='w-full md:w-3/4 mx-auto'>
          <Image
            src={article.image} // Ensure images are stored in the public folder
            alt={article.title}
            width={800}
            height={600}
            className='w-full h-auto object-cover rounded-lg'
          />
        </div>
        <div
          className='mt-8 px-2 md:px-8 text-lg md:text-2xl leading-8'
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading article:', error)
    return <div>Article could not be loaded.</div> // Error handling if articles.js fails to load
  }
}

// Function to generate metadata dynamically
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

    return {
      title: article.title,
      description: article.excerpt || 'Read more about this topic.',
      openGraph: {
        title: article.title,
        description: article.excerpt || 'Read more about this topic.',
        images: [
          {
            url: article.image, // Ensure this is a full URL or a path to the public folder
            width: 800,
            height: 600,
            alt: article.title,
          },
        ],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Error',
      description: 'An error occurred while loading the article.',
    }
  }
}
