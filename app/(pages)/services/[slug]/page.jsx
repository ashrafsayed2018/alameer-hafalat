import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ServicesList, SiteInfo } from '../../../data'

export async function generateMetadata({ params }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  const service = ServicesList.find((s) => s.link.endsWith(`/${decodedSlug}`))

  if (!service) {
    return {
      title: 'الخدمة غير موجودة',
    }
  }

  return {
    title: `${service.title} - ${SiteInfo.mobileNumber}`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      images: [service.image],
    },
  }
}

export default function ServicePage({ params }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  // Find service where link ends with the slug (e.g., matches 'bench-rental' from '/services/bench-rental')
  const service = ServicesList.find((s) => s.link.endsWith(`/${decodedSlug}`))

  if (!service) {
    notFound()
  }

  return (
    <div className='mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20'>
      <div className='md:flex items-start justify-between gap-12'>
        {/* Content Side */}
        <div className='flex-1 order-2 md:order-1'>
          <h1 className='text-3xl md:text-5xl font-bold mb-6 text-[#00524e] leading-tight'>
            {service.title}
          </h1>

          <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8'>
            <p className='text-xl leading-loose text-gray-700 font-medium mb-6'>
              {service.description}
            </p>
            <div className='space-y-4'>
              <p className='text-lg text-gray-600 leading-relaxed'>
                نحن في <strong>الامير</strong> نسعى دائماً لتقديم أفضل خدمات{' '}
                {service.title} في الكويت. نضمن لكم الجودة العالية، النظافة
                التامة، والأسعار المناسبة.
              </p>
              <p className='text-lg text-gray-600 leading-relaxed'>
                سواء كانت مناسبتكم كبيرة أو صغيرة، فريقنا جاهز لخدمتكم على مدار
                الساعة في جميع مناطق الكويت.
              </p>
            </div>
            <div className='mt-8 pt-6 border-t border-gray-100'>
              <p className='text-2xl font-bold text-[#00524e] mb-2'>
                للحجز والاستفسار:
              </p>
              <p className='text-3xl font-extrabold text-amber-500 dir-ltr text-right'>
                {SiteInfo.mobileNumber}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-4'>
            <a
              href={`tel:${SiteInfo.mobileNumber}`}
              className='flex-1 bg-[#00524e] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#003f3c] transition-all hover:shadow-lg flex items-center justify-center gap-3'
            >
              <span>📞</span>
              <span>اتصل الآن</span>
            </a>
            <a
              href={`https://wa.me/${SiteInfo.whatsappNumber}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#20bd5a] transition-all hover:shadow-lg flex items-center justify-center gap-3'
            >
              <span>💬</span>
              <span>واتساب</span>
            </a>
          </div>

          {/* Why Choose Us */}
          <div className='mt-12'>
            <h3 className='text-2xl font-bold text-[#00524e] mb-6'>
              لماذا تختار خدماتنا؟
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {[
                'خدمة 24 ساعة',
                'تغطية لجميع مناطق الكويت',
                'أسعار تنافسية',
                'التزام بالمواعيد',
                'معدات نظيفة ومعقمة',
                'فريق عمل محترف',
              ].map((item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-3 bg-gray-50 p-3 rounded-lg'
                >
                  <span className='text-amber-500'>✓</span>
                  <span className='text-gray-700 font-medium'>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className='w-full md:w-1/2 order-1 md:order-2 mb-8 md:mb-0'>
          <div className='relative rounded-2xl overflow-hidden shadow-2xl sticky top-32'>
            <Image
              src={service.image}
              alt={service.title}
              width={800}
              height={600}
              className='w-full h-auto object-cover hover:scale-105 transition-transform duration-700'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
