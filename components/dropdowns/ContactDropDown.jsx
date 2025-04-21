'use client'
import { useContext } from 'react'
import Close from '../buttons/Close'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContactInfo } from '../../app/data'
import { AppContext } from '../../context'
function ContactDropDown() {
  const { contactDropIsOpen, setContactDropIsOpen } = useContext(AppContext)
  const handleClose = () => {
    setContactDropIsOpen(false)
  }

  return (
    <section
      className={`h-screen bg-[#1a1a1a] w-full transition-transform duration-500 ease-in-out fixed top-0 left-0 z-50 md:z-0 ${
        contactDropIsOpen ? 'translate-y-0' : 'translate-y-[-100%]'
      }`}
    >
      <Close
        styles={'absolute top-5 right-5 w-10 h-10 cursor-pointer'}
        handleClose={handleClose}
      />

      <div className='w-full h-[600px]  mx-auto flex flex-col items-center justify-center -mt-6 '>
        <ul className='pt-[15px] mt-4 '>
          {ContactInfo.map((link) => {
            return (
              <li
                key={link.id}
                className='transition-all duration-500 group mb-3'
              >
                <a href={link.href} className='flex items-center gap-3 '>
                  <FontAwesomeIcon
                    icon={link.icon}
                    color='white'
                    size='2x'
                    className='group-hoverTextColor'
                  />
                  <p
                    className='text-white text-xl md:text-3xl lg:text-5xl group-hoverTextColor'
                    dir='ltr'
                  >
                    {link.text}
                  </p>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default ContactDropDown
