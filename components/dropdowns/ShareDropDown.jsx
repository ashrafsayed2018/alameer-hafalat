'use client'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useContext } from 'react'
import { SocialShareLinks } from '../../app/data'
import { AppContext } from '../../context'
import Close from '../buttons/Close'
function ShareDropDown() {
  const { shareDropIsOpen, setShareDropIsOpen } = useContext(AppContext)
  const handleClose = () => {
    setShareDropIsOpen(false)
  }

  return (
    <section
      className={`h-screen bg-[#1a1a1a] w-full transition-transform duration-500 ease-in-out fixed top-0 left-0 z-50 md:z-0 ${
        shareDropIsOpen ? 'translate-y-0' : 'translate-y-[-100%]'
      }`}
    >
      <Close
        styles={'absolute top-5 right-5 w-10 h-10 cursor-pointer'}
        handleClose={handleClose}
      />

      <div className='w-full h-[600px]  mx-auto flex flex-col items-center justify-center mt-16 '>
        <ul className='flex items-center gap-8 pt-[15px] mt-4 '>
          {SocialShareLinks.map((link) => {
            return (
              <li
                key={link.id}
                className='cursor-pointer w-[90px] h-[90px] rounded-full flex items-center justify-center border-[2px] border-white hoverBorderColor transition-all duration-500 group'
              >
                <Link href={link.url}>
                  <FontAwesomeIcon
                    icon={link.icon}
                    color='white'
                    size='2x'
                    className='group-hover:textColor'
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

export default ShareDropDown
