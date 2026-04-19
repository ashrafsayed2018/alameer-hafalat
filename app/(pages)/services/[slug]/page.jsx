import Image from 'next/image'
import { notFound } from 'next/navigation'
import { articles } from '../../../articles'
import Card from '../../../../components/Card'
import { ServicesList, SiteInfo } from '../../../data'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://alameer-hafalat.com')

const toAbsoluteUrl = (path) => new URL(String(path || ''), SITE_URL).toString()

const normalizeSlug = (value = '') => {
  const str = String(value)

  try {
    return decodeURIComponent(str).normalize('NFC').trim()
  } catch {
    return str.normalize('NFC').trim()
  }
}

const getServiceBySlug = (slug) => {
  const target = normalizeSlug(slug)

  return ServicesList.find((s) => {
    const serviceSlug = String(s.link || '').split('/').pop() || ''
    return normalizeSlug(serviceSlug) === target
  })
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
  if (dmy) return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}`).getTime()
  const ymd = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (ymd) return new Date(dateStr).getTime()
  return 0
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'الخدمة غير موجودة',
    }
  }

  const canonical = toAbsoluteUrl(service.link)
  const ogImage = toAbsoluteUrl(service.image)

  return {
    metadataBase: new URL(SITE_URL),
    title: `${service.title} - ${SiteInfo.mobileNumber}`,
    description: service.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: canonical,
      images: [
        {
          url: ogImage,
          alt: service.title,
        },
      ],
    },
  }
}

export default async function ServicePage({ params }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const relatedArticles = articles
    .filter((article) => article?.title && article?.service === service.title)
    .sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at))

  return (
    <div className='mt-28 mb-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10'>
        <section className='overflow-hidden rounded-[32px] border border-[#00524e]/10 bg-white shadow-[0_20px_60px_-30px_rgba(0,82,78,0.35)]'>
          <div className='grid lg:grid-cols-[1.1fr_0.9fr]'>
            <div className='p-6 md:p-10 lg:p-12'>
              <span className='inline-flex rounded-full bg-[#00524e]/10 px-4 py-2 text-sm font-semibold text-[#00524e]'>خدمة مميزة في الكويت</span>
              <h1 className='mt-5 text-3xl md:text-5xl font-extrabold leading-tight text-[#00524e]'>{service.title}</h1>
              <p className='mt-5 text-lg leading-8 text-gray-600'>{service.description}</p>
              <div className='mt-6 grid gap-3 sm:grid-cols-3'>
                {['خدمة 24 ساعة', 'تغطية جميع مناطق الكويت', 'تنفيذ سريع ومنظم'].map((item) => (
                  <div key={item} className='rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700'>{item}</div>
                ))}
              </div>
              <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                <a href={`tel:${SiteInfo.mobileNumber}`} className='inline-flex items-center justify-center rounded-2xl bg-[#00524e] px-6 py-4 text-base font-bold text-white transition hover:bg-[#003f3c]'>اتصل الآن</a>
                <a href={`https://wa.me/${SiteInfo.whatsappNumber}`} target='_blank' rel='noopener noreferrer' className='inline-flex items-center justify-center rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white transition hover:bg-[#20bd5a]'>واتساب</a>
              </div>
              <div className='mt-8 grid gap-4 sm:grid-cols-3'>
                <div className='rounded-2xl bg-[#00524e] p-5 text-white'><p className='text-sm text-white/80'>للحجز السريع</p><p className='mt-2 text-2xl font-extrabold dir-ltr text-right'>{SiteInfo.mobileNumber}</p></div>
                <div className='rounded-2xl border border-gray-100 p-5'><p className='text-sm text-gray-500'>الجودة</p><p className='mt-2 text-lg font-bold text-[#00524e]'>معدات نظيفة ومعقمة</p></div>
                <div className='rounded-2xl border border-gray-100 p-5'><p className='text-sm text-gray-500'>الالتزام</p><p className='mt-2 text-lg font-bold text-[#00524e]'>مواعيد دقيقة وخدمة محترفة</p></div>
              </div>
            </div>
            <div className='relative bg-[#00524e] p-5 md:p-8'>
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_55%)]' />
              <div className='relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-sm'>
                <Image src={service.image} alt={service.title} width={900} height={1100} className='aspect-[4/5] w-full object-cover' priority />
              </div>
            </div>
          </div>
        </section>
        <section className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
          <div className='rounded-[28px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm'>
            <h2 className='text-2xl font-bold text-[#00524e]'>تفاصيل الخدمة</h2>
            <div className='mt-5 space-y-4 text-base leading-8 text-gray-600'>
              <p>نقدّم في الأمير خدمة {service.title} بمستوى احترافي يناسب المناسبات الخاصة والرسمية، مع تجهيز منظم وسريع يراعي جودة التنفيذ وراحة الضيوف.</p>
              <p>نحرص على توفير أفضل تجربة من أول تواصل وحتى انتهاء المناسبة، مع مرونة في المواعيد وتغطية شاملة لجميع مناطق الكويت.</p>
            </div>
          </div>
          <div className='rounded-[28px] border border-gray-100 bg-[#f8fbfb] p-6 md:p-8 shadow-sm'>
            <h2 className='text-2xl font-bold text-[#00524e]'>لماذا تختار خدماتنا؟</h2>
            <div className='mt-5 grid gap-3'>
              {['خدمة 24 ساعة', 'أسعار تنافسية', 'التزام بالمواعيد', 'معدات نظيفة ومعقمة', 'فريق عمل محترف', 'تغطية لجميع مناطق الكويت'].map((item) => (
                <div key={item} className='flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm'><span className='text-amber-500'>✓</span><span>{item}</span></div>
              ))}
            </div>
          </div>
        </section>
        {relatedArticles.length ? (
          <section className='rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm'>
            <div className='mb-6 flex flex-wrap items-end justify-between gap-3'>
              <div><h2 className='text-2xl md:text-3xl font-bold text-[#00524e]'>مقالات متعلقة بـ {service.title}</h2><p className='mt-2 text-gray-500'>محتوى مفيد مرتبط بنفس الخدمة لمساعدتك في الاختيار والتخطيط.</p></div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
              {relatedArticles.map((article) => (
                <Card key={article.id} item={{ ...article, description: article.excerpt, link: `/articles/${article.slug}`, date: article.created_at ? article.created_at.split('T')[0] : '' }} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
