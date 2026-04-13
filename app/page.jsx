'use client'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { ServicesList, SiteInfo } from './data'
import { tags } from './tags'

export default function Home() {
  return (
    <main className='font-sans' dir='rtl'>
      {/* Hero Section */}
      <section className='relative h-[700px] w-full bg-black'>
        <Image
          src='/images/hero.webp'
          alt='Hero Background'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-black/50' />
        <div className='absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4'>
          <h1 className='text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg'>
            الامير
          </h1>
          <p className='text-xl md:text-3xl mb-10 drop-shadow-md font-medium'>
            افضل خدمة تاجير كراسي وطاولات في الكويت
          </p>
          <a
            href={`tel:${SiteInfo.mobileNumber}`}
            className='bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold py-3 px-12 rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center gap-3'
          >
            <span>احجز خدمتك معنا</span>
            <span className='text-2xl'>👈</span>
          </a>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className='py-20 bg-white text-center px-4'>
        <h2 className='text-3xl md:text-4xl font-bold text-[#00524e] mb-8'>
          لماذا الامير هي افضل ايجار كراسي وطاولات الكويت ؟
        </h2>
        <p className='max-w-4xl mx-auto text-gray-600 leading-9 text-lg mb-12'>
          نحن في الامير نفتخر بتقديم أفضل خدمات الضيافة وتجهيز المناسبات. نمتلك
          تشكيلة واسعة من الكراسي والطاولات الفاخرة التي تناسب جميع الأذواق
          والميزانيات. فريقنا المتخصص يضمن لكم خدمة سريعة، نظافة تامة، وترتيباً
          أنيقاً يبيض الوجه في جميع مناسباتكم سواء كانت أفراح، استقبالات، أو
          عزاء. هدفنا دائماً راحتكم ورضاكم.
        </p>
        <a
          href={`tel:${SiteInfo.mobileNumber}`}
          className='bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold py-3 px-12 rounded-full shadow-lg transition-all inline-block hover:-translate-y-1'
        >
          اتصل بنا الان
        </a>
      </section>

      {/* Services Section */}
      <section className='py-16 bg-gray-50 px-4 md:px-12'>
        <h2 className='text-center text-3xl md:text-4xl font-bold text-[#00524e] mb-16 relative'>
          ما هي الخدمات المقدمة من خدمة تأجير كراسي وطاولات في الكويت ؟
          <span className='block w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full'></span>
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {ServicesList.map((service) => (
            <div
              key={service.id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100'
            >
              {/* Card Header */}
              <div className='bg-[#00524e] text-white font-bold text-center py-2 px-2 text-sm md:text-base flex justify-between items-center dir-ltr'>
                <span className='bg-amber-500 text-xs px-2 py-1 rounded text-white'>
                  {SiteInfo.mobileNumber}
                </span>
                <span className='flex-1 text-center truncate px-1'>
                  {service.title}
                </span>
              </div>

              {/* Image */}
              <div className='relative h-[450px] w-full overflow-hidden bg-gray-50'>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                {/* Overlay on hover */}
                <div className='absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300' />
              </div>

              {/* Content */}
              <div className='p-5 text-center'>
                <h3 className='font-bold text-[#00524e] text-lg mb-2 line-clamp-1'>
                  {service.title}
                </h3>
                <div
                  className='flex justify-center items-center gap-2 text-xs text-gray-400 mb-3'
                  dir='ltr'
                >
                  <span>{service.date}</span>
                  <span>|</span>
                  <span>{service.commentsCount} Comments</span>
                </div>
                <p className='text-gray-500 text-sm leading-relaxed mb-4 line-clamp-5 min-h-[4.5rem]'>
                  {service.description} {SiteInfo.mobileNumber}
                </p>
                <Link
                  href={service.link}
                  className='inline-block text-[#00524e] border border-[#00524e] px-4 py-1 rounded-full text-sm font-semibold hover:bg-[#00524e] hover:text-white transition-colors'
                >
                  التفاصيل
                </Link>
              </div>

              {/* Card Footer */}
              <div className='bg-[#00524e] py-3 flex justify-center items-center gap-8 text-white'>
                <a
                  href={`tel:${SiteInfo.mobileNumber}`}
                  className='flex items-center gap-2 hover:text-amber-400 transition-colors'
                >
                  <FontAwesomeIcon icon={faPhone} className='h-5 w-5' />
                  <span className='text-sm font-bold'>اتصال</span>
                </a>
                <div className='w-[1px] h-6 bg-gray-500'></div>
                <a
                  href={`https://wa.me/${SiteInfo.whatsappNumber}`}
                  className='flex items-center gap-2 hover:text-green-400 transition-colors'
                >
                  <FontAwesomeIcon icon={faWhatsapp} className='h-5 w-5' />
                  <span className='text-sm font-bold'>واتساب</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Banner Section */}
      <section className='py-20 bg-white text-center px-4 border-t border-gray-100'>
        <h2 className='text-4xl md:text-5xl font-bold text-[#00524e] mb-10 font-serif'>
          متميزون في ايجار كراسي وطاولات الكويت
        </h2>
        <p className='max-w-6xl mx-auto text-gray-500 leading-8 mb-6 text-sm md:text-base'>
          لأننا نؤمن بأن كل مناسبة تستحق أن تكون ذكرى جميلة، نقدم لكم في الامير
          أفضل خدمات الضيافة وتأجير المستلزمات. خبرتنا الطويلة وفريقنا المحترف
          يضمنان لكم تنظيماً مثالياً وراحة بال تامة. اتصلوا بنا الآن ودعونا نهتم
          بالتفاصيل. خدمة 24 ساعة لجميع مناطق الكويت.
        </p>
      </section>
      {/* Hashtags Section */}
      <section className='py-16 bg-white px-4 md:px-12'>
        <h2 className='text-center text-3xl md:text-4xl font-bold text-[#00524e] mb-12 relative'>
          تصفح حسب القسم
          <span className='block w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full'></span>
        </h2>
        <div className='flex flex-wrap justify-center gap-4 max-w-6xl mx-auto'>
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className='group relative inline-flex items-center justify-center overflow-hidden rounded-full p-0.5 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2'
            >
              <span className='absolute inset-0 bg-gradient-to-br from-[#00524e] to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></span>
              <span className='relative flex items-center bg-gray-100 px-6 py-3 rounded-full transition-all duration-300 group-hover:bg-opacity-0 group-hover:text-white text-[#00524e]'>
                <span className='ml-2'>#</span>
                {tag.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
