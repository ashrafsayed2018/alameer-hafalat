import Image from 'next/image'
import { notFound } from 'next/navigation'

// ─── Config ───────────────────────────────────────────────────────────────────
const PHONE = '+96650623'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://alameer-hafalat.com')

const toAbsoluteUrl = (path) => new URL(String(path || ''), SITE_URL).toString()

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strips any previously appended phone suffix from the title,
 * then appends a clean one. Prevents duplicates on re-render.
 */
const getSeoTitle = (title = '') => {
  const clean = title
    .replace(new RegExp(`(\\s*\\|\\s*\\+?${PHONE.replace('+', '')})+`, 'g'), '')
    .trim()

  return clean ? `${clean} | ${PHONE}` : PHONE
}

const sanitizeHtmlLite = (html = '') => {
  let out = String(html)

  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, ' $1=$2#$2')

  return out
}

const getArticles = async () => {
  const { articles } = await import('../../articles.js')
  return articles
}

const normalizeSlug = (value = '') => {
  const str = String(value)

  try {
    return decodeURIComponent(str).normalize('NFC').trim()
  } catch {
    return str.normalize('NFC').trim()
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params
  const decodedSlug = normalizeSlug(slug)

  try {
    const articles = await getArticles()
    const article = articles.find((a) => normalizeSlug(a.slug) === decodedSlug)

    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The article you are looking for does not exist.',
        alternates: {
          canonical: toAbsoluteUrl(`/articles/${encodeURIComponent(decodedSlug)}`),
        },
      }
    }

    const seoTitle = getSeoTitle(article.title)
    const canonical = toAbsoluteUrl(`/articles/${encodeURIComponent(article.slug)}`)
    const ogImage = toAbsoluteUrl(article.image)

    return {
      metadataBase: new URL(SITE_URL),
      title: seoTitle,
      description: article.excerpt,
      alternates: {
        canonical,
      },
      openGraph: {
        title: seoTitle,
        description: article.excerpt,
        url: canonical,
        images: [
          {
            url: ogImage,
            width: 800,
            height: 600,
            alt: article.title,
          },
        ],
      },
    }
  } catch (error) {
    console.error('generateMetadata error:', error)
    return {
      title: 'Error',
      description: 'An error occurred while loading the article.',
    }
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function ArticlePage({ params }) {
  const { slug } = await params
  const decodedSlug = normalizeSlug(slug)

  let article

  try {
    const articles = await getArticles()
    article = articles.find((a) => normalizeSlug(a.slug) === decodedSlug)
  } catch (error) {
    console.error('Error loading articles:', error)
    return <div>Article could not be loaded.</div>
  }

  if (!article) {
    notFound()
  }

  const safeContent = sanitizeHtmlLite(article.content ?? '')

  const publishedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className='mt-40'>
      {/* Header: Title + Date */}
      <div className='md:flex items-start justify-between gap-6 mb-8'>
        <h1 className='text-3xl font-bold text-center md:text-right'>
          {article.title}
        </h1>

        {publishedDate && (
          <div className='flex items-center gap-2 justify-center text-gray-500 text-sm whitespace-nowrap'>
            <span>{publishedDate}</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-5'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
          </div>
        )}
      </div>

      {/* Cover Image */}
      {article.image && (
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
      )}

      {/* Body */}
      <div
        className='mt-8 px-2 md:px-8 text-lg md:text-xl leading-8'
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    </article>
  )
}
