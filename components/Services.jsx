'use client'
import { ServicesList } from '../app/data'
import Card from './Card'

function Services() {
  return (
    <div className='mt-28 px-4 md:px-6 lg:px-8 xl:px-10 '>
      <h2 className='headingColor'>خدماتنا</h2>
      <span className='headingBorderColor'></span>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
        {ServicesList.map((service) => {
          return (
            <Card
              isService='true'
              key={service.id}
              item={service}
              imageStyle='h-80 w-full object-cover'
            />
          )
        })}
      </div>
    </div>
  )
}

export default Services
