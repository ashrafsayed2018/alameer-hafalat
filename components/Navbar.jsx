'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import { NavLinks, SiteInfo } from '../app/data'
import { AppContext } from '../context'

function Navbar() {
  const {
    menuIsOpen,
    setMenuIsOpen,
    mapDropIsOpen,
    setMapDropIsOpen,
    shareDropIsOpen,
    setShareDropIsOpen,
    contactDropIsOpen,
    setContactDropIsOpen,
  } = useContext(AppContext)

  useEffect(() => {
    function scrollFunction() {
      const navbar = document.getElementById('navbar')
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        navbar.style.height = '65px'
        navbar.style.boxShadow =
          '0 4px 6px 6px rgb(0 0 0 / 0.1), 0 2px 4px 6px rgb(0 0 0 / 0.1)'
      } else {
        navbar.style.height = '55px'
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', scrollFunction)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', scrollFunction)
      }
    }
  }, [])

  return (
    <section
      className="themeBgColor hoverBgColor h-14 fixed inset-0 z-40"
      id="navbar"
    >
      <div className="themeBgColor hoverBgColor grid grid-cols-3 items-center h-full px-4">
        {/* logo and site name */}
        <div className="logo absolute top-[10px] left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0  flex items-center gap-x-3 col-span-1 ">
          <div className="image flex themeBgColor hoverBgColor w-10 h-10 items-center justify-center rounded-full cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={22}
              height={22}
              priority={true}
              className="text-white h-8 w-8"
            />
          </div>
          <div className="siteName">
            <h1 className="text-sm md:text-xl lg:text-[22px] text-white font-extrabold tracking-wider">
              {SiteInfo.name}
            </h1>
          </div>
        </div>
        {/* manu */}
        <div className="menu col-span-2 flex items-center justify-end gap-10">
          <ul className="hidden md:flex items-center gap-x-5">
            {NavLinks.map((navLink) => {
              return (
                <li key={navLink.id}>
                  <Link
                    href={navLink.url}
                    className="text-sm text-white hoverBgColor p-2 rounded-xl transition-all duration-300 ease-in-out"
                  >
                    {navLink.name}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="absolute top-[10px] left-4 md:static nav-dropdwons flex items-center gap-5">
            <div
              className="map-dropdown flex themeBgColor hoverBgColor w-10 h-10 items-center justify-center rounded-full cursor-pointer"
              onClick={() => setMapDropIsOpen(!mapDropIsOpen)}
            >
              <Image
                src="/icons/location-arrow-white.svg"
                alt="location"
                width={12}
                height={12}
                priority={true}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
            <div
              className="share-dropdown hidden md:flex themeBgColor hoverBgColor w-10 h-10 items-center justify-center rounded-full cursor-pointer"
              onClick={() => setShareDropIsOpen(!shareDropIsOpen)}
            >
              <Image
                src="/icons/share-alt.svg"
                alt="share"
                width={12}
                height={12}
                priority={true}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
            <div
              className="contact-dropdown flex themeBgColor hoverBgColor w-10 h-10 items-center justify-center rounded-full cursor-pointer"
              onClick={() => setContactDropIsOpen(!contactDropIsOpen)}
            >
              <Image
                src="/icons/phone.svg"
                alt="contact"
                width={12}
                height={12}
                priority={true}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <div
          className="mobile-menu md:hidden absolute top-[10px] right-5 flex themeBgColor hoverBgColor w-10 h-10 items-center justify-center rounded-full cursor-pointer"
          onClick={() => setMenuIsOpen(!menuIsOpen)}
        >
          <Image
            src="/icons/bars.svg"
            alt="menu"
            width={12}
            height={12}
            priority={true}
            className="h-4 w-4 cursor-pointer"
          />
        </div>
      </div>
    </section>
  )
}

export default Navbar
