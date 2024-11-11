'use client'
import Image from 'next/image'
import Link from 'next/link'
import Close from '../buttons/Close'
import { useContext } from 'react'
import { AppContext } from '../../context'
import { MapShareLinks } from '../../app/data'

function MapDropDown() {
  const { mapDropIsOpen, setMapDropIsOpen } = useContext(AppContext)
  const handleClose = () => {
    setMapDropIsOpen(false)
  }

  return (
    <section
      className={`h-screen bg-[#1a1a1a] w-full transition-transform duration-500 ease-in-out fixed top-0 left-0 z-50 ${
        mapDropIsOpen ? 'translate-y-0' : 'translate-y-[-100%]'
      }`}
    >
      <Close
        styles={'absolute top-5 right-5 w-10 h-10 cursor-pointer'}
        handleClose={handleClose}
      />

      <div className="w-full h-[600px]  mx-auto flex flex-col items-center justify-center  ">
        <Link href={'/'} className="flex items-center gap-2 text-white">
          <Image
            src="/icons/location-arrow-white.svg"
            alt="phone"
            width={50}
            height={50}
            color="white"
            className="h-14 w-14 "
          />
          <h1 className="text-5xl text-white"> جدة السعودية</h1>
        </Link>
        <ul className="flex items-center gap-8 pt-[15px] mt-4">
          {MapShareLinks.map((link) => {
            return (
              <li
                key={link.id}
                className="cursor-pointer w-[90px] h-[90px] rounded-full flex items-center justify-center border-[2px] border-white"
              >
                <Link href={link.url}>
                  <Image
                    src={link.image}
                    alt="phone"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default MapDropDown
