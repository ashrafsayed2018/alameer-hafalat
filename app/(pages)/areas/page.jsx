import Link from 'next/link'
import { governorates } from '../../areas'
import { SiteInfo } from '../../data'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://alameer-hafalat.com')

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `مناطق الخدمة في الكويت - ${SiteInfo.mobileNumber}`,
  description: `أمير الحفلات يغطي جميع مناطق الكويت — العاصمة، حولي، مبارك الكبير، الأحمدي. تأجير كراسي وطاولات وخيام وتجهيز مناسبات. اتصل ${SiteInfo.mobileNumber}`,
  alternates: { canonical: `${SITE_URL}/areas` },
}

const govColors = {
  capital: { bg: 'bg-[#00524e]', light: 'bg-[#00524e]/10', text: 'text-[#00524e]', border: 'border-[#00524e]/20', hoverBg: 'hover:bg-[#00524e]' },
  hawalli: { bg: 'bg-[#1a6b5e]', light: 'bg-[#1a6b5e]/10', text: 'text-[#1a6b5e]', border: 'border-[#1a6b5e]/20', hoverBg: 'hover:bg-[#1a6b5e]' },
  mubarak: { bg: 'bg-[#2d7a5f]', light: 'bg-[#2d7a5f]/10', text: 'text-[#2d7a5f]', border: 'border-[#2d7a5f]/20', hoverBg: 'hover:bg-[#2d7a5f]' },
  ahmadi: { bg: 'bg-[#07453d]', light: 'bg-[#07453d]/10', text: 'text-[#07453d]', border: 'border-[#07453d]/20', hoverBg: 'hover:bg-[#07453d]' },
}

export default function AreasPage() {
  return (
    <div className="mt-28 mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex rounded-full bg-[#00524e]/10 px-4 py-2 text-sm font-semibold text-[#00524e] mb-4">
            تغطية شاملة لجميع مناطق الكويت
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#00524e] mt-3">مناطق الخدمة</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            نصل إلى جميع مناطق ومحافظات الكويت لتجهيز مناسباتكم باحترافية وسرعة
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href={`tel:${SiteInfo.mobileNumber}`} className="inline-flex items-center gap-2 rounded-2xl bg-[#00524e] px-6 py-3 text-base font-bold text-white transition hover:bg-[#003f3c]">
              اتصل الآن — {SiteInfo.mobileNumber}
            </a>
            <a href={`https://wa.me/${SiteInfo.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3 text-base font-bold text-white transition hover:bg-[#20bd5a]">
              واتساب
            </a>
          </div>
        </div>

        {/* Governorates */}
        <div className="space-y-12">
          {governorates.map((gov) => {
            const colors = govColors[gov.id] || govColors.capital
            return (
              <div key={gov.id} className="rounded-[32px] border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Gov header */}
                <div className={`${colors.bg} px-6 py-5 flex items-center justify-between`}>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white">{gov.title}</h2>
                    <p className="text-white/70 text-sm mt-0.5">{gov.areas.length} منطقة</p>
                  </div>
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white">
                    {gov.areas.length} منطقة
                  </span>
                </div>

                {/* Areas grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {gov.areas.map((area) => (
                      <Link
                        key={area.slug}
                        href={`/areas/${encodeURIComponent(area.slug)}`}
                        className={`group flex items-center gap-2 rounded-2xl border ${colors.border} ${colors.light} px-4 py-3 text-sm font-semibold ${colors.text} transition-all ${colors.hoverBg} hover:text-white hover:shadow-md`}
                      >
                        <svg className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{area.ar}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA bottom */}
        <div className="mt-14 rounded-[32px] bg-gradient-to-r from-[#00524e] to-[#07453d] p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold">نخدمكم في جميع أنحاء الكويت</h2>
          <p className="mt-3 text-white/80 text-lg">تواصل معنا الآن لحجز خدماتكم في منطقتكم</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href={`tel:${SiteInfo.mobileNumber}`} className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 text-base font-bold text-[#00524e] transition hover:bg-gray-100">
              {SiteInfo.mobileNumber}
            </a>
            <a href={`https://wa.me/${SiteInfo.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-8 py-3 text-base font-bold text-white transition hover:bg-[#20bd5a]">
              واتساب
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
