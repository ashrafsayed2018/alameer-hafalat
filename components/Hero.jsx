import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Aref_Ruqaa, Lemonada, Open_Sans } from 'next/font/google'
import { SiteInfo } from '../app/data'
import Button from './buttons/Button'
const openSans = Open_Sans({ subsets: ['latin'] })
const lemonda = Lemonada({ subsets: ['latin'] })
const arefRuqaa = Aref_Ruqaa({ subsets: ['arabic'], weight: '400' })

function Hero() {
  return (
    <section className={`${arefRuqaa.className}`}>
      <div className="bg-[url('/images/hero.webp')] h-[550px] lg:h-[800px] bg-no-repeat bg-center  bg-cover  relative">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="site-description absolute inset-0 z-10 w-4/5 mx-auto h-full py-16 text-center ">
          <h1
            className="text-white text-xl md:text-4xl lg:text-7xl font-semibold mb-8 lg:mb-20 flex flex-col animate-slidein700"
            style={{ lineHeight: 1.6 }}
          >
            {SiteInfo.title}&nbsp; {SiteInfo.mobileNumber}
          </h1>
          <div
            className={`absolute bottom-4 left-[50%] translate-x-[-50%] ${openSans.className}`}
          >
            <Button
              href={`tel:${SiteInfo.mobileNumber}`}
              text={'اتصل بنا'}
              styles={
                'themeBgColor hoverBgColor text-white rounded-xl p-2 w-28 block mx-auto flex items-center justify-center gap-3'
              }
            >
              <FontAwesomeIcon icon={faPhone} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
