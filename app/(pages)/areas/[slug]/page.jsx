import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAreaBySlug, getAllAreaSlugs, governorates } from '../../../areas'
import { ServicesList, SiteInfo } from '../../../data'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://alameer-hafalat.com')

export async function generateStaticParams() {
  return getAllAreaSlugs().map((slug) => ({ slug: encodeURIComponent(slug) }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const result = getAreaBySlug(slug)
  if (!result) return { title: 'المنطقة غير موجودة' }
  const { area, governorate } = result
  return {
    metadataBase: new URL(SITE_URL),
    title: `تأجير مستلزمات المناسبات في ${area.ar} - ${SiteInfo.mobileNumber}`,
    description: `أمير الحفلات يوفر تأجير كراسي وطاولات وخيام وتجهيز مناسبات في ${area.ar}، ${governorate.title}. خدمة سريعة واحترافية. اتصل ${SiteInfo.mobileNumber}`,
    alternates: { canonical: `${SITE_URL}/areas/${encodeURIComponent(area.slug)}` },
    openGraph: {
      title: `تأجير مستلزمات المناسبات في ${area.ar}`,
      description: `خدمات تأجير كراسي وطاولات وخيام في ${area.ar} - أمير الحفلات`,
    },
  }
}

export default async function AreaPage({ params }) {
  const { slug } = await params
  const result = getAreaBySlug(slug)
  if (!result) notFound()

  const { area, governorate } = result

  const siblingAreas = governorate.areas.filter((a) => a.slug !== area.slug).slice(0, 8)

  const features = [
    'خدمة 24 ساعة',
    'توصيل وتركيب سريع',
    'أسعار تنافسية',
    'معدات نظيفة ومعقمة',
    'فريق عمل محترف',
    'مرونة في المواعيد',
  ]

  const services = ServicesList.slice(0, 6)

  return (
    <div className="mt-28 mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#00524e] transition">الرئيسية</Link>
          <span>/</span>
          <Link href="/areas" className="hover:text-[#00524e] transition">مناطق الخدمة</Link>
          <span>/</span>
          <span className="text-[#00524e] font-medium">{area.ar}</span>
        </nav>

        {/* Hero section */}
        <section className="overflow-hidden rounded-[32px] border border-[#00524e]/10 bg-white shadow-[0_20px_60px_-30px_rgba(0,82,78,0.35)]">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 md:p-10 lg:p-12">
              <span className="inline-flex rounded-full bg-[#00524e]/10 px-4 py-2 text-sm font-semibold text-[#00524e]">
                {governorate.title}
              </span>
              <h1 className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight text-[#00524e]">
                تأجير مستلزمات المناسبات في {area.ar}
              </h1>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                أمير الحفلات يوفر خدمات تأجير الكراسي والطاولات والخيام وتجهيز المناسبات في {area.ar} بجودة عالية وأسعار تنافسية. نصل إليك بسرعة واحترافية.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['خدمة 24 ساعة', 'توصيل لـ ' + area.ar, 'تنفيذ سريع ومنظم'].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">{item}</div>
                ))}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <a href={`tel:${SiteInfo.mobileNumber}`} className="inline-flex items-center justify-center rounded-2xl bg-[#00524e] px-6 py-4 text-base font-bold text-white transition hover:bg-[#003f3c]">
                  اتصل الآن
                </a>
                <a href={`https://wa.me/${SiteInfo.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white transition hover:bg-[#20bd5a]">
                  واتساب
                </a>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#00524e] p-5 text-white">
                  <p className="text-sm text-white/80">للحجز السريع</p>
                  <p className="mt-2 text-2xl font-extrabold" dir="ltr">{SiteInfo.mobileNumber}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">المنطقة</p>
                  <p className="mt-2 text-lg font-bold text-[#00524e]">{area.ar}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm text-gray-500">المحافظة</p>
                  <p className="mt-2 text-base font-bold text-[#00524e]">{governorate.title}</p>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="relative bg-[#00524e] p-5 md:p-8 flex flex-col justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_55%)]" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6">خدماتنا في {area.ar}</h2>
                <div className="grid gap-3">
                  {services.map((s) => (
                    <Link
                      key={s.id}
                      href={s.link}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/20 px-4 py-3 text-white transition-all backdrop-blur-sm border border-white/10"
                    >
                      <span className="text-amber-400 text-lg">✓</span>
                      <span className="font-semibold">{s.title}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition">
                  عرض جميع الخدمات ←
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why us + features */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#00524e]">خدماتنا في {area.ar}</h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-gray-600">
              <p>
                نقدم في أمير الحفلات خدمات تأجير مستلزمات المناسبات في {area.ar} بمستوى احترافي، مع تجهيز منظم وسريع يراعي جودة التنفيذ وراحة الضيوف.
              </p>
              <p>
                نحرص على توفير أفضل تجربة من أول تواصل وحتى انتهاء المناسبة، مع مرونة في المواعيد وتغطية شاملة لجميع مناطق {governorate.title}.
              </p>
            </div>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-[#f8fbfb] p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#00524e]">لماذا تختار خدماتنا؟</h2>
            <div className="mt-5 grid gap-3">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
                  <span className="text-amber-500">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other areas in same governorate */}
        {siblingAreas.length > 0 && (
          <section className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#00524e] mb-2">مناطق أخرى في {governorate.title}</h2>
            <p className="text-gray-500 text-sm mb-6">نخدم أيضاً المناطق المجاورة في نفس المحافظة</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {siblingAreas.map((a) => (
                <Link
                  key={a.slug}
                  href={`/areas/${encodeURIComponent(a.slug)}`}
                  className="flex items-center gap-2 rounded-2xl border border-[#00524e]/15 bg-[#00524e]/5 px-4 py-3 text-sm font-semibold text-[#00524e] transition-all hover:bg-[#00524e] hover:text-white"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {a.ar}
                </Link>
              ))}
              <Link
                href="/areas"
                className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-100"
              >
                عرض الكل ←
              </Link>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-[32px] bg-gradient-to-r from-[#00524e] to-[#07453d] p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold">احجز الآن في {area.ar}</h2>
          <p className="mt-3 text-white/80 text-lg">تواصل معنا لتجهيز مناسبتك باحترافية</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href={`tel:${SiteInfo.mobileNumber}`} className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 text-base font-bold text-[#00524e] transition hover:bg-gray-100">
              {SiteInfo.mobileNumber}
            </a>
            <a href={`https://wa.me/${SiteInfo.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-8 py-3 text-base font-bold text-white transition hover:bg-[#20bd5a]">
              واتساب
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
