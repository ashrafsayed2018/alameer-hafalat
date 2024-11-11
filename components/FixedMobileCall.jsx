import { ContactInfo } from '../app/data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function FixedMobileCall() {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full themeBgColor hover:bg-blue-600 flex items-center justify-center md:hidden h-16 z-50">
      {ContactInfo.map((link) => {
        return (
          <a
            href={link.href}
            key={link.id}
            className="text-white flex-1 flex items-center justify-center flex-col "
          >
            <FontAwesomeIcon
              icon={link.icon}
              className={`mb-[5px] ${
                link.name === 'الهاتف'
                  ? 'text-xl'
                  : 'bg-green-900 rounded-full text-2xl'
              }`}
            />
            <span className="text-sm">{link.name}</span>
          </a>
        )
      })}
    </div>
  )
}

export default FixedMobileCall
