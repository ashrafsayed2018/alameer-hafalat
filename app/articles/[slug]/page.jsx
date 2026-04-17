import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteInfo } from '../../data'

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
const shortenTitle = (value = '', max = 58) => {
  const str = String(value).trim()
  if (!str) return ''
  if (str.length <= max) return str
  return `${str.slice(0, max - 1).trimEnd()}…`
}

const getSeoTitle = (title = '') => {
  const digits = PHONE.replace('+', '')
  const clean = String(title)
    .replace(new RegExp(`(\\s*\\|\\s*\\+?${digits})|(\\+?${digits}\\s*\\|\\s*)`, 'g'), '')
    .replace(/\\s*\|\\s*$/g, '')
    .trim()

  const short = shortenTitle(clean)
  return short ? `${PHONE} | ${short}` : PHONE
}

const sanitizeHtmlLite = (html = '') => {
  let out = String(html)

  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  out = out.replace(
    /\s(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi,
    ' $1=$2#$2',
  )

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

const stripHtml = (html = '') =>
  String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const estimateReadingTimeMinutes = (html = '') => {
  const text = stripHtml(html)
  const words = text ? text.split(' ').length : 0
  return Math.max(1, Math.round(words / 180))
}

const parseDate = (dateStr) => {
  if (!dateStr) return 0
  if (dateStr.includes('T')) {
    const standard = dateStr.replace(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/,
      '$1-$2-$3T$4:$5:$6.$7Z',
    )
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
          canonical: toAbsoluteUrl(
            `/articles/${encodeURIComponent(decodedSlug)}`,
          ),
        },
      }
    }

    const seoTitle = getSeoTitle(article.title)
    const canonical = toAbsoluteUrl(
      `/articles/${encodeURIComponent(article.slug)}`,
    )
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

  const publishedTs = parseDate(article.created_at)
  const publishedDate = publishedTs
    ? new Date(publishedTs).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const canonical = toAbsoluteUrl(
    `/articles/${encodeURIComponent(article.slug)}`,
  )
  const readingMinutes = estimateReadingTimeMinutes(article.content ?? '')
  const shareUrl = encodeURIComponent(canonical)
  const shareTitle = encodeURIComponent(article.title)
  const whatsappShareUrl = `https://wa.me/?text=${canonical}`

  const relatedArticles = (await getArticles())
    .filter(
      (a) =>
        a && a.slug && normalizeSlug(a.slug) !== normalizeSlug(article.slug),
    )
    .sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at))
    .slice(0, 4)

  return (
    <main className='mt-32 mb-20'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <nav className='text-sm text-gray-500 flex flex-wrap items-center gap-2'>
          <Link href='/' className='hover:text-[#00524e] transition-colors'>
            الرئيسية
          </Link>
          <span className='text-gray-300'>/</span>
          <Link href='/blog' className='hover:text-[#00524e] transition-colors'>
            المدونة
          </Link>
          <span className='text-gray-300'>/</span>
          <span className='text-gray-700 line-clamp-1'>{article.title}</span>
        </nav>

        <header className='mt-6 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden'>
          <div className='p-6 md:p-10'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500'>
              {publishedDate ? <span>{publishedDate}</span> : null}
              <span>•</span>
              <span>{readingMinutes} دقيقة قراءة</span>
            </div>

            <h1 className='mt-4 text-3xl md:text-5xl font-extrabold text-[#00524e] leading-tight'>
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className='mt-5 text-lg md:text-xl leading-relaxed text-gray-700'>
                {article.excerpt}
              </p>
            ) : null}

            <div className='mt-6 flex flex-wrap gap-3'>
              <a
                href={`tel:${SiteInfo.mobileNumber}`}
                className='inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-[#00524e] text-white hover:bg-[#003f3c] transition-colors'
              >
                اتصل الآن
              </a>
              <a
                href={`https://wa.me/${SiteInfo.whatsappNumber}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors'
              >
                واتساب
              </a>
              <a
                href={whatsappShareUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold border border-gray-200 text-gray-700 hover:border-[#00524e] hover:text-[#00524e] transition-colors'
              >
                مشاركة المقال
              </a>
            </div>
          </div>

          {article.image ? (
            <div className='w-full bg-white'>
              <Image
                src={article.image}
                alt={article.title}
                width={1600}
                height={1200}
                priority
                className='w-full h-auto object-contain'
                sizes='(max-width: 1024px) 100vw, 1024px'
              />
            </div>
          ) : null}
        </header>

        <div className='mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8'>
          <article className='lg:col-span-8'>
            <div className='bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-10'>
              <div
                className='article-content text-base md:text-lg'
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
            </div>

            {relatedArticles.length ? (
              <section className='mt-10'>
                <h2 className='text-2xl md:text-3xl font-bold text-[#00524e] mb-5'>
                  مقالات قد تهمك
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  {relatedArticles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/articles/${a.slug}`}
                      className='group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow'
                    >
                      <div className='w-full bg-white'>
                        {a.image ? (
                          <Image
                            src={a.image}
                            alt={a.title}
                            width={1200}
                            height={900}
                            className='w-full h-auto object-contain group-hover:scale-[1.02] transition-transform'
                            sizes='(max-width: 640px) 100vw, 50vw'
                          />
                        ) : null}
                      </div>
                      <div className='p-5'>
                        <p className='text-sm text-gray-400' dir='ltr'>
                          {a.created_at ? a.created_at.split('T')[0] : ''}
                        </p>
                        <h3 className='mt-2 font-bold text-[#00524e] leading-snug line-clamp-2'>
                          {a.title}
                        </h3>
                        {a.excerpt ? (
                          <p className='mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3'>
                            {a.excerpt}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className='lg:col-span-4'>
            <div className='sticky top-28 space-y-6'>
              <div className='bg-white border border-gray-100 rounded-3xl shadow-sm p-6'>
                <p className='text-lg font-bold text-[#00524e]'>
                  للحجز والاستفسار
                </p>
                <p className='mt-2 text-3xl font-extrabold text-amber-500 dir-ltr text-right'>
                  {SiteInfo.mobileNumber}
                </p>
                <div className='mt-5 grid grid-cols-1 gap-3'>
                  <a
                    href={`tel:${SiteInfo.mobileNumber}`}
                    className='w-full inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-[#00524e] text-white hover:bg-[#003f3c] transition-colors'
                  >
                    اتصال
                  </a>
                  <a
                    href={`https://wa.me/${SiteInfo.whatsappNumber}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors'
                  >
                    واتساب
                  </a>
                </div>
              </div>

              <div className='rounded-3xl p-6 text-white bg-gradient-to-br from-[#00524e] to-amber-500 shadow-sm'>
                <p className='text-xl font-extrabold leading-snug'>
                  جهّز مناسبتك مع خدمات الأمير
                </p>
                <p className='mt-3 text-white/90 leading-relaxed'>
                  تواصل معنا الآن للحصول على عرض سعر سريع وخدمة فورية داخل
                  الكويت.
                </p>
                <div className='mt-5'>
                  <a
                    href={whatsappShareUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-white text-[#00524e] hover:bg-white/90 transition-colors'
                  >
                    مشاركة المقال عبر واتساب
                  </a>
                </div>
              </div>

              <div className='bg-white border border-gray-100 rounded-3xl shadow-sm p-6'>
                <p className='text-sm text-gray-500'>رابط المقال</p>
                <a
                  href={canonical}
                  className='mt-2 block text-sm text-[#00524e] break-words hover:underline'
                >
                  {canonical}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
