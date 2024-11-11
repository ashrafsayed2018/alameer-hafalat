import { AboutCompany } from '../app/data'
import Image from 'next/image'
import React from 'react'

function About() {
  return (
    <div className="mt-28 px-4 md:px-6 lg:px-8 xl:px-10">
      <h2 className="headingColor">حول شركتنا</h2>
      <span className="headingBorderColor"></span>

      <p className="text-center text-xl textColor font-bold">
        شركة نقل اثاث بجدة
      </p>
      <div className="images w-full md:w-1/3 mx-auto">
        <Image
          src="/images/about.png"
          alt="about"
          width={300}
          height={200}
          className="w-full h-80 rounded-xl"
        />
        {/* <Image
          src="/images/about2.webp"
          alt="about"
          width={300}
          height={200}
          className="w-full col-span-4 h-48 rounded-xl"
        /> */}
      </div>
      {/* about description  */}
      <div className="about-description">
        <div className="description-one border-2 border-gray-300 mt-8 p-4 rounded-lg shadow-lg">
          {AboutCompany.map((about) => {
            return (
              <p key={about.id} className="text-2xl mt-8 text-center">
                {about.title}
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default About
