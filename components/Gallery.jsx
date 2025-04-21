import Image from 'next/image'
import { ServicesList } from '../app/data'

const images = Array.from(
  { length: ServicesList.length },
  (_, i) => `/images/${String(i + 1).padStart(3, '0')}.jpeg`
)

export default function Gallery() {
  return (
    <div className='mt-28 px-4 md:px-6 lg:px-8 xl:px-10'>
      <h2 className='headingColor'>صور من اعمالنا</h2>
      <span className='headingBorderColor'></span>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {ServicesList.map((service, index) => {
          return (
            <div
              key={index}
              className='relative h-[600px] overflow-hidden rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:rotate-3 hover:shadow-xl'
            >
              <Image
                src={service.image}
                alt={`Image ${index + 1}`}
                width={500}
                height={500}
                objectFit='cover' // Ensures the image covers the container
                className='transition duration-300 transform hover:scale-110'
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
